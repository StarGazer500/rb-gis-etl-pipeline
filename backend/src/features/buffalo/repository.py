from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.features.buffalo.dto import (
    GeoJSONGeometry,
    LeaseAreaFeature,
    LeaseAreaFeatureCollection,
    LeaseAreaProperties,
    SubcompartmentFeature,
    SubcompartmentFeatureCollection,
    SubcompartmentProperties,
)


class BuffaloRepository:
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
            FROM buffalo_schema.subcompartments
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

    async def get_lease_areas(self) -> LeaseAreaFeatureCollection:
        sql = text("""
            SELECT id, category, subcategory, area_ha, ST_AsGeoJSON(geom)::json AS geometry
            FROM buffalo_schema.lease_areas_stratum
            ORDER BY id
        """)
        result = await self.session.execute(sql)
        rows = result.mappings().all()
        features = [
            LeaseAreaFeature(
                geometry=GeoJSONGeometry(**row["geometry"]) if row["geometry"] else None,
                properties=LeaseAreaProperties(
                    id=row["id"],
                    category=row["category"],
                    subcategory=row["subcategory"],
                    area_ha=row["area_ha"],
                ),
            )
            for row in rows
        ]
        return LeaseAreaFeatureCollection(features=features)
