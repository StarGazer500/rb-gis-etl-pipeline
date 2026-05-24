from sqlalchemy.ext.asyncio import AsyncSession

from src.core.cache import cache_get, cache_set
from src.features.akwaaba import repository
from src.features.akwaaba.dto import SubcompartmentFeatureCollection

_CACHE_KEY = "akwaaba:subcompartments"
_CACHE_TTL = 3600  # 1 hour


async def get_subcompartments(session: AsyncSession) -> SubcompartmentFeatureCollection:
    cached = await cache_get(_CACHE_KEY)
    if cached is not None:
        
        return SubcompartmentFeatureCollection.model_validate(cached)
        

    result = await repository.get_subcompartments(session)
    await cache_set(_CACHE_KEY, result.model_dump(), ttl=_CACHE_TTL)
    return result
