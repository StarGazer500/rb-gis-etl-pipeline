import uuid

from celery import chord, group
from sqlalchemy.orm import Session

from src.core.logging import get_logger
from src.shared.job.service import JobService
from src.features.etl.utils.validation_util import Validation
from src.features.etl.task import (
    etl_load_layer,
    etl_finalize,
    etl_on_error,
    SCHEMA_LAYERS,
)

logger = get_logger("etl.service")


class ETLService:

    def __init__(self, val: Session, source: Session):
        self.val = val
        self.source = source

    def run(self, schema: str):
        logger.info("[ETL] Starting validation for %s", schema)

        is_valid = Validation.validate_schema(self.val, self.source, schema)
        if not is_valid:
            logger.warning("[ETL] Validation failed for %s — aborting", schema)
            return None

        logger.info("[ETL] Validation passed for %s — dispatching tasks", schema)

        job_id = str(uuid.uuid4())
        JobService(self.val).create_job(job_id=job_id, job_type=f"etl_{schema}", params={"schema": schema})
        logger.info("[ETL] Job created: %s", job_id)

        chord(
            group(
                etl_load_layer.s(schema, layer).set(link_error=etl_on_error.s(job_id))
                for layer in SCHEMA_LAYERS[schema]
            ),
            etl_finalize.s(job_id).set(link_error=etl_on_error.s(job_id)),
        ).apply_async()

        logger.info("[ETL] Chord dispatched for %s with job_id=%s", schema, job_id)
        return job_id
