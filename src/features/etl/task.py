from celery import chord, group
from datetime import datetime, timezone
import uuid

from src.core.celery import celery_app
from src.core.logging import get_logger
from src.core.database import (
    get_db,
    ValidationDbSession,
    AkwaabaDbSession,
    BuffaloDbSession,
    ColobusDbSession,
    TargetDbSession,
)
from src.features.etl.utils.validation_util import Validation
from src.features.etl.utils.etl_util import Extract_Transform_Load
from src.shared.utils import _update_job, _create_job


SCHEMA_LAYERS = {
    'akwaaba_schema': [
        'load_leased_areas', 'load_compartments', 'load_subcompartments',
        'load_unplantable_areas', 'load_field_mapped_farms', 'load_intercropped_farms',
        'load_rb_roads', 'load_rb_assigned_psps', 'load_rb_completed_psps',
    ],
    'buffalo_schema': [
        'load_leased_areas', 'load_compartments', 'load_subcompartments',
        'load_unplantable_areas', 'load_rb_roads', 'load_rb_assigned_psps',
        'load_rb_completed_psps',
    ],
    'colobus_schema': [
        'load_leased_areas', 'load_compartments', 'load_subcompartments',
        'load_unplantable_areas', 'load_field_mapped_farms',
        'load_rb_roads', 'load_rb_assigned_psps', 'load_rb_completed_psps',
    ],
}

SOURCE_SESSIONS = {
    'akwaaba_schema': AkwaabaDbSession,
    'buffalo_schema': BuffaloDbSession,
    'colobus_schema': ColobusDbSession,
}

logger = get_logger("etl")


@celery_app.task(bind=True, name="etl_load_layer")
def etl_load_layer(self, schema, layer_name):
    logger.info("[ETL] Loading %s → %s (attempt %d)", schema, layer_name, self.request.retries + 1)
    try:
        with get_db(SOURCE_SESSIONS[schema]) as source_session:
            with get_db(TargetDbSession) as target_session:
                fn = getattr(Extract_Transform_Load, layer_name)
                fn(schema, source_session, target_session)
        logger.info("[ETL] Done: %s → %s", schema, layer_name)
    except Exception as exc:
        logger.error("[ETL] Failed: %s → %s | %s", schema, layer_name, exc)
        raise self.retry(exc=exc, countdown=30, max_retries=3)


@celery_app.task(name="etl_on_error")
def etl_on_error(task_id, job_id=None):
    result = celery_app.AsyncResult(task_id)
    logger.error("[ETL] Task %s failed:\n%s", task_id, result.traceback)
    if job_id:
        _update_job(job_id, status="failed", error=str(result.traceback), completed_at=datetime.now(timezone.utc))


@celery_app.task(name="etl_finalize")
def etl_finalize(_, job_id=None):
    logger.info("ETL complete — all layers loaded successfully")
    if job_id:
        _update_job(job_id, status="completed", completed_at=datetime.now(timezone.utc))


@celery_app.task(bind=True, name="etl_pipeline_task")
def etl_pipeline_task(self):
    job_id = str(uuid.uuid4())
    try:
        _create_job(job_id=job_id, job_type="etl_all")

        with get_db(ValidationDbSession) as val_session:
            with get_db(AkwaabaDbSession) as akw_session:
                akwaaba_val = Validation.validate_schema(val_session, akw_session, 'akwaaba_schema')
            with get_db(BuffaloDbSession) as buf_session:
                buffalo_val = Validation.validate_schema(val_session, buf_session, 'buffalo_schema')
            with get_db(ColobusDbSession) as col_session:
                colobus_val = Validation.validate_schema(val_session, col_session, 'colobus_schema')

        if not all([akwaaba_val, buffalo_val, colobus_val]):
            raise RuntimeError("Schema validation failed — aborting ETL")

        chord(
            group(
                etl_load_layer.s(schema, layer).set(link_error=etl_on_error.s(job_id))
                for schema, layers in SCHEMA_LAYERS.items()
                for layer in layers
            ),
            etl_finalize.s(job_id).set(link_error=etl_on_error.s(job_id)),
        ).apply_async()

    except Exception as exc:
        _update_job(job_id, status="failed", error=str(exc), completed_at=datetime.now(timezone.utc))
        raise self.retry(exc=exc, countdown=60, max_retries=3)
