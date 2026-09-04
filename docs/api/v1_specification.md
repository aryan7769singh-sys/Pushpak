# PUSHPAK REST API v1 Specification

All endpoints are prefixed with `/api/v1`.

## Endpoints Implemented in Phase 1

### 1. Health Probe
- **Path**: `GET /api/v1/health`
- **Description**: Probes overall system status, distinguishing between API availability and database connectivity.
- **Status Values**:
  - `ok`: Both API service and PostgreSQL database are healthy and connected.
  - `degraded`: API service is operational, but PostgreSQL is unreachable or credentials are unconfigured.
  - `error`: Critical service failure.
- **Sample Response**:
```json
{
  "status": "ok",
  "service": "pushpak-api",
  "version": "0.1.0",
  "timestamp": "2026-09-04T10:00:00Z",
  "environment": "development",
  "components": {
    "api": {
      "status": "ok",
      "message": "Service responsive"
    },
    "database": {
      "status": "connected",
      "message": "connected"
    }
  }
}
```

### 2. System Information
- **Path**: `GET /api/v1/system/info`
- **Description**: Returns metadata on active phase, supported advance purchase horizons, and target corridor counts.
- **Sample Response**:
```json
{
  "service": "pushpak-api",
  "version": "0.1.0",
  "environment": "development",
  "phase": "Phase 1 - Product Foundation",
  "horizons_supported": ["T+1", "T+7", "T+15", "T+30", "T+45"],
  "target_corridors_count": 50,
  "docs_url": "/docs"
}
```

## Planned Endpoints (Future Phases)
- `GET /api/v1/indices/headline` - Time series of PUSHPAK Headline Index
- `GET /api/v1/indices/core` - Time series of PUSHPAK Core Index
- `GET /api/v1/routes` - 50 domestic corridors summary
- `GET /api/v1/routes/{origin_dest}` - Route detail and lead-time curves
- `GET /api/v1/airlines` - Carrier comparative index
- `GET /api/v1/cpi/impact` - CPI transport contribution estimates
