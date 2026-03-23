
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core.database import (
    get_val_db_session,
    get_akw_session,
    get_buf_session,
    get_col_session,
)
from src.features.etl.service import ETLService


router = APIRouter(prefix="/etl", tags=["ETL"])


@router.post("/run/akwaaba")
def run_akwaaba(val_session: Session = Depends(get_val_db_session), source_session: Session = Depends(get_akw_session)):
    job_id = ETLService(val_session, source_session).run("akwaaba_schema")
    if not job_id:
        raise HTTPException(status_code=400, detail="Schema validation failed for akwaaba")
    return {"job_id": job_id, "project": "akwaaba", "status": "queued"}


@router.post("/run/buffalo")
def run_buffalo(val_session: Session = Depends(get_val_db_session), source_session: Session = Depends(get_buf_session)):
    job_id = ETLService(val_session, source_session).run("buffalo_schema")
    if not job_id:
        raise HTTPException(status_code=400, detail="Schema validation failed for buffalo")
    return {"job_id": job_id, "project": "buffalo", "status": "queued"}


@router.post("/run/colobus")
def run_colobus(val_session: Session = Depends(get_val_db_session), source_session: Session = Depends(get_col_session)):
    job_id = ETLService(val_session, source_session).run("colobus_schema")
    if not job_id:
        raise HTTPException(status_code=400, detail="Schema validation failed for colobus")
    return {"job_id": job_id, "project": "colobus", "status": "queued"}
