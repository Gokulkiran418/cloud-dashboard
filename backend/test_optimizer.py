import pytest
from optimizer import OptimizationEngine
from models import Resource

def test_overprovisioned_instance_detection():
    """Test detection of over-provisioned instances."""
    optimizer = OptimizationEngine()
    
    # Create a test resource (over-provisioned)
    resource = Resource(
        id=1, name="test-server", type="instance", provider="aws",
        instance_type="t3.xlarge", cpu_utilization=15, memory_utilization=25,
        monthly_cost=150
    )
    
    recommendations = optimizer.analyze_resources([resource])
    
    assert len(recommendations) == 1
    rec = recommendations[0]
    assert rec["recommendation_type"] == "downsize"
    assert rec["potential_saving"] > 0
    assert rec["confidence"] > 0.5

def test_well_utilized_instance_no_recommendation():
    """Test that well-utilized instances don't get recommendations."""
    optimizer = OptimizationEngine()
    
    resource = Resource(
        id=1, name="db-server", type="instance", provider="aws",
        instance_type="m5.xlarge", cpu_utilization=75, memory_utilization=85,
        monthly_cost=180
    )
    
    recommendations = optimizer.analyze_resources([resource])
    assert len(recommendations) == 0

def test_oversized_storage_detection():
    """Test detection of oversized storage."""
    optimizer = OptimizationEngine()
    
    resource = Resource(
        id=1, name="backup-storage", type="storage", provider="aws",
        storage_gb=1000, monthly_cost=100
    )
    
    recommendations = optimizer.analyze_resources([resource])
    
    assert len(recommendations) == 1
    rec = recommendations[0]
    assert rec["recommendation_type"] == "shrink"
    assert rec["potential_saving"] > 0
