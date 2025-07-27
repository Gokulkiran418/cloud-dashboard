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

def test_recommendations_endpoint():
    """Test recommendations generation."""
    res = client.get("/recommendations")
    assert res.status_code == 200
    data = res.json()
    
    # Should have recommendations and summary
    assert "recommendations" in data
    assert "summary" in data
    
    # Should have recommendations for over-provisioned instances
    recommendations = data["recommendations"]
    assert len(recommendations) >= 3  # At least 3 over-provisioned instances in seed data
    
    # Check recommendation structure
    for rec in recommendations:
        assert "resource_id" in rec
        assert "recommendation_type" in rec
        assert "potential_saving" in rec
        assert rec["potential_saving"] > 0
        assert 0 <= rec["confidence"] <= 1

def test_implement_recommendation():
    """Test marking recommendation as implemented."""
    res = client.post("/recommendations/1/implement")
    assert res.status_code == 200
    data = res.json()
    assert "message" in data
    assert "implemented_at" in data

def test_implement_nonexistent_recommendation():
    """Test implementing recommendation for nonexistent resource."""
    res = client.post("/recommendations/999/implement")
    assert res.status_code == 404
