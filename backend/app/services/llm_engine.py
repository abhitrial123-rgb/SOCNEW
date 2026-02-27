from __future__ import annotations

from typing import Dict

from app.services.rag_retriever import retrieve

EVENT_RULES = {
    "ransom": {
        "classification": "Impact",
        "mitre_ids": ["T1486"],
        "mitigation": [
            "Isolate the affected host from network segments immediately.",
            "Disable privileged credentials observed on impacted endpoints.",
            "Initiate backup validation and restoration plan.",
        ],
    },
    "exfil": {
        "classification": "Exfiltration",
        "mitre_ids": ["T1048"],
        "mitigation": [
            "Block outbound destination and related indicators at perimeter controls.",
            "Revoke or rotate potentially exposed credentials.",
            "Run DLP and proxy log correlation for data loss scope.",
        ],
    },
    "beacon": {
        "classification": "Command and Control",
        "mitre_ids": ["T1071"],
        "mitigation": [
            "Quarantine endpoint and capture volatile memory.",
            "Block C2 domains/IPs and monitor for callback recurrence.",
            "Perform process tree and persistence mechanism review.",
        ],
    },
    "brute": {
        "classification": "Credential Attack",
        "mitre_ids": ["T1110"],
        "mitigation": [
            "Apply temporary account lockout and adaptive authentication.",
            "Enforce MFA reset for targeted identities.",
            "Block source IP/ranges and review IAM audit logs.",
        ],
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
        mitigation_steps = matched_rule["mitigation"]
        adjusted_confidence = min(0.99, confidence + 0.1)
        why = f"Pattern '{matched_key}' matched known adversary behavior and was validated with RAG context."
    else:
        classification = "Suspicious Activity" if confidence >= 0.6 else "Informational"
        mitre_ids = ["T1071"] if confidence >= 0.6 else ["T1595"]
        mitigation_steps = [
            "Collect additional endpoint and network telemetry.",
            "Correlate event with user/device baseline anomalies.",
            "Escalate only if recurrence or lateral movement indicators emerge.",
        ]
        adjusted_confidence = confidence
        why = "No deterministic threat keyword matched; response is based on behavioral confidence."

    return {
        "classification": classification,
        "confidence": round(adjusted_confidence * 100, 2),
        "reasoning": f"Event '{event}' classified as {classification}. {why}",
        "mitre_ids": mitre_ids,
        "references": refs,
        "recommended_actions": mitigation_steps,
        "suggested_mitigation": mitigation_steps[0],
    }
