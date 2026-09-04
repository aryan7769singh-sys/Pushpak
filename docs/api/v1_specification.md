# PUSHPAK REST API v1 Specification

All endpoints are versioned under the `/api/v1` namespace prefix.

---

## Provenance Semantics & Data Governance

All endpoints under `/api/v1/dashboard/*` return demonstration data designed to establish the API boundary and power the frontend dashboard without frontend index calculations.

Every demonstration response includes standardized provenance metadata fields:
- **`source_type`**: `"DEMO"` (Milestone 1 values are simulated demonstration data, never `"LIVE"` or `"OFFICIAL"`)
- **`data_status`**: `"DEMONSTRATION"` (Operational statistical status, never official statistics)
- **`demo_data`**: `true` (Boolean flag indicating demonstration payload)
- **`last_updated`**: Deterministic snapshot ISO timestamp (`"2026-09-04T18:30:00Z"`)
- Reference data (e.g., carrier shares, route weights) are explicitly classified as `"DEMO_REFERENCE"` or `"REFERENCE"`.
- Backend schemas strictly emit semantic/data attributes; presentation attributes (e.g. styling colors) are managed entirely by the frontend.

---

## Endpoints Implemented in Phase 1

### 1. Health Probe
- **Path**: `GET /api/v1/health`
- **Description**: Probes overall system status, distinguishing between API availability and database connectivity.
- **Status Values**:
  - `ok`: Both API service and PostgreSQL database are healthy and connected.
  - `degraded`: API service is operational, but PostgreSQL is unreachable or credentials are unconfigured.
  - `error`: Critical service failure.

### 2. System Information
- **Path**: `GET /api/v1/system/info`
- **Description**: Returns metadata on active phase, supported advance purchase horizons, and target corridor counts.

---

## Endpoints Implemented in Milestone 1 (Dashboard API Contract)

### 3. Executive KPI Summary
- **Path**: `GET /api/v1/dashboard/summary`
- **Description**: Returns demonstration executive indicators for PUSHPAK Headline and Core indices, 24-hour daily change, 7-day weekly change, corridor basket count, observation volume, and data confidence.
- **Response Model**: `DashboardSummaryResponse`
- **Sample Response**:
```json
{
  "source_type": "DEMO",
  "data_status": "DEMONSTRATION",
  "demo_data": true,
  "last_updated": "2026-09-04T18:30:00Z",
  "headline_index": 124.5,
  "core_index": 119.8,
  "daily_change": 1.2,
  "weekly_change": 3.4,
  "route_count": 50,
  "observation_count": 1200000,
  "data_quality": 99.4,
  "sparkline_headline": [121.2, 121.8, 122.5, 123.1, 123.7, 124.1, 124.5],
  "sparkline_core": [118.5, 118.7, 119.0, 119.2, 119.4, 119.6, 119.8]
}
```

---

### 4. Historical Index Time-Series
- **Path**: `GET /api/v1/dashboard/timeseries`
- **Description**: Returns demonstration time-series decomposition for PUSHPAK Headline and Core indices.
- **Query Parameters**:
  - `frequency`: Optional string (`"daily"`, `"weekly"`, `"monthly"`). Defaults to `"daily"`.
  - `start_date`: Optional ISO date string filter.
  - `end_date`: Optional ISO date string filter.
- **Response Model**: `DashboardTimeseriesResponse`
- **Sample Response**:
```json
{
  "source_type": "DEMO",
  "data_status": "DEMONSTRATION",
  "demo_data": true,
  "last_updated": "2026-09-04T18:30:00Z",
  "frequency": "daily",
  "base_period": "Jan 2026 = 100",
  "total_points": 9,
  "series": [
    { "date": "Aug 05", "headline": 120.1, "core": 118.2, "volume": 41200 },
    { "date": "Sep 04", "headline": 124.5, "core": 119.8, "volume": 47150 }
  ]
}
```

---

### 5. Corridor Movers
- **Path**: `GET /api/v1/dashboard/movers`
- **Description**: Returns top 5 corridors with highest upward price change (`gainers`) and top 5 corridors with highest downward price change (`decliners`). Strictly derived from the 50-corridor demonstration basket.
- **Response Model**: `DashboardMoversResponse`
- **Sample Response**:
```json
{
  "source_type": "DEMO",
  "data_status": "DEMONSTRATION",
  "demo_data": true,
  "last_updated": "2026-09-04T18:30:00Z",
  "gainers": [
    {
      "rank": 1,
      "route_id": "BOM-GOI",
      "route_label": "BOM → GOI",
      "origin": "BOM",
      "destination": "GOI",
      "sector": "Leisure Corridor",
      "avg_fare": 3850,
      "change_pct": 7.1,
      "direction": "up"
    }
  ],
  "decliners": [
    {
      "rank": 1,
      "route_id": "AMD-BOM",
      "route_label": "AMD → BOM",
      "origin": "AMD",
      "destination": "BOM",
      "sector": "Metro-Tier2",
      "avg_fare": 3310,
      "change_pct": -2.4,
      "direction": "down"
    }
  ]
}
```

