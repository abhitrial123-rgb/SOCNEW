from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class Role(str, Enum):
    analyst = "Analyst"
    manager = "Manager"
    admin = "Admin"


class Incident(BaseModel):
    id: str
    tenant_id: str
    title: str
    severity: float
    confidence: float
    asset_criticality: float
    risk_score: float
    risk_level: str
    status: str = "Open"
    mitre_ids: List[str] = Field(default_factory=list)
    classification: str = "Suspicious Activity"
    reasoning: str = ""
    references: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CaseStatus(str, Enum):
    open = "Open"
    investigating = "Investigating"
    contained = "Contained"
    resolved = "Resolved"
    closed = "Closed"


class Case(BaseModel):
    id: str
    tenant_id: str
    incident_id: str
    analyst: str
    notes: List[str] = Field(default_factory=list)
    evidence: List[str] = Field(default_factory=list)
    status: CaseStatus = CaseStatus.open
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuditEvent(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    tenant_id: str
    actor: str
    action: str
    details: Dict[str, Any] = Field(default_factory=dict)


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class IngestRequest(BaseModel):
    source: str = "manual"
    logs: List[Dict[str, Any]]


class MitigationAction(BaseModel):
    incident_id: str
    playbook: Optional[str] = None


class TenantSwitchRequest(BaseModel):
    tenant_id: str


class DashboardMetrics(BaseModel):
    active_incidents: int
    critical_incidents: int
    open_cases: int
    avg_sla_minutes: float


class AgentActivity(BaseModel):
    agent: str
    decision: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
