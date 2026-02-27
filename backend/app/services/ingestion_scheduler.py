from __future__ import annotations

from app.core.store import store


def toggle_scheduler(enabled: bool) -> bool:
    store.scheduler_enabled = enabled
    return store.scheduler_enabled
