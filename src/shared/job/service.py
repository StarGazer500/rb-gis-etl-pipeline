from sqlalchemy.orm import Session

from src.shared.job.repository import JobRepository


class JobService:

    def __init__(self, session: Session):
        self.repo = JobRepository(session)

    def create_job(self, job_id: str, job_type: str, params: dict | None = None) -> dict:
        """Called by the API after dispatching a Celery task."""
        job = self.repo.create(job_id=job_id, job_type=job_type, params=params, status="queued")
        return self._to_dict(job)

    def update_job(self, job_id: str, **fields) -> None:
        """Called by Celery workers to report status changes."""
        self.repo.update(job_id, **fields)

    def get_job(self, job_id: str) -> dict | None:
        job = self.repo.get_by_job_id(job_id)
        return self._to_dict(job) if job else None

 

    def list_jobs(self, limit: int = 100) -> list[dict]:
        jobs = self.repo.list_all(limit=limit)
        return [self._to_dict(j) for j in jobs]

    def _to_dict(self, job) -> dict:
        return {
            "id":           job.id,
            "job_id":      job.job_id,
            "job_type":     job.job_type,
            "status":       job.status,
            "params":       job.params,
            "result":       job.result,
            "error":        job.error,
            "submitted_at": job.submitted_at.isoformat() if job.submitted_at else None,
            "started_at":   job.started_at.isoformat()   if job.started_at   else None,
            "completed_at": job.completed_at.isoformat() if job.completed_at else None,
        }