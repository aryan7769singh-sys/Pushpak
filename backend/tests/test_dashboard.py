"""Automated endpoint and contract validation tests for Milestone 1 Dashboard API."""

from fastapi.testclient import TestClient


def test_dashboard_summary_endpoint(client: TestClient):
    """Validate /api/v1/dashboard/summary schema and provenance metadata."""
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 200
    data = response.json()

    # Provenance assertions
    assert data["source_type"] == "DEMO"
    assert data["data_status"] == "DEMONSTRATION"
    assert data["demo_data"] is True
    assert "last_updated" in data

    # Executive metrics assertions
    assert "headline_index" in data
    assert "core_index" in data
    assert "daily_change" in data
    assert "weekly_change" in data
    assert data["route_count"] == 50
    assert data["observation_count"] == 1200000
    assert data["data_quality"] > 0
    assert isinstance(data["sparkline_headline"], list)
    assert isinstance(data["sparkline_core"], list)


def test_dashboard_timeseries_frequencies(client: TestClient):
    """Validate /api/v1/dashboard/timeseries frequencies and provenance."""
    # Daily frequency (default)
    res_daily = client.get("/api/v1/dashboard/timeseries")
    assert res_daily.status_code == 200
    data_daily = res_daily.json()
    assert data_daily["source_type"] == "DEMO"
    assert data_daily["data_status"] == "DEMONSTRATION"
    assert data_daily["demo_data"] is True
    assert data_daily["frequency"] == "daily"
    assert len(data_daily["series"]) > 0
    first_pt = data_daily["series"][0]
    assert "date" in first_pt
    assert "headline" in first_pt
    assert "core" in first_pt
    assert "volume" in first_pt

    # Weekly frequency
    res_weekly = client.get("/api/v1/dashboard/timeseries?frequency=weekly")
    assert res_weekly.status_code == 200
    data_weekly = res_weekly.json()
    assert data_weekly["frequency"] == "weekly"
    assert len(data_weekly["series"]) > 0

    # Monthly frequency
    res_monthly = client.get("/api/v1/dashboard/timeseries?frequency=monthly")
    assert res_monthly.status_code == 200
    data_monthly = res_monthly.json()
    assert data_monthly["frequency"] == "monthly"
    assert len(data_monthly["series"]) > 0


def test_dashboard_movers_consistency(client: TestClient):
    """Validate /api/v1/dashboard/movers returns exactly 5 gainers and 5 decliners matching route basket."""
    res_movers = client.get("/api/v1/dashboard/movers")
    assert res_movers.status_code == 200
    data_movers = res_movers.json()

    assert data_movers["source_type"] == "DEMO"
    assert data_movers["data_status"] == "DEMONSTRATION"
    assert data_movers["demo_data"] is True

    gainers = data_movers["gainers"]
    decliners = data_movers["decliners"]

    assert len(gainers) == 5, f"Expected 5 gainers, got {len(gainers)}"
    assert len(decliners) == 5, f"Expected 5 decliners, got {len(decliners)}"

    # Get route basket to verify movers reference the same basket
    res_routes = client.get("/api/v1/dashboard/routes")
    basket_ids = {r["route_id"] for r in res_routes.json()["routes"]}

    for m in gainers:
        assert m["route_id"] in basket_ids
        assert m["direction"] == "up"
        assert m["rank"] in range(1, 6)

    for m in decliners:
        assert m["route_id"] in basket_ids
        assert m["direction"] == "down"
        assert m["rank"] in range(1, 6)


def test_dashboard_routes_basket(client: TestClient):
    """Validate /api/v1/dashboard/routes returns exactly 50 unique corridors."""
    response = client.get("/api/v1/dashboard/routes")
    assert response.status_code == 200
    data = response.json()

    assert data["source_type"] == "DEMO"
    assert data["data_status"] == "DEMONSTRATION"
    assert data["demo_data"] is True
    assert data["total_routes"] == 50

    routes = data["routes"]
    assert len(routes) == 50

    route_ids = [r["route_id"] for r in routes]
    assert len(set(route_ids)) == 50, "Corridor IDs in demonstration basket must be unique"

    for r in routes:
        assert r["origin"] != r["destination"], f"Origin equals destination in {r['route_id']}"
        assert r["avg_fare"] > 0
        assert r["t1_fare"] > 0
        assert r["t45_fare"] > 0
        assert r["weight_status"] in ["DEMO", "REFERENCE"]
        assert "sector" in r
        assert "volatility" in r
        assert "quality" in r


def test_dashboard_horizons_contract(client: TestClient):
    """Validate /api/v1/dashboard/horizons returns the 5 required project horizons without presentation colors."""
    response = client.get("/api/v1/dashboard/horizons")
    assert response.status_code == 200
    data = response.json()

    assert data["source_type"] == "DEMO"
    assert data["data_status"] == "DEMONSTRATION"
    assert data["demo_data"] is True

    horizons = data["horizons"]
    assert len(horizons) == 5

    expected_hz = ["T+1", "T+7", "T+15", "T+30", "T+45"]
    actual_hz = [h["horizon"] for h in horizons]
    assert actual_hz == expected_hz

    # Verify no presentation color field is returned in contract
    for h in horizons:
        assert "color" not in h, "Backend API contract must not contain presentation colors"
        assert h["lead_days"] in [1, 7, 15, 30, 45]
        assert h["index_value"] > 0
        assert "description" in h


def test_dashboard_carriers_contract(client: TestClient):
    """Validate /api/v1/dashboard/carriers returns demonstration carrier set without presentation colors."""
    response = client.get("/api/v1/dashboard/carriers")
    assert response.status_code == 200
    data = response.json()

    assert data["source_type"] == "DEMO"
    assert data["data_status"] == "DEMONSTRATION"
    assert data["demo_data"] is True
    assert data["carrier_universe"] == "Demonstration carrier set"

    carriers = data["carriers"]
    assert len(carriers) == 5

    for c in carriers:
        assert "color" not in c, "Backend API contract must not contain presentation colors"
        assert c["market_share_type"] in ["DEMO_REFERENCE", "REFERENCE"]
        assert c["market_share"] > 0
        assert c["daily_flights"] > 0


def test_dashboard_alerts_contract(client: TestClient):
    """Validate /api/v1/dashboard/alerts returns demonstration surveillance alerts."""
    response = client.get("/api/v1/dashboard/alerts")
    assert response.status_code == 200
    data = response.json()

    assert data["source_type"] == "DEMO"
    assert data["data_status"] == "DEMONSTRATION"
    assert data["demo_data"] is True
    assert data["alert_type"] == "Demonstration surveillance alerts"

    alerts = data["alerts"]
    assert len(alerts) > 0

    for a in alerts:
        assert a["demo_alert"] is True
        assert a["level"] in ["warning", "anomaly", "healthy", "info"]
        assert "title" in a
        assert "detail" in a
