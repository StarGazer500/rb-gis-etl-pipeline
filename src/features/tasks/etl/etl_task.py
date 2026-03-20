from celery import chord, group

from src.core.celery import celery_app
from src.core.logging import get_logger
from src.core.database import (
    ValidationDbSession,
    AkwaabaDbSession,
    BuffaloDbSession,
    ColobusDbSession,
    TargetDbSession,
)
from .validation_util import Validation
from .etl_util import Extract_Transform_Load


# Layers per schema — mirrors the logic previously in etl_orch.py
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

def _as_etl_conn(session_factory):
    return {'sync': session_factory.kw['bind']}


@celery_app.task(bind=True, name="etl_load_layer")
def etl_load_layer(self, schema, layer_name):
    try:
        source_conn = _as_etl_conn(SOURCE_SESSIONS[schema])
        target_conn = _as_etl_conn(TargetDbSession)
        fn = getattr(Extract_Transform_Load, layer_name)
        fn(schema, source_conn, target_conn)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30, max_retries=3)


logger = get_logger("etl")


@celery_app.task(name="etl_on_error")
def etl_on_error(task_id):
    result = celery_app.AsyncResult(task_id)
    logger.error("[ETL] Task %s failed:\n%s", task_id, result.traceback)


@celery_app.task(name="etl_finalize")
def etl_finalize(results):
    logger.info("ETL complete — all layers loaded successfully")


@celery_app.task(bind=True, name="etl_pipeline_task")
def etl_pipeline_task(self):
    try:
        val_conn = _as_etl_conn(ValidationDbSession)

        akwaaba_val = Validation.validate_schema(val_conn, _as_etl_conn(AkwaabaDbSession), 'akwaaba_schema')
        buffalo_val = Validation.validate_schema(val_conn, _as_etl_conn(BuffaloDbSession), 'buffalo_schema')
        colobus_val = Validation.validate_schema(val_conn, _as_etl_conn(ColobusDbSession), 'colobus_schema')

        if not all([akwaaba_val, buffalo_val, colobus_val]):
            raise RuntimeError("Schema validation failed — aborting ETL")

        chord(
            group(
                etl_load_layer.s(schema, layer).set(link_error=etl_on_error.s())
                for schema, layers in SCHEMA_LAYERS.items()
                for layer in layers
            ),
            etl_finalize.s().set(link_error=etl_on_error.s()),
        ).apply_async()

    except Exception as exc:
        raise self.retry(exc=exc, countdown=60, max_retries=3)
