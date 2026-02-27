from __future__ import annotations


def plan(incident_id: str) -> dict:
    return {
        "incident_id": incident_id,
        "next_step": "validate_and_approve_containment",
        "agent": "planner",
        "decision": "Prepared mitigation sequence and analyst handoff guidance.",
    }
