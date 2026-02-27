from __future__ import annotations

from uuid import uuid4

from app.core.store import store
from app.models.schemas import Case


def create_case(tenant_id: str, incident_id: str, analyst: str) -> Case:
    case = Case(id=str(uuid4()), tenant_id=tenant_id, incident_id=incident_id, analyst=analyst)
    store.cases[tenant_id].append(case)
    return case
