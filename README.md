# NEXUS SOC Command Center

NEXUS SOC Command Center is a full-stack SOC automation platform with:
- **Backend**: FastAPI (port `8000`)
- **Frontend**: React + Vite (port `3000`)
- **Queue/Cache**: Redis (port `6379`)
- **LLM Runtime**: Ollama (port `11434`)

---

## Prerequisites

Install the following before running the project:
- Python 3.10+
- Node.js 18+
- npm 9+
- Docker + Docker Compose
- (Optional) kubectl for Kubernetes deployment

---

## Run Locally (without Docker)

### 1) Start Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main_api:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: `http://localhost:8000`

### 2) Start Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 3) Required Environment Variables

Set these for backend features that rely on external integrations:

- `VT_API_KEY`
- `ABUSEIPDB_API_KEY`
- `JWT_SECRET`

Example:

```bash
export VT_API_KEY="your_key"
export ABUSEIPDB_API_KEY="your_key"
export JWT_SECRET="change_me_in_production"
```

---

## Run with Docker Compose (recommended)

From project root:

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Redis: `localhost:6379`
- Ollama: `http://localhost:11434`

To stop:

```bash
docker compose down
```

### Pull Ollama model

After containers are up, pull the model inside the Ollama container:

```bash
docker exec -it <ollama-container-name> ollama pull mistral:7b
```

You can find the container name with:

```bash
docker ps
```

---

## Kubernetes Deployment

1. Build and push images:
   - `nexus/backend:latest`
   - `nexus/frontend:latest`
2. Apply manifests:

```bash
kubectl apply -f k8s/
```

3. Scale backend replicas:

```bash
kubectl scale deploy/nexus-backend --replicas=4
```

---

## Core API Endpoints

- `POST /api/ingest/manual`
- `POST /api/ingest/dataset/start`
- `POST /api/ingest/scheduler/toggle`
- `GET /api/ingest/scheduler/status`
- `GET /api/dashboard/metrics`
- `GET /api/incidents`
- `GET /api/incidents/{id}`
- `GET /api/cases`
- `POST /api/cases`
- `PUT /api/cases/{id}`
- `GET /api/sla/status`
- `GET /api/audit`
- `GET /api/agents/activity`
- `GET /api/siem/status`
- `GET /api/playbooks/{incident_id}`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/tenant/switch`
- WebSocket: `/ws/live`


## Notes

- Risk scoring includes an **ATT&CK technique criticality factor** in addition to severity, detector confidence, and asset criticality.
- Automatic ingestion can be enabled from the Ingestion page (manager role) or via `/api/ingest/scheduler/toggle`.

- Streamlined pipeline stages shown in UI: Ingestion → Detection → AI Correlation → Risk Prioritization → Mitigation (no mandatory case-creation dependency).
