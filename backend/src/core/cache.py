import json
from typing import Any, Optional

import redis.asyncio as aioredis

from src.core.config import settings

_client: Optional[aioredis.Redis] = None


def _get_client() -> aioredis.Redis:
    global _client
    if _client is None:
        _client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    return _client


async def cache_get(key: str) -> Optional[Any]:
    """Return the cached value for *key*, or None on a miss."""
    raw = await _get_client().get(key)
    if raw is None:
        return None
    return json.loads(raw)


async def cache_set(key: str, value: Any, ttl: int = 3600) -> None:
    """Store *value* under *key* with the given TTL in seconds (default 1 h)."""
    await _get_client().setex(key, ttl, json.dumps(value))


async def cache_delete(key: str) -> None:
    """Explicitly evict a cache entry (e.g. after a data update)."""
    await _get_client().delete(key)


async def cache_clear_pattern(pattern: str) -> int:
    """Delete all keys matching *pattern* (e.g. 'akwaaba:*'). Returns count deleted."""
    client = _get_client()
    keys = await client.keys(pattern)
    if not keys:
        return 0
    return await client.delete(*keys)
