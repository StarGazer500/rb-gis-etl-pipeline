from fastapi import APIRouter, Query
from src.core.cache import cache_clear_pattern

router = APIRouter(prefix="/api/admin", tags=["admin"])

PROJECTS = ["akwaaba", "buffalo", "colobus"]


@router.post("/cache/clear")
async def clear_cache(project: str | None = Query(default=None)):
    """
    Clear the Redis cache.
    - No project param  → clears all project caches
    - ?project=akwaaba  → clears only that project's cache
    """
    if project:
        if project not in PROJECTS:
            return {"error": f"Unknown project '{project}'. Valid: {PROJECTS}"}
        deleted = await cache_clear_pattern(f"{project}:*")
        return {"cleared": project, "keys_deleted": deleted}

    total = 0
    for p in PROJECTS:
        total += await cache_clear_pattern(f"{p}:*")
    return {"cleared": "all", "keys_deleted": total}
