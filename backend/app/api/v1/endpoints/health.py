"""Health check endpoint."""

from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.db.session import check_db_connection
from app.schemas.health import HealthResponse, ComponentStatus

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    """
    Health check endpoint for PUSHPAK API.
    
    Returns:
    - status: 'ok' if both API and Database are healthy.
    - status: 'degraded' if API is working but Database is unavailable/unreachable.
    - Detailed component status breakdown for both API and Database.
    """
    db_connected, db_message = check_db_connection()

    api_status = ComponentStatus(
        status="ok",
        message="Service responsive",
    )

    database_status = ComponentStatus(
        status="connected" if db_connected else "unreachable",
        message=db_message,
    )

    # Distinguish overall status:
    # If API is working but DB is unavailable, overall status is 'degraded'
    overall_status = "ok" if db_connected else "degraded"

    return HealthResponse(
        status=overall_status,
        service=settings.app_name,
        version=settings.app_version,
        timestamp=datetime.now(timezone.utc),
        environment=settings.environment,
        components={
            "api": api_status,
            "database": database_status,
        },
    )
