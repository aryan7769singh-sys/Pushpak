# PUSHPAK Architecture Overview

## 1. System Vision
PUSHPAK is a high-frequency, real-time domestic airfare price index system for Indian civil aviation (Smart India Hackathon 2026). The platform computes Jevons-based geometric indices across 50 high-density domestic corridors and tracks advance-purchase horizons from $T+1$ through $T+45$.

## 2. High-Level Component Topology

```
[ Data Ingestion Pipeline ] (Future Milestones)
   │  API feeds, historical datasets, permitted scrapers
   ▼
[ Canonical Normalization & Cleaning ]
   │  Deduplication, anomaly filtering, fare unbundling
   ▼
[ PostgreSQL 18 Storage Engine ]
   │  Raw observations, canonical cleaned records, route metadata
   ▼
[ Statistical & Index Engine ]
   │  Jevons geometric mean aggregation, Headline vs Core, CPI contribution
   ▼
[ FastAPI REST API Layer (/api/v1/) ]
   │  Health probes, index time-series, corridor metrics, provenance
   ▼
[ React + Vite Analytics Dashboard ]
   │  Aviation Obsidian intelligence interface (non-booking, statistical)
```

## 3. Phase Boundaries

- **Phase 1 (Current)**: Product Foundation
  - FastAPI application structure, configuration, standard logging, `/api/v1/health` with component status differentiation.
  - SQLAlchemy 2.0 with psycopg 3 connection pool and PostgreSQL 18 integration foundation.
  - React + Vite foundation with responsive Aviation Obsidian layout, client-side routing across all 9 screens, and native `fetch()` API client.
  - No domain tables, scrapers, or statistical engines.

- **Phase 2 (Upcoming)**: Data Contract & Database Schema
  - Finalize canonical fare observation contract after inspecting raw datasets.
  - Apply SQLAlchemy models and Alembic migrations.

- **Phase 3 (Upcoming)**: Ingestion & Normalization
  - Multi-source ingestion pipelines, deduplication, unbundling.

- **Phase 4 (Upcoming)**: Statistical Index Engine
  - Jevons index computation, Headline/Core metrics, advance-purchase curves ($T+1, T+7, T+15, T+30, T+45$), CPI simulation.

- **Phase 5 (Upcoming)**: Dashboard Analytics Integration
  - Interactive corridor maps, lead-time curves, airline comparison charts.
