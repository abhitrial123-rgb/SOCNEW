from __future__ import annotations

from uuid import uuid4

from app.agents.agent_orchestrator import run_agents
from app.core.store import store
from app.models.schemas import Incident
from app.playbooks.playbook_generator import generate
from app.playbooks.playbook_repository import store_playbook
from app.services.audit_logger import log_event
from app.services.detector import detect
from app.services.intel_correlator import correlate
from app.services.llm_engine import analyze
from app.services.mitigation_generator import generate_mitigation
from app.services.mitre_mapper import map_mitre
from app.services.risk_scoring_engine import score
from app.services.sla_tracker import start
from app.services.threat_intel_fetcher import enrich


def run_pipeline(tenant_id: str, parsed_log: dict) -> Incident:
    detection = detect(parsed_log)
    ai = analyze(parsed_log["event"], detection["confidence"])
    mitre = [map_mitre(mid) for mid in ai["mitre_ids"]]
    attack_criticality = max((m.get("attack_criticality", 1.0) for m in mitre), default=1.0)

    intel = correlate(enrich(parsed_log["source_ip"]))
    risk_score, risk_level = score(
        parsed_log["severity"],
        detection["confidence"],
        parsed_log["asset_criticality"],
        attack_criticality,
    )

    incident = Incident(
        id=str(uuid4()),
        tenant_id=tenant_id,
        title=parsed_log["event"],
        severity=parsed_log["severity"],
        confidence=detection["confidence"],
        asset_criticality=parsed_log["asset_criticality"],
        risk_score=risk_score,
        risk_level=risk_level,
        mitre_ids=ai["mitre_ids"],
        reasoning=ai["reasoning"],
        classification=ai["classification"],
        references=ai["references"],
        recommended_actions=ai["recommended_actions"],
    )
    store.incidents[tenant_id].append(incident)

    playbook = generate(incident.id, risk_level)
    playbook["mitigation"] = generate_mitigation(ai)
    playbook["mitre"] = mitre
    playbook["intel"] = intel
    playbook["attack_criticality"] = attack_criticality
    playbook["recommended_actions"] = ai["recommended_actions"]
    store_playbook(playbook)

    run_agents(tenant_id, incident.id)
    start(incident.id)

    log_event(
        tenant_id,
        "pipeline",
        "incident_generated",
        {
            "incident_id": incident.id,
            "classification": incident.classification,
            "risk_level": incident.risk_level,
            "mitre_ids": incident.mitre_ids,
            "recommended_actions": incident.recommended_actions,
        },
    )
    return incident
