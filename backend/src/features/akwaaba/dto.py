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


# ── Phase 2 ───────────────────────────────────────────────────────────────────

class Phase2Properties(BaseModel):
    id: int
    fid: str | None
    classname: str | None
    area_ha: float | None
    reserve_name: str | None
    treatment_type: str | None
    planting_type: str | None


class Phase2Feature(BaseModel):
    type: Literal["Feature"] = "Feature"
    geometry: GeoJSONGeometry | None
    properties: Phase2Properties


class Phase2FeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[Phase2Feature]


# ── Overlay layers ────────────────────────────────────────────────────────────

class NurseryFenceProperties(BaseModel):
    fid: int
    name: str | None
    area: float | None


class NurseryFenceFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    geometry: GeoJSONGeometry | None
    properties: NurseryFenceProperties


class NurseryFenceFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[NurseryFenceFeature]


class SimplePointProperties(BaseModel):
    id: int


class SimplePointFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    geometry: GeoJSONGeometry | None
    properties: SimplePointProperties


class SimplePointFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[SimplePointFeature]


class RoadProperties(BaseModel):
    id: int
    name: str | None
    highway: str | None
    surface: str | None


class RoadFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    geometry: GeoJSONGeometry | None
    properties: RoadProperties


class RoadFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[RoadFeature]


# ── Lease Area Stratification ─────────────────────────────────────────────────

class LeaseAreaProperties(BaseModel):
    id: int
    category: str | None
    subcategory: str | None
    area_ha: float | None


class LeaseAreaFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    geometry: GeoJSONGeometry | None
    properties: LeaseAreaProperties


class LeaseAreaFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[LeaseAreaFeature]
