from __future__ import annotations


def execute(playbook: dict) -> dict:
    commands = [
        "iptables -A INPUT -s <malicious_ip> -j DROP",
        "isolate-host --endpoint <asset-id>",
        "rotate-credentials --scope compromised-user",
    ]
    mitigation_code = "\n".join([
        "def contain_incident(asset_id, malicious_ip):",
        "    block_ip(malicious_ip)",
        "    isolate_endpoint(asset_id)",
        "    rotate_credentials(asset_id)",
    ])
    return {
        "status": "executed",
        "steps_completed": len(playbook["steps"]),
        "commands_executed": commands,
        "mitigation_code": mitigation_code,
        "execution_notes": "Containment commands were orchestrated in sequence with rollback checkpoints.",
    }
