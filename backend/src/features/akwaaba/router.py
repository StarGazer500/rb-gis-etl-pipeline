from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.features.akwaaba import service
from src.features.akwaaba.dto import (
    NurseryFenceFeatureCollection,
    Phase2FeatureCollection,
    RoadFeatureCollection,
    SimplePointFeatureCollection,
    SubcompartmentFeatureCollection,
)

router = APIRouter(prefix="/api/akwaaba", tags=["akwaaba"])


@router.get("/layers/subcompartments", response_model=SubcompartmentFeatureCollection)
async def get_subcompartments(session: AsyncSession = Depends(get_db_session)):
    return await service.get_subcompartments(session)


@router.get("/layers/phase2", response_model=Phase2FeatureCollection)
async def get_phase2(session: AsyncSession = Depends(get_db_session)):
    return await service.get_phase2(session)


@router.get("/layers/nursery-fence", response_model=NurseryFenceFeatureCollection)
async def get_nursery_fence(session: AsyncSession = Depends(get_db_session)):
    return await service.get_nursery_fence(session)


@router.get("/layers/bibiani-centre", response_model=SimplePointFeatureCollection)
async def get_bibiani_centre(session: AsyncSession = Depends(get_db_session)):
    return await service.get_bibiani_centre(session)


@router.get("/layers/office-location", response_model=SimplePointFeatureCollection)
async def get_office_location(session: AsyncSession = Depends(get_db_session)):
    return await service.get_office_location(session)


@router.get("/layers/primary-roads", response_model=RoadFeatureCollection)
async def get_primary_roads(session: AsyncSession = Depends(get_db_session)):
    return await service.get_primary_roads(session)
