from __future__ import annotations


def generate(incident_id: str, risk_level: str) -> dict:
    return {
        "incident_id": incident_id,
        "risk_level": risk_level,
        "steps": ["Containment", "Isolation", "Blocking", "Recovery", "Forensics"],
    }
