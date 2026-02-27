from __future__ import annotations


def execute(playbook: dict) -> dict:
    return {"status": "executed", "steps_completed": len(playbook["steps"])}
