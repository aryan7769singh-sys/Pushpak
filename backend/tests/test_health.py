"""Unit tests for health and system endpoints."""

from unittest.mock import patch
from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    """Test root endpoint returns valid metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "pushpak-api"
    assert data["status"] == "active"
    assert "documentation" in data


def test_system_info_endpoint(client: TestClient):
    """Test system info endpoint returns supported horizons and corridor count."""
    response = client.get("/api/v1/system/info")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "pushpak-api"
    assert data["phase"] == "Phase 1 - Product Foundation"
    assert data["horizons_supported"] == ["T+1", "T+7", "T+15", "T+30", "T+45"]
    assert data["target_corridors_count"] == 50


def test_health_live_structure(client: TestClient):
    """Test live health endpoint returns proper structure and components."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "pushpak-api"
    assert data["status"] in ["ok", "degraded"]
    assert "api" in data["components"]
    assert "database" in data["components"]
    assert data["components"]["api"]["status"] == "ok"


def test_health_status_ok_when_db_connected(client: TestClient):
    """Test overall status is 'ok' when both API and DB are connected."""
    with patch("app.api.v1.endpoints.health.check_db_connection", return_value=(True, "connected")):
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["components"]["api"]["status"] == "ok"
        assert data["components"]["database"]["status"] == "connected"


def test_health_status_degraded_when_db_unreachable(client: TestClient):
    """Test overall status is 'degraded' when API is working but DB is unreachable."""
    with patch("app.api.v1.endpoints.health.check_db_connection", return_value=(False, "unreachable: connection refused")):
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "degraded"
        assert data["components"]["api"]["status"] == "ok"
        assert data["components"]["database"]["status"] == "unreachable"
