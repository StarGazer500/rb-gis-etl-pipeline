from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.shared.job.model import Job


class JobRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, **fields) -> Job:
        job = Job(**fields)
        self.session.add(job)
        await self.session.flush()
        return job

    async def get_by_job_id(self, job_id: str) -> Job | None:
        result = await self.session.execute(select(Job).filter_by(job_id=job_id))
        return result.scalars().first()

    async def update(self, job_id: str, **fields) -> Job | None:
        job = await self.get_by_job_id(job_id)
        if job:
            for k, v in fields.items():
                setattr(job, k, v)
        return job

    async def list_all(self, limit: int = 20, offset: int = 0) -> list[Job]:
        result = await self.session.execute(
            select(Job).order_by(Job.submitted_at.desc()).limit(limit).offset(offset)
        )
        return list(result.scalars().all())

    async def list_by_status(self, status: str, limit: int = 20, offset: int = 0) -> list[Job]:
        result = await self.session.execute(
            select(Job)
            .filter_by(status=status)
            .order_by(Job.submitted_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())
