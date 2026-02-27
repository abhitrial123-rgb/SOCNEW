from __future__ import annotations


def execute(plan: dict) -> dict:
    return {"agent": "executor", "decision": f"Executed {plan['next_step']}"}
