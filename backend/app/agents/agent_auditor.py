from __future__ import annotations


def audit(decision: dict) -> dict:
    return {"agent": "auditor", "decision": f"Audited: {decision['decision']}"}
