"""API v1 master router."""

from fastapi import APIRouter
from app.api.v1.endpoints import health, system

api_v1_router = APIRouter(prefix="/api/v1")

# Register endpoint routers
api_v1_router.include_router(health.router)
api_v1_router.include_router(system.router)
