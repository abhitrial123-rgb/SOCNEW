import LiveIncidentFeed from '../components/LiveIncidentFeed'
import DistributionChart from '../components/DistributionChart'
import MITREGrid from '../components/MITREGrid'

export default function IncidentsPage({ incidents, onSelect, onRefresh, onActionOpen }) {
  return <div className="grid"><LiveIncidentFeed data={incidents} onSelect={onSelect} onRefresh={onRefresh} onActionOpen={onActionOpen} /><DistributionChart incidents={incidents} /><MITREGrid incidents={incidents} /></div>
}
