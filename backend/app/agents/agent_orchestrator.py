from __future__ import annotations

from datetime import datetime, timezone

from app.agents.agent_auditor import audit
from app.agents.agent_executor import execute
from app.agents.agent_planner import plan
from app.core.store import store
from app.models.schemas import AgentActivity


def run_agents(tenant_id: str, incident_id: str) -> list[dict]:
    p = plan(incident_id)
    e = execute(p)
    a = audit(e)

    for event in (p, e, a):
        activity = AgentActivity(
            incident_id=incident_id,
            agent=event.get("agent", "unknown"),
            decision=event.get("decision") or event.get("next_step", "n/a"),
        )
        store.agent_activity[tenant_id].appendleft(activity)
        store.incident_logs[incident_id].append(
            {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "stage": "agent",
                "action": activity.agent,
                "details": {"decision": activity.decision},
            }
        )

    return [p, e, a]
