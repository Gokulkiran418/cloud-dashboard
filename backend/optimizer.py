from typing import List, Dict, Any
from models import Resource
from datetime import datetime

class OptimizationEngine:
    """Pure business logic for cloud resource optimization recommendations."""
    
    def analyze_resources(self, resources: List[Resource]) -> List[Dict[str, Any]]:
        """Generate optimization recommendations for a list of resources."""
        recommendations = []
        
        for resource in resources:
            # Rule 1: Over-provisioned instances
            if resource.type == "instance":
                rec = self._check_overprovisioned_instance(resource)
                if rec:
                    recommendations.append(rec)
            
            # Rule 2: Oversized storage
            elif resource.type == "storage":
                rec = self._check_oversized_storage(resource)
                if rec:
                    recommendations.append(rec)
        
        return recommendations
    
    def _check_overprovisioned_instance(self, resource: Resource) -> Dict[str, Any]:
        """Check if instance is over-provisioned (CPU < 30% AND memory < 50%)."""
        if (resource.cpu_utilization is not None and 
            resource.memory_utilization is not None and
            resource.cpu_utilization < 30 and 
            resource.memory_utilization < 50):
            
            # Estimate savings (40-60% range, based on utilization)
            utilization_avg = (resource.cpu_utilization + resource.memory_utilization) / 2
            if utilization_avg < 15:
                savings_percent = 0.6  # 60% savings for very low utilization
            elif utilization_avg < 25:
                savings_percent = 0.5  # 50% savings
            else:
                savings_percent = 0.4  # 40% savings
            
            monthly_saving = resource.monthly_cost * savings_percent
            
            # Suggest a smaller instance type (simplified logic)
            suggested_type = self._suggest_smaller_instance(resource.instance_type)
            
            confidence = min(0.95, 0.5 + (30 - utilization_avg) / 60)  # Higher confidence for lower utilization
            
            return {
                "resource_id": resource.id,
                "recommendation_type": "downsize",
                "current_config": f"{resource.instance_type} - ${resource.monthly_cost}/month",
                "suggested_config": f"{suggested_type} - ${resource.monthly_cost - monthly_saving:.0f}/month",
                "potential_saving": monthly_saving,
                "confidence": round(confidence, 2),
                "reason": f"Low utilization: {resource.cpu_utilization}% CPU, {resource.memory_utilization}% memory. Downsize to save costs.",
                "implemented": False
            }
        return None
    
    def _check_oversized_storage(self, resource: Resource) -> Dict[str, Any]:
        """Check if storage volume is oversized (> 500GB)."""
        if resource.storage_gb and resource.storage_gb > 500:
            # Suggest reducing to 70% of current size
            suggested_size = int(resource.storage_gb * 0.7)
            savings_percent = 0.3  # 30% savings on average
            monthly_saving = resource.monthly_cost * savings_percent
            
            confidence = min(0.9, 0.6 + (resource.storage_gb - 500) / 1000)  # Higher confidence for larger volumes
            
            return {
                "resource_id": resource.id,
                "recommendation_type": "shrink",
                "current_config": f"{resource.storage_gb}GB - ${resource.monthly_cost}/month",
                "suggested_config": f"{suggested_size}GB - ${resource.monthly_cost - monthly_saving:.0f}/month",
                "potential_saving": monthly_saving,
                "confidence": round(confidence, 2),
                "reason": f"Large storage volume ({resource.storage_gb}GB). Consider reducing size to optimize costs.",
                "implemented": False
            }
        return None
    
    def _suggest_smaller_instance(self, current_type: str) -> str:
        """Simple mapping to suggest smaller instance types."""
        downsizing_map = {
            "t3.xlarge": "t3.large",
            "m5.xlarge": "m5.large", 
            "m5.large": "t3.medium",
            "Standard_D2s_v3": "Standard_B2s",
            "n1-standard-2": "n1-standard-1"
        }
        return downsizing_map.get(current_type, "smaller-instance")
    
    def calculate_summary(self, resources: List[Resource], recommendations: List[Dict]) -> Dict[str, Any]:
        """Calculate summary statistics."""
        total_resources = len(resources)
        total_monthly_cost = sum(r.monthly_cost for r in resources)
        total_potential_savings = sum(r["potential_saving"] for r in recommendations if not r["implemented"])
        open_recommendations = len([r for r in recommendations if not r["implemented"]])
        
        return {
            "total_resources": total_resources,
            "total_monthly_cost": total_monthly_cost,
            "total_potential_savings": total_potential_savings,
            "open_recommendations": open_recommendations,
            "savings_percentage": round((total_potential_savings / total_monthly_cost * 100), 1) if total_monthly_cost > 0 else 0
        }
