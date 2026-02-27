from __future__ import annotations

from app.core.store import store


MIN_INTERVAL_SECONDS = 15


def toggle_scheduler(enabled: bool, interval_seconds: int | None = None) -> dict:
    if interval_seconds is not None:
        store.scheduler_interval_seconds = max(MIN_INTERVAL_SECONDS, int(interval_seconds))
    store.scheduler_enabled = enabled
    return {
        "enabled": store.scheduler_enabled,
        "interval_seconds": store.scheduler_interval_seconds,
        "last_run": store.scheduler_last_run,
    }


def scheduler_status() -> dict:
    return {
        "enabled": store.scheduler_enabled,
        "interval_seconds": store.scheduler_interval_seconds,
        "last_run": store.scheduler_last_run,
    }
