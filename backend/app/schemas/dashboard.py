"""Pydantic schemas for PUSHPAK Milestone 1 Dashboard API contract.

All endpoints provide demonstration data with explicit provenance metadata.
No presentation styling (such as colors) is included in schemas per architectural specifications.
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ProvenanceMetadata(BaseModel):
    """Provenance and data governance metadata for demonstration responses."""
    source_type: Literal["DEMO", "REFERENCE", "LIVE", "OFFICIAL"] = Field(
        default="DEMO",
        description="Data provenance source classification. Milestone 1 values are strictly DEMO.",
    )
    data_status: Literal["DEMONSTRATION", "PROVISIONAL", "FINAL"] = Field(
        default="DEMONSTRATION",
        description="Operational statistical status. Never official in Milestone 1.",
    )
    demo_data: bool = Field(
        default=True,
        description="Flag indicating payload is simulated demonstration data.",
    )
    last_updated: str = Field(
        default="2026-09-04T18:30:00Z",
        description="Deterministic ISO-8601 demonstration snapshot timestamp.",
    )


class DashboardSummaryResponse(ProvenanceMetadata):
    """Executive KPI summary metrics response."""
    headline_index: float = Field(..., description="PUSHPAK Headline Index demonstration value")
    core_index: float = Field(..., description="PUSHPAK Core Index demonstration value")
    daily_change: float = Field(..., description="24-hour index change percentage")
    weekly_change: float = Field(..., description="7-day index change percentage")
    route_count: int = Field(default=50, description="Total corridors in demonstration basket")
    observation_count: int = Field(default=1200000, description="Total demonstration observations")
    data_quality: float = Field(default=99.4, description="Demonstration data quality/confidence metric")
    sparkline_headline: List[float] = Field(default_factory=list, description="Recent 7-point trajectory for Headline")
    sparkline_core: List[float] = Field(default_factory=list, description="Recent 7-point trajectory for Core")


class TimeseriesPoint(BaseModel):
    """Individual demonstration point in the historical index series."""
    date: str = Field(..., description="Observation period label (e.g., 'Aug 05' or ISO date)")
    headline: float = Field(..., description="Headline index value")
    core: float = Field(..., description="Core index value")
    volume: int = Field(..., description="Demonstration observation volume")


class DashboardTimeseriesResponse(ProvenanceMetadata):
    """Time-series decomposition response for Headline and Core indices."""
    frequency: Literal["daily", "weekly", "monthly"] = Field(
        default="daily",
        description="Time-series sampling frequency",
    )
    base_period: str = Field(default="Jan 2026 = 100", description="Demonstration base period index anchor")
    total_points: int = Field(..., description="Number of points in the series")
    series: List[TimeseriesPoint] = Field(..., description="Time-series observation records")


class RouteMover(BaseModel):
    """Corridor mover record for upward or downward price shifts."""
    rank: int = Field(..., description="Movement rank (1 to 5)")
    route_id: str = Field(..., description="Unique corridor identifier (e.g., 'DEL-BOM')")
    route_label: str = Field(..., description="Display route label (e.g., 'DEL → BOM')")
    origin: str = Field(..., description="3-letter origin airport code")
    destination: str = Field(..., description="3-letter destination airport code")
    sector: str = Field(..., description="Corridor sector classification")
    avg_fare: int = Field(..., description="Demonstration average basket fare in INR")
    change_pct: float = Field(..., description="Percentage fare change")
    direction: Literal["up", "down"] = Field(..., description="Direction of price movement")


class DashboardMoversResponse(ProvenanceMetadata):
    """Top 5 inflationary gainers and top 5 decliners across the demonstration basket."""
    gainers: List[RouteMover] = Field(..., description="Top 5 corridors with highest upward price change")
    decliners: List[RouteMover] = Field(..., description="Top 5 corridors with highest downward price change")


class RouteBasketItem(BaseModel):
    """Single domestic corridor item within the 50-route demonstration basket."""
    route_id: str = Field(..., description="Unique corridor identifier (e.g. 'DEL-BOM')")
    origin: str = Field(..., description="3-letter IATA airport code of origin")
    destination: str = Field(..., description="3-letter IATA airport code of destination")
    route_label: str = Field(..., description="Display route label (e.g., 'DEL → BOM')")
    sector: str = Field(..., description="Corridor sector classification")
    distance_km: int = Field(..., description="Direct flight distance in kilometers")
    daily_flights: int = Field(..., description="Scheduled daily flight frequency estimate")
    avg_fare: int = Field(..., description="Observed demonstration average total fare (INR)")
    t1_fare: int = Field(..., description="T+1 spot horizon demonstration fare (INR)")
    t7_fare: int = Field(..., description="T+7 short-term horizon demonstration fare (INR)")
    t15_fare: int = Field(..., description="T+15 corporate baseline demonstration fare (INR)")
    t30_fare: int = Field(..., description="T+30 standard leisure demonstration fare (INR)")
    t45_fare: int = Field(..., description="T+45 advance purchase floor demonstration fare (INR)")
    change_pct: float = Field(..., description="24-hour index change percentage")
    volatility: str = Field(..., description="Descriptive demonstration volatility rating")
    quality: str = Field(..., description="Demonstration surveillance quality flag")
    status: str = Field(..., description="Operational surveillance status")
    base_fare: int = Field(..., description="Unbundled demonstration base airline fare (INR)")
    taxes: int = Field(..., description="Unbundled demonstration GST component (INR)")
    airport_charges: int = Field(..., description="Unbundled demonstration PSF/UDF airport charges (INR)")
    aux_fees: int = Field(..., description="Unbundled demonstration auxiliary fees (INR)")
    weight_status: Literal["DEMO", "REFERENCE"] = Field(
        default="DEMO",
        description="Route weighting provenance flag (DEMO or REFERENCE only)",
    )


class DashboardRoutesResponse(ProvenanceMetadata):
    """Response containing the 50-corridor domestic demonstration basket."""
    total_routes: int = Field(default=50, description="Total count of routes in the demonstration basket")
    routes: List[RouteBasketItem] = Field(..., description="Complete 50-corridor domestic basket")


class HorizonItem(BaseModel):
    """Individual advance-purchase lead-time horizon. Presentation colors omitted."""
    horizon: Literal["T+1", "T+7", "T+15", "T+30", "T+45"] = Field(
        ...,
        description="Required project lead-time horizon identifier",
    )
    lead_days: int = Field(..., description="Advance-purchase lead days (1, 7, 15, 30, 45)")
    index_value: float = Field(..., description="Demonstration sub-index value for this horizon")
    average_fare: int = Field(..., description="Demonstration average observed fare across corridors")
    change_pct: float = Field(..., description="Demonstration period change percentage")
    description: str = Field(..., description="Statistical horizon characterization and purchase window")


class DashboardHorizonsResponse(ProvenanceMetadata):
    """Required 5 project horizons lead-time analysis response."""
    definition: str = Field(
        default="Required project horizons for domestic airfare monitoring",
        description="Contextual definition for the 5 lead-time horizons",
    )
    horizons: List[HorizonItem] = Field(..., description="List of all 5 required project horizons")


class CarrierComparisonItem(BaseModel):
    """Carrier comparison item in demonstration carrier set. Presentation colors omitted."""
    code: str = Field(..., description="2-letter airline code (e.g., '6E', 'AI')")
    name: str = Field(..., description="Airline legal/operating name")
    market_share: float = Field(..., description="Demonstration/reference domestic market share percentage")
    market_share_type: Literal["DEMO_REFERENCE", "REFERENCE"] = Field(
        default="DEMO_REFERENCE",
        description="Market share provenance classification. Not an official statutory share.",
    )
    avg_fare: int = Field(..., description="Demonstration average basket fare across corridors (INR)")
    daily_flights: int = Field(..., description="Approximate daily domestic departures estimate")
    carrier_type: str = Field(..., description="Business model classification (LCC, FSC, etc.)")


class DashboardCarriersResponse(ProvenanceMetadata):
    """Demonstration carrier set comparison response."""
    carrier_universe: str = Field(
        default="Demonstration carrier set",
        description="Explicit description of carrier set scope",
    )
    carriers: List[CarrierComparisonItem] = Field(..., description="List of monitored demonstration carriers")


class SurveillanceAlertItem(BaseModel):
    """Demonstration surveillance alert item. Strictly not an ML-generated alert."""
    id: str = Field(..., description="Unique alert identifier")
    category: str = Field(..., description="Alert thematic category")
    title: str = Field(..., description="Alert headline summary")
    detail: str = Field(..., description="Technical descriptive detail")
    timestamp: str = Field(..., description="Observation timestamp or relative time label")
    level: Literal["warning", "anomaly", "healthy", "info"] = Field(
        ...,
        description="Alert severity level",
    )
    corridor_id: Optional[str] = Field(default=None, description="Associated corridor ID if applicable")
    horizon: Optional[str] = Field(default=None, description="Associated lead-time horizon if applicable")
    demo_alert: bool = Field(default=True, description="Explicit demonstration alert flag")


class DashboardAlertsResponse(ProvenanceMetadata):
    """Demonstration surveillance alerts response."""
    alert_type: str = Field(
        default="Demonstration surveillance alerts",
        description="Explicit notice that alerts are demonstration surveillance alerts",
    )
    alerts: List[SurveillanceAlertItem] = Field(..., description="Active demonstration surveillance alerts")
