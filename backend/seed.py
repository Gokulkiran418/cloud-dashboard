from sqlmodel import Session, SQLModel, create_engine
from models import Resource
from datetime import datetime

engine = create_engine(
    "postgresql+psycopg2://cloudoptuser:cloudopt123@localhost:5432/cloudopt"
)

sample_resources = [
    # Over-provisioned instances
    dict(name="web-server-1", type="instance", provider="aws", instance_type="t3.xlarge",
         size=None, cpu_utilization=15, memory_utilization=25, monthly_cost=150, storage_gb=None),
    dict(name="api-server-2", type="instance", provider="aws", instance_type="m5.large",
         size=None, cpu_utilization=12, memory_utilization=30, monthly_cost=90, storage_gb=None),
    dict(name="worker-3", type="instance", provider="azure", instance_type="Standard_D2s_v3",
         size=None, cpu_utilization=8, memory_utilization=20, monthly_cost=70, storage_gb=None),
    # Well-utilized instances
    dict(name="database-1", type="instance", provider="aws", instance_type="m5.xlarge",
         size=None, cpu_utilization=75, memory_utilization=85, monthly_cost=180, storage_gb=None),
    dict(name="cache-server", type="instance", provider="gcp", instance_type="n1-standard-2",
         size=None, cpu_utilization=65, memory_utilization=70, monthly_cost=50, storage_gb=None),
    # Under-utilized storage
    dict(name="backup-storage", type="storage", provider="aws", instance_type=None,
         size="1000GB", storage_gb=1000, monthly_cost=100, cpu_utilization=None, memory_utilization=None),
    dict(name="log-storage", type="storage", provider="aws", instance_type=None,
         size="500GB", storage_gb=500, monthly_cost=75, cpu_utilization=None, memory_utilization=None),
    # Well-utilized storage
    dict(name="database-storage", type="storage", provider="aws", instance_type=None,
         size="200GB", storage_gb=200, monthly_cost=25, cpu_utilization=None, memory_utilization=None),
]

def seed():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        for row in sample_resources:
            res = Resource(**row)
            session.add(res)
        session.commit()
    print("Seeded sample resources.")

if __name__ == "__main__":
    seed()
