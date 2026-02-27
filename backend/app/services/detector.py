from __future__ import annotations

from typing import Any, Dict


SUSPICIOUS_KEYWORDS = ("ransom", "beacon", "exfil", "bruteforce", "privilege")


def detect(log: Dict[str, Any]) -> Dict[str, Any]:
    event = str(log.get("event", "")).lower()
    confidence = 0.55
    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in event:
            confidence += 0.1
    return {
        "classification": "malicious" if confidence >= 0.65 else "benign",
        "confidence": min(confidence, 0.99),
        "reasoning": f"Keyword-based detection for event '{event}'",
    }
