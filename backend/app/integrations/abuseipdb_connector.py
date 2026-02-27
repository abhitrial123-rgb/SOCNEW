from __future__ import annotations


def query_abuse(ip: str) -> dict:
    return {"ip": ip, "abuse_confidence": 84, "reports": 15}
