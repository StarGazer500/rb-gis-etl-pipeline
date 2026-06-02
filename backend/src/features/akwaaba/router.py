from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.features.akwaaba.repository import AkwaabaRepository
from src.features.akwaaba.service import AkwaabaService
from src.features.akwaaba.dto import (
    LeaseAreaFeatureCollection,
    NurseryFenceFeatureCollection,
    Phase2FeatureCollection,
    RoadFeatureCollection,
    SimplePointFeatureCollection,
    SubcompartmentFeatureCollection,
)

router = APIRouter(prefix="/api/akwaaba", tags=["akwaaba"])


def get_service(session: AsyncSession = Depends(get_db_session)) -> AkwaabaService:
    return AkwaabaService(AkwaabaRepository(session))


@router.get("/layers/subcompartments", response_model=SubcompartmentFeatureCollection)
async def get_subcompartments(service: AkwaabaService = Depends(get_service)):
    return await service.get_subcompartments()


@router.get("/layers/phase2", response_model=Phase2FeatureCollection)
async def get_phase2(service: AkwaabaService = Depends(get_service)):
    return await service.get_phase2()


@router.get("/layers/nursery-fence", response_model=NurseryFenceFeatureCollection)
async def get_nursery_fence(service: AkwaabaService = Depends(get_service)):
    return await service.get_nursery_fence()


@router.get("/layers/bibiani-centre", response_model=SimplePointFeatureCollection)
async def get_bibiani_centre(service: AkwaabaService = Depends(get_service)):
    return await service.get_bibiani_centre()


@router.get("/layers/office-location", response_model=SimplePointFeatureCollection)
async def get_office_location(service: AkwaabaService = Depends(get_service)):
    return await service.get_office_location()


@router.get("/layers/primary-roads", response_model=RoadFeatureCollection)
async def get_primary_roads(service: AkwaabaService = Depends(get_service)):
    return await service.get_primary_roads()


@router.get("/layers/lease-areas", response_model=LeaseAreaFeatureCollection)
async def get_lease_areas(service: AkwaabaService = Depends(get_service)):
    return await service.get_lease_areas()
