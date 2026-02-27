import CasePanel from '../components/CasePanel'
import SLATracker from '../components/SLATracker'

export default function CasesPage({ cases, sla }) {
  return <div className="grid"><CasePanel cases={cases} /><SLATracker data={sla} /></div>
}
