from __future__ import annotations

repo: dict[str, dict] = {}


def store_playbook(playbook: dict) -> None:
    repo[playbook["incident_id"]] = playbook


def get_playbook(incident_id: str) -> dict | None:
    return repo.get(incident_id)
