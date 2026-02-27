from __future__ import annotations

from datetime import datetime

from app.core.store import store

POLICIES = {"Critical": 60, "High": 240, "Medium": 1440, "Low": 2880}


def start(incident_id: str) -> None:
    store.sla_started[incident_id] = datetime.utcnow()


def status(incident_id: str, risk_level: str) -> dict:
    start_time = store.sla_started.get(incident_id, datetime.utcnow())
    elapsed = (datetime.utcnow() - start_time).total_seconds() / 60
    target = POLICIES[risk_level]
    return {"incident_id": incident_id, "elapsed_minutes": round(elapsed, 2), "target_minutes": target, "breached": elapsed > target}
