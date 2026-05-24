from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from src.shared.job.model import Job
from src.shared.job.repository import JobRepository


class JobService:

    def __init__(self, session: AsyncSession):
        self.repo = JobRepository(session)

    async def create_job(self, job_id: str, job_type: str, params: dict | None = None) -> Job:
        return await self.repo.create(job_id=job_id, job_type=job_type, params=params, status="queued")

    async def update_job(self, job_id: str, **fields) -> None:
        await self.repo.update(job_id, **fields)

    async def get_job(self, job_id: str) -> Optional[Job]:
        return await self.repo.get_by_job_id(job_id)

    async def list_jobs(self, limit: int = 20, offset: int = 0) -> list[Job]:
        return await self.repo.list_all(limit=limit, offset=offset)
