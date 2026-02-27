from __future__ import annotations

from app.agents.agent_auditor import audit
from app.agents.agent_executor import execute
from app.agents.agent_planner import plan


def run_agents(incident_id: str) -> list[dict]:
    p = plan(incident_id)
    e = execute(p)
    a = audit(e)
    return [p, e, a]
