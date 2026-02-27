from __future__ import annotations


def map_mitre(mitre_id: str) -> dict:
    mappings = {
        "T1110": {
            "tactic": "Credential Access",
            "technique_id": "T1110",
            "description": "Brute Force",
            "attack_criticality": 1.35,
        },
        "T1071": {
            "tactic": "Command and Control",
            "technique_id": "T1071",
            "description": "Application Layer Protocol",
            "attack_criticality": 1.2,
        },
        "T1486": {
            "tactic": "Impact",
            "technique_id": "T1486",
            "description": "Data Encrypted for Impact",
            "attack_criticality": 1.5,
        },
        "T1048": {
            "tactic": "Exfiltration",
            "technique_id": "T1048",
            "description": "Exfiltration Over Alternative Protocol",
            "attack_criticality": 1.4,
        },
        "T1595": {
            "tactic": "Reconnaissance",
            "technique_id": "T1595",
            "description": "Active Scanning",
            "attack_criticality": 0.95,
        },
    }
    return mappings.get(
        mitre_id,
        {
            "tactic": "Unknown",
            "technique_id": mitre_id,
            "description": "Unknown",
            "attack_criticality": 1.0,
        },
    )
