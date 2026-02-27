from __future__ import annotations

from typing import Any, Dict


def normalize_log(log: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "event": log.get("event", "unknown"),
        "source_ip": log.get("source_ip", "0.0.0.0"),
        "severity": float(log.get("severity", 0.5)),
        "asset_criticality": float(log.get("asset_criticality", 1.0)),
        "raw": log,
    }
