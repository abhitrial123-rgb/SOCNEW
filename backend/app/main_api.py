from __future__ import annotations

import asyncio
import contextlib
from datetime import datetime, timezone
from typing import List

from fastapi import Depends, FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.core.deps import get_current_user
from app.core.store import store
from app.integrations.splunk_connector import status as splunk_status
from app.integrations.wazuh_connector import status as wazuh_status
from app.models.schemas import DashboardMetrics, IngestRequest, LoginRequest, LoginResponse, MitigationAction, Role, TenantSwitchRequest
from app.playbooks.playbook_executor import execute
from app.playbooks.playbook_repository import get_playbook
from app.services.audit_logger import log_event
from app.services.auth_manager import authenticate, create_token
from app.services.case_manager import create_case
from app.services.data_ingestion import ingest
from app.services.dataset_loader import load_default_dataset
from app.services.ingestion_scheduler import scheduler_status, toggle_scheduler
from app.services.pipeline_orchestrator import run_pipeline
from app.services.rbac_controller import enforce_role
from app.services.sla_tracker import status as sla_status

app = FastAPI(title="NEXUS SOC Command Center")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class WSManager:
    def __init__(self) -> None:
        self.clients: List[WebSocket] = []

    async def connect(self, ws: WebSocket) -> None:
        await ws.accept()
        self.clients.append(ws)

    def disconnect(self, ws: WebSocket) -> None:
        if ws in self.clients:
            self.clients.remove(ws)

    async def broadcast(self, payload: dict) -> None:
        for ws in list(self.clients):
            await ws.send_json(payload)


ws_manager = WSManager()
scheduler_task: asyncio.Task | None = None


def _execute_dataset_ingestion(tenant_id: str) -> list:
    parsed = ingest(load_default_dataset())
    incidents = [run_pipeline(tenant_id, p) for p in parsed]
    store.scheduler_last_run = datetime.now(timezone.utc)
    return incidents


async def _scheduler_loop() -> None:
    while True:
        if store.scheduler_enabled:
            tenant_ids = list(store.incidents.keys()) or ["tenant-a"]
            generated = []
            for tenant_id in tenant_ids:
                generated.extend(_execute_dataset_ingestion(tenant_id))
            await ws_manager.broadcast(
                {
                    "stage": "incident_feed",
                    "incidents": [i.model_dump(mode="json") for i in generated],
                    "message": "Automatic ingestion completed",
                }
            )
        await asyncio.sleep(store.scheduler_interval_seconds)


@app.on_event("startup")
async def startup_event() -> None:
    global scheduler_task
    scheduler_task = asyncio.create_task(_scheduler_loop())


@app.on_event("shutdown")
async def shutdown_event() -> None:
    global scheduler_task
    if scheduler_task:
        scheduler_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await scheduler_task


@app.post("/api/auth/login", response_model=LoginResponse)
def login(data: LoginRequest):
    user = authenticate(data.username, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user)
    return LoginResponse(access_token=token)


@app.get("/api/auth/me")
def me(user=Depends(get_current_user)):
    return user


@app.post("/api/tenant/switch")
def switch_tenant(payload: TenantSwitchRequest, user=Depends(get_current_user)):
    enforce_role(user, Role.manager)
    user["tenant_id"] = payload.tenant_id
    return user


@app.post("/api/ingest/manual")
async def ingest_manual(payload: IngestRequest, user=Depends(get_current_user)):
    parsed = ingest(payload.logs)
    incidents = [run_pipeline(user["tenant_id"], p) for p in parsed]
    classifications = [i.classification for i in incidents]
    log_event(
        user["tenant_id"],
        user["username"],
        "manual_ingestion",
        {"count": len(incidents), "classification": classifications[0] if classifications else "N/A", "incident_id": incidents[0].id if incidents else "n/a"},
    )
    await ws_manager.broadcast({"stage": "incident_feed", "incidents": [i.model_dump(mode="json") for i in incidents]})
    return incidents


