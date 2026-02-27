from __future__ import annotations


def score(severity: float, confidence: float, asset_criticality: float) -> tuple[float, str]:
    value = round(severity * confidence * asset_criticality * 100, 2)
    if value >= 85:
        level = "Critical"
    elif value >= 60:
        level = "High"
    elif value >= 30:
        level = "Medium"
    else:
        level = "Low"
    return value, level
