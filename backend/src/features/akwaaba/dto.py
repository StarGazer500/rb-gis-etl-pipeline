from typing import Any, Literal
from pydantic import BaseModel


class SubcompartmentProperties(BaseModel):
    id: int
    subcompartment_id: str | None
    compartment_id: str | None
    area_ha: float | None
    treatment_type: str | None
    planting_status: str | None
    year_planted: str | None
    planting_type: str | None


class GeoJSONGeometry(BaseModel):
    type: str
    coordinates: Any


class SubcompartmentFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    geometry: GeoJSONGeometry | None
    properties: SubcompartmentProperties


class SubcompartmentFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[SubcompartmentFeature]
