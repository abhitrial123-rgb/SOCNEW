from __future__ import annotations

from typing import List


def load_default_dataset() -> List[dict]:
    return [
        {"event": "Bruteforce login attempts", "source_ip": "198.51.100.11", "severity": 0.9, "asset_criticality": 1.2},
        {"event": "Suspicious process beacon", "source_ip": "203.0.113.77", "severity": 0.8, "asset_criticality": 1.5},
    ]
