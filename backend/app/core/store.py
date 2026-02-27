from __future__ import annotations

from collections import defaultdict, deque
from datetime import datetime
from typing import Deque, Dict, List

from app.models.schemas import AgentActivity, AuditEvent, Case, Incident


class MemoryStore:
    def __init__(self) -> None:
        self.incidents: Dict[str, List[Incident]] = defaultdict(list)
        self.cases: Dict[str, List[Case]] = defaultdict(list)
        self.audit: Dict[str, Deque[AuditEvent]] = defaultdict(lambda: deque(maxlen=2000))
        self.agent_activity: Dict[str, Deque[AgentActivity]] = defaultdict(lambda: deque(maxlen=2000))
        self.incident_logs: Dict[str, List[dict]] = defaultdict(list)
        self.sla_started: Dict[str, datetime] = {}
        self.scheduler_enabled = False
        self.scheduler_interval_seconds = 60
        self.scheduler_last_run: datetime | None = None


store = MemoryStore()
