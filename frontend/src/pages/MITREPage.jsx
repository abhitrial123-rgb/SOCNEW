import MITREGrid from '../components/MITREGrid'
import AIAnalysisPanel from '../components/AIAnalysisPanel'

export default function MITREPage({ incidents, selectedIncident }) {
  return <div className="grid"><MITREGrid incidents={incidents} /><AIAnalysisPanel incident={selectedIncident} /></div>
}