@app.post("/api/ingest/dataset/start")
async def ingest_dataset(user=Depends(get_current_user)):
    incidents = _execute_dataset_ingestion(user["tenant_id"])
    await ws_manager.broadcast({"stage": "pipeline", "message": "dataset ingestion complete"})
    return incidents


@app.post("/api/ingest/scheduler/toggle")
def toggle(enabled: bool, interval_seconds: int = Query(default=60, ge=15, le=3600), user=Depends(get_current_user)):
    enforce_role(user, Role.manager)
    return toggle_scheduler(enabled, interval_seconds)


@app.get("/api/ingest/scheduler/status")
def ingestion_scheduler_status(user=Depends(get_current_user)):
    _ = user
    return scheduler_status()


@app.get("/api/dashboard/metrics", response_model=DashboardMetrics)
def dashboard_metrics(user=Depends(get_current_user)):
    incidents = store.incidents[user["tenant_id"]]
    cases = store.cases[user["tenant_id"]]
    return DashboardMetrics(
        active_incidents=len([i for i in incidents if i.status != "Closed"]),
        critical_incidents=len([i for i in incidents if i.risk_level == "Critical"]),
        open_cases=len([c for c in cases if c.status != "Closed"]),
        avg_sla_minutes=42.0,
    )


@app.get("/api/incidents")
def incidents(user=Depends(get_current_user)):
    return store.incidents[user["tenant_id"]]


@app.get("/api/incidents/{incident_id}")
def incident(incident_id: str, user=Depends(get_current_user)):
    found = next((x for x in store.incidents[user["tenant_id"]] if x.id == incident_id), None)
    if not found:
        raise HTTPException(status_code=404, detail="Incident not found")
    return found


@app.post("/api/mitigation/approve")
def approve(action: MitigationAction, user=Depends(get_current_user)):
    log_event(user["tenant_id"], user["username"], "mitigation_approved", action.model_dump())
    return {"approved": True}


@app.post("/api/mitigation/reject")
def reject(action: MitigationAction, user=Depends(get_current_user)):
    log_event(user["tenant_id"], user["username"], "mitigation_rejected", action.model_dump())
    return {"rejected": True}


@app.post("/api/mitigation/execute")
def mitigation_execute(action: MitigationAction, user=Depends(get_current_user)):
    playbook = get_playbook(action.incident_id)
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    result = execute(playbook)
    log_event(user["tenant_id"], user["username"], "mitigation_executed", result)
    return result


@app.get("/api/cases")
def cases(user=Depends(get_current_user)):
    return store.cases[user["tenant_id"]]


@app.post("/api/cases")
def add_case(incident_id: str, user=Depends(get_current_user)):
    return create_case(user["tenant_id"], incident_id, user["username"])


@app.put("/api/cases/{case_id}")
def update_case(case_id: str, note: str, user=Depends(get_current_user)):
    for c in store.cases[user["tenant_id"]]:
        if c.id == case_id:
            c.notes.append(note)
            return c
    raise HTTPException(status_code=404, detail="Case not found")


@app.get("/api/sla/status")
def sla(user=Depends(get_current_user)):
    return [sla_status(i.id, i.risk_level) for i in store.incidents[user["tenant_id"]]]


@app.get("/api/audit")
def audit(user=Depends(get_current_user)):
    return list(store.audit[user["tenant_id"]])


@app.get("/api/agents/activity")
def agents(user=Depends(get_current_user)):
    return list(store.agent_activity[user["tenant_id"]])


@app.get("/api/siem/status")
def siem_status(user=Depends(get_current_user)):
    _ = user
    return {"connectors": [splunk_status(), wazuh_status()]}


@app.get("/api/playbooks/{incident_id}")
def playbook(incident_id: str, user=Depends(get_current_user)):
    _ = user
    found = get_playbook(incident_id)
    if not found:
        raise HTTPException(status_code=404, detail="Playbook not found")
    return found


@app.websocket("/ws/live")
async def ws_live(ws: WebSocket):
    await ws_manager.connect(ws)
    try:
        while True:
            _ = await ws.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(ws)
