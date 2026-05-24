from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.features.akwaaba.dto import (
    GeoJSONGeometry,
    SubcompartmentFeature,
    SubcompartmentFeatureCollection,
    SubcompartmentProperties,
)


async def get_subcompartments(session: AsyncSession) -> SubcompartmentFeatureCollection:
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
    result = await session.execute(sql)
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
