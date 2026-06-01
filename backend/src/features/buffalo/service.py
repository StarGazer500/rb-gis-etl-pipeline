from src.core.cache import cache_get, cache_set
from src.features.buffalo.repository import BuffaloRepository
from src.features.buffalo.dto import SubcompartmentFeatureCollection

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
