from datetime import datetime
from pydantic import BaseModel, ConfigDict


class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id:           int
    job_id:       str
    job_type:     str
    status:       str
    params:       dict | None
    result:       dict | None
    error:        str | None
    submitted_at: datetime | None
    started_at:   datetime | None
    completed_at: datetime | None
