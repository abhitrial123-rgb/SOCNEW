from __future__ import annotations


def plan(incident_id: str) -> dict:
    return {"incident_id": incident_id, "next_step": "approve_containment", "agent": "planner"}
