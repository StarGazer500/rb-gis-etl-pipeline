from src.core.cache import cache_get, cache_set
from src.features.colobus.repository import ColobusRepository
from src.features.colobus.dto import SubcompartmentFeatureCollection

_CACHE_TTL = 3600  # 1 hour


class ColobusService:
    def __init__(self, repository: ColobusRepository) -> None:
        self.repository = repository

    async def get_subcompartments(self) -> SubcompartmentFeatureCollection:
        key = "colobus:subcompartments"
        cached = await cache_get(key)
        if cached is not None:
            return SubcompartmentFeatureCollection.model_validate(cached)
        result = await self.repository.get_subcompartments()
        await cache_set(key, result.model_dump(), ttl=_CACHE_TTL)
        return result
