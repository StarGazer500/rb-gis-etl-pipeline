from sqlalchemy import text
from sqlalchemy.orm import Session

from src.shared.job.model import Job


class JobRepository:

    def __init__(self, session: Session):
        self.session = session

    def create(self, **fields) -> Job:
        job = Job(**fields)
        self.session.add(job)
        self.session.flush()
        return job

    def get_by_job_id(self, job_id: str) -> Job | None:
        return self.session.query(Job).filter_by(job_id=job_id).first()

    def update(self, job_id: str, **fields) -> Job | None:
        job = self.get_by_job_id(job_id)
        if job:
            for k, v in fields.items():
                setattr(job, k, v)
        return job

    def list_all(self, limit: int = 100) -> list[Job]:
        return (
            self.session.query(Job)
            .order_by(Job.submitted_at.desc())
            .limit(limit)
            .all()
        )



    def list_by_status(self, status: str) -> list[Job]:
        return (
            self.session.query(Job)
            .filter_by(status=status)
            .order_by(Job.submitted_at.desc())
            .all()
        )