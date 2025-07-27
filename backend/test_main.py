import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_resources_endpoint_basic():
    res = client.get("/resources")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    # should be at least 8 seeded items
    assert len(data) >= 8
    # Spot-check some keys
    for item in data:
        assert "id" in item
        assert "name" in item
        assert "type" in item
        assert "monthly_cost" in item
