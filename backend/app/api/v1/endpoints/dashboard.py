"""Dashboard demonstration API endpoints for PUSHPAK Milestone 1.

All endpoints provide demonstration contract data with explicit DEMO provenance.
"""

from typing import Literal, Optional
from fastapi import APIRouter, Query

from app.schemas.dashboard import (
    DashboardSummaryResponse,
    DashboardTimeseriesResponse,
    DashboardMoversResponse,
    DashboardRoutesResponse,
    DashboardHorizonsResponse,
    DashboardCarriersResponse,
    DashboardAlertsResponse,
)
from app.services.dashboard_service import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    summary="Executive Overview KPI Summary",
    description=(
        "Returns demonstration executive KPI indicators for PUSHPAK Headline, "
        "Core index, daily/weekly change, monitored corridors count, and data quality. "
        "All values are demonstration metrics."
    ),
)
def get_dashboard_summary() -> DashboardSummaryResponse:
    """Retrieve executive summary indicators."""
    return dashboard_service.get_summary()


@router.get(
    "/timeseries",
    response_model=DashboardTimeseriesResponse,
    summary="Historical Index Time-Series Decomposition",
    description=(
        "Returns demonstration historical time-series data for PUSHPAK Headline and Core indices. "
        "Supports frequency filtering (daily, weekly, monthly). Base period: Jan 2026 = 100."
    ),
)
def get_dashboard_timeseries(
    frequency: Literal["daily", "weekly", "monthly"] = Query(
        default="daily",
        description="Sampling frequency for the time-series: daily, weekly, or monthly",
    ),
    start_date: Optional[str] = Query(
        default=None,
        description="Optional start date ISO string",
    ),
    end_date: Optional[str] = Query(
        default=None,
        description="Optional end date ISO string",
    ),
) -> DashboardTimeseriesResponse:
    """Retrieve time-series index data."""
    return dashboard_service.get_timeseries(frequency=frequency, start_date=start_date, end_date=end_date)


@router.get(
    "/movers",
    response_model=DashboardMoversResponse,
    summary="Top Upward and Downward Corridor Movers",
    description=(
        "Returns the top 5 corridors with highest upward price change (gainers) "
        "and top 5 corridors with highest downward price change (decliners). "
        "Corridors are strictly derived from the 50-route demonstration basket."
    ),
)
def get_dashboard_movers() -> DashboardMoversResponse:
    """Retrieve top corridor movers."""
    return dashboard_service.get_movers()


@router.get(
    "/routes",
    response_model=DashboardRoutesResponse,
    summary="50 Strategic Domestic Corridor Demonstration Basket",
    description=(
        "Returns the complete 50-corridor domestic demonstration basket with "
        "unbundled fare attributes, lead-time horizon fares (T+1 to T+45), "
        "volatility, and quality flags. Route weights are marked DEMO."
    ),
)
def get_dashboard_routes() -> DashboardRoutesResponse:
    """Retrieve 50 domestic corridors basket."""
    return dashboard_service.get_routes()


@router.get(
    "/horizons",
    response_model=DashboardHorizonsResponse,
    summary="Lead-Time Advance Purchase Horizon Analysis",
    description=(
        "Returns demonstration lead-time values for the 5 required project horizons: "
        "T+1, T+7, T+15, T+30, T+45. Visual presentation styling (such as colors) "
        "is managed by the client application."
    ),
)
def get_dashboard_horizons() -> DashboardHorizonsResponse:
    """Retrieve the 5 required project horizons."""
    return dashboard_service.get_horizons()


@router.get(
    "/carriers",
    response_model=DashboardCarriersResponse,
    summary="Demonstration Carrier Set Comparison",
    description=(
        "Returns demonstration cross-carrier metrics for the demonstration carrier set. "
        "Market shares are explicitly classified as DEMO_REFERENCE and do not represent "
        "official DGCA statistical publications."
    ),
)
def get_dashboard_carriers() -> DashboardCarriersResponse:
    """Retrieve demonstration carrier set."""
    return dashboard_service.get_carriers()


@router.get(
    "/alerts",
    response_model=DashboardAlertsResponse,
    summary="Demonstration Surveillance Alerts",
    description=(
        "Returns demonstration surveillance alerts for corridor anomalies, "
        "capacity shifts, and quality monitoring. These are simulated alerts and "
        "are not produced by an ML statistical engine."
    ),
)
def get_dashboard_alerts() -> DashboardAlertsResponse:
    """Retrieve demonstration surveillance alerts."""
    return dashboard_service.get_alerts()
