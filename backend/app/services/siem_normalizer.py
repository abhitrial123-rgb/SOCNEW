from __future__ import annotations


def normalize(alert: dict) -> dict:
    return {"source": alert.get("source", "siem"), "message": alert.get("message", ""), "severity": alert.get("severity", 0.5)}
