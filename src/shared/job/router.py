from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core.database import get_local_db_session
from src.shared.job.dto import JobResponse
from src.shared.job.service import JobService

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("", response_model=list[JobResponse])
def list_jobs(limit: int = 100, session: Session = Depends(get_local_db_session)):
    return JobService(session).list_jobs(limit=limit)


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str, session: Session = Depends(get_local_db_session)):
    job = JobService(session).get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job