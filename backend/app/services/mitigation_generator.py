from __future__ import annotations


def generate_mitigation(analysis: dict) -> dict:
    return {
        "containment": "Block IOC and isolate endpoint",
        "isolation": "Move host to quarantine VLAN",
        "blocking": "Push firewall deny rule",
        "recovery": "Patch and restore from known-good backup",
        "forensics": "Collect memory and EDR timeline",
        "source": analysis.get("references", []),
    }
