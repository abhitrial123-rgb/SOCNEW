from __future__ import annotations

from app.core.store import store
from app.models.schemas import AuditEvent


def log_event(tenant_id: str, actor: str, action: str, details: dict | None = None) -> None:
    store.audit[tenant_id].appendleft(AuditEvent(tenant_id=tenant_id, actor=actor, action=action, details=details or {}))
