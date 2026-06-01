from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.features.buffalo.repository import BuffaloRepository
from src.features.buffalo.service import BuffaloService
from src.features.buffalo.dto import SubcompartmentFeatureCollection

router = APIRouter(prefix="/api/buffalo", tags=["buffalo"])


def get_service(session: AsyncSession = Depends(get_db_session)) -> BuffaloService:
    return BuffaloService(BuffaloRepository(session))


@router.get("/layers/subcompartments", response_model=SubcompartmentFeatureCollection)
async def get_subcompartments(service: BuffaloService = Depends(get_service)):
    return await service.get_subcompartments()
