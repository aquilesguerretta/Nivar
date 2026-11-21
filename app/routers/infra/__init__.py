"""US infrastructure viewport APIs (EIA + HIFLD + PostGIS)."""

from fastapi import APIRouter

from app.routers.infra import batteries, generation, transmission

router = APIRouter(prefix="/api/infra", tags=["infra"])
router.include_router(generation.router)
router.include_router(transmission.router)
router.include_router(batteries.router)
