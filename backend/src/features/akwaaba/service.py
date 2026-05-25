from sqlalchemy.ext.asyncio import AsyncSession

from src.core.cache import cache_get, cache_set
from src.features.akwaaba import repository
from src.features.akwaaba.dto import (
    NurseryFenceFeatureCollection,
    Phase2FeatureCollection,
    RoadFeatureCollection,
    SimplePointFeatureCollection,
    SubcompartmentFeatureCollection,
)

_CACHE_TTL = 3600  # 1 hour


async def get_subcompartments(session: AsyncSession) -> SubcompartmentFeatureCollection:
    key = "akwaaba:subcompartments"
    cached = await cache_get(key)
    if cached is not None:
        return SubcompartmentFeatureCollection.model_validate(cached)
    result = await repository.get_subcompartments(session)
    await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
    return result


async def get_phase2(session: AsyncSession) -> Phase2FeatureCollection:
    key = "akwaaba:phase2"
    cached = await cache_get(key)
    if cached is not None:
        return Phase2FeatureCollection.model_validate(cached)
    result = await repository.get_phase2(session)
    await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
    return result


async def get_nursery_fence(session: AsyncSession) -> NurseryFenceFeatureCollection:
    key = "akwaaba:nursery_fence"
    cached = await cache_get(key)
    if cached is not None:
        return NurseryFenceFeatureCollection.model_validate(cached)
    result = await repository.get_nursery_fence(session)
    await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
    return result


async def get_bibiani_centre(session: AsyncSession) -> SimplePointFeatureCollection:
    key = "akwaaba:bibiani_centre"
    cached = await cache_get(key)
    if cached is not None:
        return SimplePointFeatureCollection.model_validate(cached)
    result = await repository.get_bibiani_centre(session)
    await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
    return result


async def get_office_location(session: AsyncSession) -> SimplePointFeatureCollection:
    key = "akwaaba:office_location"
    cached = await cache_get(key)
    if cached is not None:
        return SimplePointFeatureCollection.model_validate(cached)
    result = await repository.get_office_location(session)
    await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
    return result


async def get_primary_roads(session: AsyncSession) -> RoadFeatureCollection:
    key = "akwaaba:primary_roads"
    cached = await cache_get(key)
    if cached is not None:
        return RoadFeatureCollection.model_validate(cached)
    result = await repository.get_primary_roads(session)
    await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
    return result