---

### 6. 50 Strategic Domestic Corridors Basket
- **Path**: `GET /api/v1/dashboard/routes`
- **Description**: Returns the complete 50-corridor domestic demonstration basket. Each route record contains unbundled fare components (base fare, GST, PSF/UDF airport charges, auxiliary fees), five advance purchase horizon demonstration fares (T+1, T+7, T+15, T+30, T+45), volatility rating, and quality flags. Route weights are explicitly marked `"DEMO"`.
- **Response Model**: `DashboardRoutesResponse`
- **Sample Item**:
```json
{
  "route_id": "DEL-BOM",
  "origin": "DEL",
  "destination": "BOM",
  "route_label": "DEL → BOM",
  "sector": "Metro-Metro",
  "distance_km": 1148,
  "daily_flights": 78,
  "avg_fare": 5850,
  "t1_fare": 11200,
  "t7_fare": 6850,
  "t15_fare": 5400,
  "t30_fare": 4650,
  "t45_fare": 4200,
  "change_pct": 5.4,
  "volatility": "High (18.4%)",
  "quality": "HIGH OBSERVATION",
  "status": "Surveillance Active",
  "base_fare": 4680,
  "taxes": 585,
  "airport_charges": 410,
  "aux_fees": 175,
  "weight_status": "DEMO"
}
```

---

### 7. Required Project Lead-Time Horizons
- **Path**: `GET /api/v1/dashboard/horizons`
- **Description**: Returns demonstration values for the 5 required project lead-time horizons: `T+1`, `T+7`, `T+15`, `T+30`, `T+45`. Color and presentation styling are managed by the client.
- **Response Model**: `DashboardHorizonsResponse`
- **Sample Response**:
```json
{
  "source_type": "DEMO",
  "data_status": "DEMONSTRATION",
  "demo_data": true,
  "last_updated": "2026-09-04T18:30:00Z",
  "definition": "Required project horizons for domestic airfare monitoring",
  "horizons": [
    {
      "horizon": "T+1",
      "lead_days": 1,
      "index_value": 142.8,
      "average_fare": 10450,
      "change_pct": 5.8,
      "description": "24–48h Last-minute emergency & spot volatility window"
    },
    {
      "horizon": "T+15",
      "lead_days": 15,
      "index_value": 124.5,
      "average_fare": 5100,
      "change_pct": 1.2,
      "description": "15-Day domestic corporate baseline horizon"
    }
  ]
}
```

---

### 8. Demonstration Carrier Set Comparison
- **Path**: `GET /api/v1/dashboard/carriers`
- **Description**: Returns demonstration cross-carrier metrics for the demonstration carrier set (IndiGo, Air India, SpiceJet, Akasa Air, AIX Connect). Market shares are classified as `DEMO_REFERENCE`.
- **Response Model**: `DashboardCarriersResponse`
- **Sample Response**:
```json
{
  "source_type": "DEMO",
  "data_status": "DEMONSTRATION",
  "demo_data": true,
  "last_updated": "2026-09-04T18:30:00Z",
  "carrier_universe": "Demonstration carrier set",
  "carriers": [
    {
      "code": "6E",
      "name": "IndiGo",
      "market_share": 62.4,
      "market_share_type": "DEMO_REFERENCE",
      "avg_fare": 5420,
      "daily_flights": 1950,
      "carrier_type": "Low-Cost Carrier (LCC)"
    }
  ]
}
```

---

### 9. Demonstration Surveillance Alerts
- **Path**: `GET /api/v1/dashboard/alerts`
- **Description**: Returns demonstration surveillance alerts for corridor anomalies, capacity shifts, and quality monitoring. These are simulated alerts and are strictly not produced by an ML statistical engine.
- **Response Model**: `DashboardAlertsResponse`
- **Sample Response**:
```json
{
  "source_type": "DEMO",
  "data_status": "DEMONSTRATION",
  "demo_data": true,
  "last_updated": "2026-09-04T18:30:00Z",
  "alert_type": "Demonstration surveillance alerts",
  "alerts": [
    {
      "id": "DEMO-ALT-001",
      "category": "PRICE MOVEMENT",
      "title": "Spot Surge in Western Corridors",
      "detail": "T+1 fares for Mumbai sectors registered a +5.4% jump driven by business travel demand and 89% seat factor.",
      "timestamp": "22 mins ago",
      "level": "warning",
      "corridor_id": "DEL-BOM",
      "horizon": "T+1",
      "demo_alert": true
    }
  ]
}
```

---

## Planned Future Endpoints (Later Milestones)

The following endpoints will be introduced in subsequent milestones and are **not** implemented in Milestone 1:
- `POST /api/v1/ingestion/raw` - Raw multi-source fare ingestion pipeline
- `GET /api/v1/indices/headline/live` - Production chained Jevons calculation engine
- `GET /api/v1/indices/core/live` - Dynamic spike-filtered statistical core index engine
- `GET /api/v1/anomalies/detect` - Statistical/ML real-time surge anomaly detection service
- `GET /api/v1/dgca/weights` - Official DGCA passenger weight matrix integration
