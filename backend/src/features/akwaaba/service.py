from src.core.cache import cache_get, cache_set
from src.features.akwaaba.repository import AkwaabaRepository
from src.features.akwaaba.dto import (
    LeaseAreaFeatureCollection,
    NurseryFenceFeatureCollection,
    Phase2FeatureCollection,
    RoadFeatureCollection,
    SimplePointFeatureCollection,
    SubcompartmentFeatureCollection,
)

_CACHE_TTL = 3600  # 1 hour


class AkwaabaService:
    def __init__(self, repository: AkwaabaRepository) -> None:
        self.repository = repository

    async def get_subcompartments(self) -> SubcompartmentFeatureCollection:
        key = "akwaaba:subcompartments"
        cached = await cache_get(key)
        if cached is not None:
            return SubcompartmentFeatureCollection.model_validate(cached)
        result = await self.repository.get_subcompartments()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result

    async def get_phase2(self) -> Phase2FeatureCollection:
        key = "akwaaba:phase2"
        cached = await cache_get(key)
        if cached is not None:
            return Phase2FeatureCollection.model_validate(cached)
        result = await self.repository.get_phase2()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result

    async def get_nursery_fence(self) -> NurseryFenceFeatureCollection:
        key = "akwaaba:nursery_fence"
        cached = await cache_get(key)
        if cached is not None:
            return NurseryFenceFeatureCollection.model_validate(cached)
        result = await self.repository.get_nursery_fence()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result

    async def get_bibiani_centre(self) -> SimplePointFeatureCollection:
        key = "akwaaba:bibiani_centre"
        cached = await cache_get(key)
        if cached is not None:
            return SimplePointFeatureCollection.model_validate(cached)
        result = await self.repository.get_bibiani_centre()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result

    async def get_office_location(self) -> SimplePointFeatureCollection:
        key = "akwaaba:office_location"
        cached = await cache_get(key)
        if cached is not None:
            return SimplePointFeatureCollection.model_validate(cached)
        result = await self.repository.get_office_location()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result

    async def get_primary_roads(self) -> RoadFeatureCollection:
        key = "akwaaba:primary_roads"
        cached = await cache_get(key)
        if cached is not None:
            return RoadFeatureCollection.model_validate(cached)
        result = await self.repository.get_primary_roads()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result

    async def get_lease_areas(self) -> LeaseAreaFeatureCollection:
        key = "akwaaba:lease_areas"
        cached = await cache_get(key)
        if cached is not None:
            return LeaseAreaFeatureCollection.model_validate(cached)
        result = await self.repository.get_lease_areas()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result
