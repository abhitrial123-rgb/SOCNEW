from __future__ import annotations


def map_mitre(mitre_id: str) -> dict:
    mappings = {
        "T1110": {"tactic": "Credential Access", "technique_id": "T1110", "description": "Brute Force"},
        "T1071": {"tactic": "Command and Control", "technique_id": "T1071", "description": "Application Layer Protocol"},
    }
    return mappings.get(mitre_id, {"tactic": "Unknown", "technique_id": mitre_id, "description": "Unknown"})
