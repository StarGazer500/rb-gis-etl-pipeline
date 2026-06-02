from src.core.cache import cache_get, cache_set
from src.features.buffalo.repository import BuffaloRepository
from src.features.buffalo.dto import LeaseAreaFeatureCollection, SubcompartmentFeatureCollection

_CACHE_TTL = 3600  # 1 hour


class BuffaloService:
    def __init__(self, repository: BuffaloRepository) -> None:
        self.repository = repository

    async def get_subcompartments(self) -> SubcompartmentFeatureCollection:
        key = "buffalo:subcompartments"
        cached = await cache_get(key)
        if cached is not None:
            return SubcompartmentFeatureCollection.model_validate(cached)
        result = await self.repository.get_subcompartments()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result

    async def get_lease_areas(self) -> LeaseAreaFeatureCollection:
        key = "buffalo:lease_areas"
        cached = await cache_get(key)
        if cached is not None:
            return LeaseAreaFeatureCollection.model_validate(cached)
        result = await self.repository.get_lease_areas()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result
