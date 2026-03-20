from enum import Enum

from celery import chord, group
from fastapi import APIRouter, HTTPException

from src.core.celery import celery_app
from src.core.database import ValidationDbSession
from src.features.tasks.etl.etl_task import (
    etl_load_layer,
    etl_finalize,
    etl_on_error,
    SCHEMA_LAYERS,
    SOURCE_SESSIONS,
)
from src.features.tasks.etl.validation_util import Validation


router = APIRouter(prefix="/etl", tags=["ETL"])


class Project(str, Enum):
    akwaaba = "akwaaba"
    buffalo = "buffalo"
    colobus = "colobus"


def _as_etl_conn(session_factory):
    return {"sync": session_factory.kw["bind"]}


@router.post("/run/{project}")
def run_etl(project: Project):
    schema = f"{project.value}_schema"

    val_conn = _as_etl_conn(ValidationDbSession)
    source_conn = _as_etl_conn(SOURCE_SESSIONS[schema])

    if not Validation.validate_schema(val_conn, source_conn, schema):
        raise HTTPException(status_code=400, detail=f"Schema validation failed for {project.value}")

    job = chord(
        group(
            etl_load_layer.s(schema, layer).set(link_error=etl_on_error.s())
            for layer in SCHEMA_LAYERS[schema]
        ),
        etl_finalize.s().set(link_error=etl_on_error.s()),
    ).apply_async()

    return {"task_id": job.id, "project": project.value, "status": "queued"}


@router.get("/status/{task_id}")
def get_etl_status(task_id: str):
    result = celery_app.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": result.status,        # PENDING | STARTED | SUCCESS | FAILURE | RETRY
        "ready": result.ready(),
        "successful": result.successful() if result.ready() else None,
        "error": str(result.result) if result.failed() else None,
    }
