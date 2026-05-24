from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.features.akwaaba import service
from src.features.akwaaba.dto import SubcompartmentFeatureCollection

router = APIRouter(prefix="/api/akwaaba", tags=["akwaaba"])


@router.get("/layers/subcompartments", response_model=SubcompartmentFeatureCollection)
async def get_subcompartments(session: AsyncSession = Depends(get_db_session)):
    return await service.get_subcompartments(session)
