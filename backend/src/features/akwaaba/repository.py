from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.features.akwaaba.dto import (
    GeoJSONGeometry,
    NurseryFenceFeature,
    NurseryFenceFeatureCollection,
    NurseryFenceProperties,
    Phase2Feature,
    Phase2FeatureCollection,
    Phase2Properties,
    RoadFeature,
    RoadFeatureCollection,
    RoadProperties,
    SimplePointFeature,
    SimplePointFeatureCollection,
    SimplePointProperties,
    SubcompartmentFeature,
    SubcompartmentFeatureCollection,
    SubcompartmentProperties,
)


class AkwaabaRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_subcompartments(self) -> SubcompartmentFeatureCollection:
        sql = text("""
            SELECT
                id,
                subcompartment_id,
                compartment_id,
                area_ha,
                treatment_type,
                planting_status,
                year_planted,
                planting_type,
                ST_AsGeoJSON(geom)::json AS geometry
            FROM akwaaba_schema.subcompartments
            ORDER BY id
        """)
        result = await self.session.execute(sql)
        rows = result.mappings().all()
        features = [
            SubcompartmentFeature(
                geometry=GeoJSONGeometry(**row["geometry"]) if row["geometry"] else None,
                properties=SubcompartmentProperties(
                    id=row["id"],
                    subcompartment_id=row["subcompartment_id"],
                    compartment_id=row["compartment_id"],
                    area_ha=row["area_ha"],
                    treatment_type=row["treatment_type"],
                    planting_status=row["planting_status"],
                    year_planted=row["year_planted"],
                    planting_type=row["planting_type"],
                ),
            )
            for row in rows
        ]
        return SubcompartmentFeatureCollection(features=features)

    async def get_phase2(self) -> Phase2FeatureCollection:
        sql = text("""
            SELECT
                id,
                fid,
                classname,
                area_ha,
                reserve_name,
                treatment_type,
                planting_type,
                ST_AsGeoJSON(geom)::json AS geometry
            FROM akwaaba_schema.phase2_lulc
            ORDER BY id
        """)
        result = await self.session.execute(sql)
        rows = result.mappings().all()
        features = [
            Phase2Feature(
                geometry=GeoJSONGeometry(**row["geometry"]) if row["geometry"] else None,
                properties=Phase2Properties(
                    id=row["id"],
                    fid=row["fid"],
                    classname=row["classname"],
                    area_ha=row["area_ha"],
                    reserve_name=row["reserve_name"],
                    treatment_type=row["treatment_type"],
                    planting_type=row["planting_type"],
                ),
            )
            for row in rows
        ]
        return Phase2FeatureCollection(features=features)

    async def get_nursery_fence(self) -> NurseryFenceFeatureCollection:
        sql = text("""
            SELECT fid, "name", "Area" AS area, ST_AsGeoJSON(geom)::json AS geometry
            FROM akwaaba_schema.bassengele_nursery_fence
        """)
        result = await self.session.execute(sql)
        rows = result.mappings().all()
        features = [
            NurseryFenceFeature(
                geometry=GeoJSONGeometry(**row["geometry"]) if row["geometry"] else None,
                properties=NurseryFenceProperties(fid=row["fid"], name=row["name"], area=row["area"]),
            )
            for row in rows
        ]
        return NurseryFenceFeatureCollection(features=features)

    async def get_bibiani_centre(self) -> SimplePointFeatureCollection:
        sql = text("""
            SELECT id, ST_AsGeoJSON(geom)::json AS geometry
            FROM akwaaba_schema.bibiani_centre
        """)
        result = await self.session.execute(sql)
        rows = result.mappings().all()
        features = [
            SimplePointFeature(
                geometry=GeoJSONGeometry(**row["geometry"]) if row["geometry"] else None,
                properties=SimplePointProperties(id=row["id"]),
            )
            for row in rows
        ]
        return SimplePointFeatureCollection(features=features)

    async def get_office_location(self) -> SimplePointFeatureCollection:
        sql = text("""
            SELECT id, ST_AsGeoJSON(geom)::json AS geometry
            FROM akwaaba_schema.office_location
        """)
        result = await self.session.execute(sql)
        rows = result.mappings().all()
        features = [
            SimplePointFeature(
                geometry=GeoJSONGeometry(**row["geometry"]) if row["geometry"] else None,
                properties=SimplePointProperties(id=row["id"]),
            )
            for row in rows
        ]
        return SimplePointFeatureCollection(features=features)

    async def get_primary_roads(self) -> RoadFeatureCollection:
        sql = text("""
            SELECT id, name, highway, surface, ST_AsGeoJSON(geom)::json AS geometry
            FROM akwaaba_schema.primary_roads
        """)
        result = await self.session.execute(sql)
        rows = result.mappings().all()
        features = [
            RoadFeature(
                geometry=GeoJSONGeometry(**row["geometry"]) if row["geometry"] else None,
                properties=RoadProperties(
                    id=row["id"],
                    name=row["name"],
                    highway=row["highway"],
                    surface=row["surface"],
                ),
            )
            for row in rows
        ]
        return RoadFeatureCollection(features=features)
