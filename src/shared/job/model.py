from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON

from src.core.base import Base


class Job(Base):
    __tablename__ = "jobs"

    id       = Column(Integer,    primary_key=True, autoincrement=True)
    job_id  = Column(String(36), unique=True, nullable=False, index=True)
    job_type = Column(String(50), nullable=False)  # e.g. drone_tile, shapefile, reproject

    # queued → started → processing → completed / failed
    status = Column(String(20), nullable=False, default="queued")
    error  = Column(Text,       nullable=True)   # populated on failure

    # Job-type-specific input parameters and output result stored as JSON.
    # drone_tile  params: {reserve_name, input_path, output_path, total_tiles, group_id}
    # shapefile   params: {file_path, layer_name}
    # reproject   params: {features, target_crs}
    params = Column(JSON, nullable=True)
    result = Column(JSON, nullable=True)

    submitted_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    started_at   = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)