"""Health and system schemas."""

from typing import Dict, Literal
from datetime import datetime
from pydantic import BaseModel, Field


class ComponentStatus(BaseModel):
    """Status details for an individual system component."""
    status: str = Field(..., description="Component status: ok, connected, degraded, unreachable")
    message: str = Field(..., description="Descriptive status message or error details")


class HealthResponse(BaseModel):
    """
    Health check response model.
    - status: 'ok' if both API and DB are healthy.
    - status: 'degraded' if API is working but DB is unavailable.
    - status: 'error' if critical failures exist.
    """
    status: Literal["ok", "degraded", "error"] = Field(
        ...,
        description="Overall system status: 'ok' (all healthy), 'degraded' (API up, DB down), 'error'",
    )
    service: str = Field(default="pushpak-api", description="Service identifier")
    version: str = Field(..., description="Service version")
    timestamp: datetime = Field(..., description="UTC timestamp of the health check")
    environment: str = Field(..., description="Current running environment")
    components: Dict[str, ComponentStatus] = Field(
        ...,
        description="Detailed status breakdown per component (api, database)",
    )


class SystemInfoResponse(BaseModel):
    """Basic system information and capabilities metadata."""
    service: str
    version: str
    environment: str
    phase: str = "Phase 1 - Product Foundation"
    horizons_supported: list[str] = ["T+1", "T+7", "T+15", "T+30", "T+45"]
    target_corridors_count: int = 50
    docs_url: str = "/docs"
