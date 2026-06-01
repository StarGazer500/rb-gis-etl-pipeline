from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.features.colobus.repository import ColobusRepository
from src.features.colobus.service import ColobusService
from src.features.colobus.dto import SubcompartmentFeatureCollection

router = APIRouter(prefix="/api/colobus", tags=["colobus"])


def get_service(session: AsyncSession = Depends(get_db_session)) -> ColobusService:
    return ColobusService(ColobusRepository(session))


@router.get("/layers/subcompartments", response_model=SubcompartmentFeatureCollection)
async def get_subcompartments(service: ColobusService = Depends(get_service)):
    return await service.get_subcompartments()
