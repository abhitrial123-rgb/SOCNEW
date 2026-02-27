import MetricsRow from '../components/MetricsRow'
import RiskGauge from '../components/RiskGauge'
import LiveIncidentFeed from '../components/LiveIncidentFeed'
import DistributionChart from '../components/DistributionChart'
import PipelineFlow from '../components/PipelineFlow'
import AIAnalysisPanel from '../components/AIAnalysisPanel'
import MitigationQueue from '../components/MitigationQueue'
import MITREGrid from '../components/MITREGrid'
import ThreatIntelPanel from '../components/ThreatIntelPanel'
import CasePanel from '../components/CasePanel'
import SLATracker from '../components/SLATracker'
import AuditLogPanel from '../components/AuditLogPanel'
import AgentActivityPanel from '../components/AgentActivityPanel'

export default function DashboardPage({ state, selectedIncident, onSelectIncident, onRefresh }) {
  const { metrics, incidents, cases, sla, audit, agents } = state
  return (
    <div className="grid">
      <MetricsRow data={metrics} />
      <RiskGauge incidents={incidents} />
      <LiveIncidentFeed data={incidents} onSelect={onSelectIncident} />
      <DistributionChart incidents={incidents} />
      <PipelineFlow />
      <AIAnalysisPanel incident={selectedIncident} />
      <MitigationQueue incidents={incidents} onRefresh={onRefresh} />
      <MITREGrid incidents={incidents} />
      <ThreatIntelPanel incidents={incidents} />
      <CasePanel cases={cases} />
      <SLATracker data={sla} />
      <AuditLogPanel data={audit} />
      <AgentActivityPanel data={agents} />
    </div>
  )
}
