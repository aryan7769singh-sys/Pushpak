"""FastAPI application entrypoint for PUSHPAK."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.router import api_v1_router

# Initialize application logger
logger = setup_logging(debug=settings.debug)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for application startup and shutdown events."""
    logger.info(f"Starting {settings.app_name} v{settings.app_version} [{settings.environment}]")
    yield
    logger.info(f"Shutting down {settings.app_name}")


app = FastAPI(
    title="PUSHPAK API",
    description=(
        "Real-time domestic airfare price index platform for India. "
        "SIH 2026 project computing high-frequency airfare indices across 5 horizons (T+1 to T+45)."
    ),
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(api_v1_router)


@app.get("/", include_in_schema=False)
def root():
    """Root endpoint providing service entry guidance."""
    return JSONResponse(
        content={
            "service": settings.app_name,
            "version": settings.app_version,
            "status": "active",
            "documentation": "/docs",
            "health_endpoint": "/api/v1/health",
        }
    )
