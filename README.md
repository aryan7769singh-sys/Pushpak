# PUSHPAK

> **Real-time domestic airfare price index for India using automated data collection, statistical index methods, and interactive analytics.**  
> *Smart India Hackathon 2026 Initiative*

---

## Overview

PUSHPAK computes high-frequency, CPI-aligned domestic airfare price indices across 50 high-density Indian domestic corridors and monitors five advance-purchase lead-time horizons:
- **T+1**: Spot & dynamic surge volatility (24–48 hours)
- **T+7**: Short-term urgent travel (7 days)
- **T+15**: Corporate & business planning baseline (15 days)
- **T+30**: Standard leisure planning (30 days)
- **T+45**: Early vacation & price baseline (45 days)

The system computes the **PUSHPAK Headline Index** and **PUSHPAK Core Index** using the **Jevons Elementary Geometric Mean** formula.

---

## Project Structure

```
Pushpak/
├── backend/               # FastAPI REST API, SQLAlchemy 2.0, PostgreSQL 18
│   ├── app/
│   │   ├── api/v1/        # API routes (/api/v1/health, /api/v1/system/info)
│   │   ├── core/          # Configuration (Pydantic Settings) & logging
│   │   ├── db/            # Database session, engine, DeclarativeBase
│   │   └── schemas/       # Pydantic validation models
│   ├── tests/             # Pytest automated test suite
│   ├── pyproject.toml     # Primary Python project & dependency configuration
│   └── .env.example       # Database & server environment template
│
├── frontend/              # React + Vite analytics dashboard
│   ├── src/
│   │   ├── components/    # Reusable Shell, Sidebar, Topbar, StatCard, etc.
│   │   ├── pages/         # 9 routed screens (Dashboard, Index, Routes, etc.)
│   │   ├── routes/        # React Router configuration
│   │   └── services/      # Native fetch() API client
│   ├── package.json       # React, Vite, Lucide-React
│   └── vite.config.js     # Dev server with /api proxy to backend
│
└── docs/                  # Architectural & methodology documentation
    ├── architecture/      # Topology and system design
    ├── methodology/       # Jevons index and horizon specifications
    ├── api/               # REST API v1 specification
    └── database/          # PostgreSQL 18 setup guide
```

---

## Getting Started

### 1. Backend Setup

Prerequisites: **Python 3.11+** (tested on Python 3.14) and **PostgreSQL 18+**.

```bash
# Navigate to backend directory
cd backend

# Copy environment file
copy .env.example .env     # Windows
cp .env.example .env       # Linux/macOS

# Configure your PostgreSQL credentials in .env
# (Ensure PostgreSQL service is running and 'pushpak_db' is created)

# Run automated test suite
python -m pytest

# Start development server
python -m uvicorn app.main:app --reload --port 8000
```

- API Base: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/v1/health`

### 2. Frontend Setup

Prerequisites: **Node.js 18+** (tested on Node.js v24).

```bash
# Navigate to frontend directory
cd frontend

# Copy frontend environment file
copy .env.example .env     # Windows
cp .env.example .env       # Linux/macOS

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

- Dashboard: `http://localhost:5173`

---

## Phase Roadmap

- [x] **Phase 1: Product Foundation** (Backend architecture, health probes, PostgreSQL 18 setup, React routing, Aviation Obsidian UI shell)
- [ ] **Phase 2: Data Contract & Database Schema** (Canonical observation models, migration pipeline)
- [ ] **Phase 3: Ingestion & Normalization** (Multi-source feeds, cleaning, deduplication)
- [ ] **Phase 4: Statistical Index Engine** (Jevons aggregation, Headline/Core, advance purchase curves, CPI simulation)
- [ ] **Phase 5: Advanced Analytics & Visualization** (Interactive 50-corridor India map, airline benchmarks)
