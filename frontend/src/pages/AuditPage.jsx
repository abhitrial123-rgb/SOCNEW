import AuditLogPanel from '../components/AuditLogPanel'
import AgentActivityPanel from '../components/AgentActivityPanel'

export default function AuditPage({ audit, agents }) {
  return <div className="grid"><AuditLogPanel data={audit} /><AgentActivityPanel data={agents} /></div>
}
