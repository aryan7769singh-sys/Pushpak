"""System information endpoint."""

from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import SystemInfoResponse

router = APIRouter(tags=["System"])


@router.get("/system/info", response_model=SystemInfoResponse)
def get_system_info() -> SystemInfoResponse:
    """Return system information and supported horizon metadata."""
    return SystemInfoResponse(
        service=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
        phase="Phase 1 - Product Foundation",
        horizons_supported=["T+1", "T+7", "T+15", "T+30", "T+45"],
        target_corridors_count=50,
        docs_url="/docs",
    )
