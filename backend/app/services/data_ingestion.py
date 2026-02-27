from __future__ import annotations

from typing import Any, Dict, List

from app.services.log_parser import normalize_log


def ingest(logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [normalize_log(log) for log in logs]
