from __future__ import annotations

from app.core.store import store


def get_history(tenant_id: str) -> dict:
    return {"incidents": store.incidents[tenant_id], "cases": store.cases[tenant_id]}
