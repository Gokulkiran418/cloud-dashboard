# Cloud Optimization Dashboard

A full-stack web application for monitoring cloud resources and generating cost-optimization recommendations. Built with React, FastAPI, and PostgreSQL.

## Features
- Displays cloud resources with utilization and cost data.
- Generates actionable optimization recommendations based on rules (e.g., downsize over-provisioned instances, shrink large storage).
- Summary dashboard showing total costs, potential savings, and opportunities.
- Mark recommendations as implemented with real-time UI updates.
- Professional, responsive UI suitable for enterprise use.

## Tech Stack
- **Backend:** FastAPI, SQLModel, PostgreSQL
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Vite
- **Database:** Local PostgreSQL (or Docker if preferred)

## Setup Instructions (Local Development)

### Prerequisites
- Python 3.8+ (with virtualenv)
- Node.js 18+ (with npm)
- PostgreSQL installed locally (or use Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/Gokulkiran418/cloud-dashboard.git
cd cloud-opt-dashboard
```


### 2. Backend Setup
# Setting Up PostgreSQL with pgAdmin

Follow these steps to create a database, user, and configure your app connection.

## Create a Database

- Open **pgAdmin**
- Expand your server (e.g., `PostgreSQL 13`)
- Right-click **Databases** → **Create** → **Database…**
- Set **Database name**: `<Database name>`
- Leave **Owner** as default or select current user
- Click **Save**

## Create a Database User (Role)

- In pgAdmin, under your server, find **Login/Group Roles**
- Right-click **Login/Group Roles** → **Create** → **Login/Group Role…**
- Under **General** tab, set:
  - **Name**: `<username>`
- Switch to **Definition** tab:
  - Set **Password**: `<password>`
- Switch to **Privileges** tab:
      - Enable **Login**
      - Check **Can login?**
  - Optionally, enable **Superuser** (for dev convenience only)
- Click **Save**

## Grant Privileges to the User

- Right-click database `cloudopt` → **Query Tool**
- Run the following SQL command:
```bash
GRANT ALL PRIVILEGES ON DATABASE cloudopt TO cloudoptuser;
```

## Update Your Environment Variables

```bash
cd backend
touch .env.example .env 
```
- In your backend project folder (e.g., `/backend`), edit your `.env` file
- Update the database connection string:
DATABASE_URL=postgresql+psycopg2://<username>:<password>@localhost:5432/<database_name>

```bash
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Edit DATABASE_URL with your local Postgres credentials
alembic upgrade head # Run migrations
python seed.py # Seed sample data
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env # Edit VITE_API_BASE_URL if needed
```


### 4. Run the Application
- Start backend: `uvicorn main:app --reload` (runs on http://localhost:8000)
- Start frontend: `npm run dev` (runs on http://localhost:5173)
- Visit http://localhost:5173 in your browser.

For production: `npm run build` (frontend) and deploy backend with gunicorn/uvicorn.

## API Documentation
Endpoints (see http://localhost:8000/docs for interactive **Swagger UI**):
- `GET /resources?limit=20&offset=0`: List resources with utilization/cost (paginated).
- `GET /recommendations`: Get recommendations with summary (costs, savings).
- `POST /recommendations/{id}/implement`: Mark recommendation as implemented.
- `GET /healthz`: Health check.
- curl testing
      - curl http://localhost:8000/healthz
      - curl http://localhost:8000/resources
      - curl http://localhost:8000/recommendations
      - curl http://localhost:8000/openapi.json

Example response for /recommendations:
```bash
{
"recommendations": [...],
"summary": {
"total_resources": 8,
"total_monthly_cost": 740,
"total_potential_savings": 200,
"open_recommendations": 5
}
}
```

## Database Schema
Tables:
- **resource** (main table for cloud resources):
  - id: int (PK)
  - name: str
  - type: str (instance/storage)
  - provider: str
  - instance_type: str (nullable)
  - size: str (nullable)
  - cpu_utilization: float (nullable)
  - memory_utilization: float (nullable)
  - storage_gb: int (nullable)
  - monthly_cost: float
  - created_at: datetime
  - updated_at: datetime

- **recommendation** (for tracking optimizations):
  - id: int (PK)
  - resource_id: int (FK to resource.id)
  - recommendation_type: str (downsize/shrink)
  - current_config: str
  - suggested_config: str
  - potential_saving: float
  - confidence: float
  - reason: str
  - implemented: bool (default false)
  - created_at: datetime
  - implemented_at: datetime (nullable)

Relationships: One-to-many (resource → recommendations).

## Feature Overview
### Screenshots
![Dashboard Overview](docs/screenshots/dashboard.png)  
*Full dashboard with summary, resources, and recommendations.*

![Recommendations Panel](docs/screenshots/recommendations.png)  
*Interactive recommendations with "Mark Implemented" actions.*

![Mobile View](docs/screenshots/mobile.png)  
*Responsive design on small screens.*

### Key Functionality
- Real-time data from backend API.
- Visual utilization indicators (green/yellow/red).
- Error handling, loading states, and toasts.
- Tested for scenarios: over-provisioned, mixed workloads, implementation tracking.

## Testing
- Backend: `pytest` (coverage ≥80%)
- Frontend: `npm run cypress:open` (E2E smoke tests)

## License
MIT
