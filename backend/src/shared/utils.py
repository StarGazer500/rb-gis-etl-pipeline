from src.core.database import get_db, ValidationDbSession
from src.shared.job.service import JobService


def _create_job(job_id: str, job_type: str, params: dict = None) -> None:
    with get_db(ValidationDbSession) as session:
        JobService(session).create_job(job_id=job_id, job_type=job_type, params=params)


def _update_job(job_id: str, **fields) -> None:
    with get_db(ValidationDbSession) as session:
        JobService(session).update_job(job_id, **fields)
