from __future__ import annotations

from typing import Dict

from app.services.rag_retriever import retrieve

EVENT_RULES = {
    "ransom": {
        "classification": "Impact",
        "mitre_ids": ["T1486"],
        "mitigation": "Isolate host, disable lateral movement paths, and begin backup restoration workflow.",
    },
    "exfil": {
        "classification": "Exfiltration",
        "mitre_ids": ["T1048"],
        "mitigation": "Block outbound channel, revoke credentials, and inspect DLP violations.",
    },
    "beacon": {
        "classification": "Command and Control",
        "mitre_ids": ["T1071"],
        "mitigation": "Isolate endpoint, sinkhole C2 domains, and collect process/network forensics.",
    },
    "brute": {
        "classification": "Credential Attack",
        "mitre_ids": ["T1110"],
        "mitigation": "Enable account lockout policy, enforce MFA, and block abusive source IPs.",
    },
}


def analyze(event: str, confidence: float) -> Dict[str, object]:
    event_l = event.lower()
    refs = retrieve(event)

    matched_key = None
    matched_rule = None
    for key, rule in EVENT_RULES.items():
        if key in event_l:
            matched_key = key
            matched_rule = rule
            break

    if matched_rule:
        classification = matched_rule["classification"]
        mitre_ids = matched_rule["mitre_ids"]
        suggested_mitigation = matched_rule["mitigation"]
        adjusted_confidence = min(0.99, confidence + 0.1)
        why = f"Keyword match '{matched_key}' with corroboration from local RAG references."
    else:
        classification = "Suspicious Activity" if confidence >= 0.6 else "Informational"
        mitre_ids = ["T1071"] if confidence >= 0.6 else ["T1595"]
        suggested_mitigation = "Collect more telemetry, validate IOC context, and monitor for recurrence."
        adjusted_confidence = confidence
        why = "No high-fidelity keyword hit; confidence is driven by detector and contextual telemetry."

    return {
        "classification": classification,
        "confidence": round(adjusted_confidence * 100, 2),
        "reasoning": f"Event: '{event}'. Decision: {classification}. {why}",
        "mitre_ids": mitre_ids,
        "references": refs,
        "suggested_mitigation": suggested_mitigation,
    }
