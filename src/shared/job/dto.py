
from pydantic import BaseModel





class JobResponse(BaseModel):
    id:           int
    job_id:      str
    job_type:     str
    status:       str
    params:       dict | None
    result:       dict | None
    error:        str | None
    submitted_at: str | None
    started_at:   str | None
    completed_at: str | None