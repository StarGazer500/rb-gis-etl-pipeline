from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.shared.job.dto import JobResponse
from src.shared.job.service import JobService

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=list[JobResponse])
async def list_jobs(limit: int = 20, offset: int = 0, session: AsyncSession = Depends(get_db_session)):
    return await JobService(session).list_jobs(limit=limit, offset=offset)


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str, session: AsyncSession = Depends(get_db_session)):
    job = await JobService(session).get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
