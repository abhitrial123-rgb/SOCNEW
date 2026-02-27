import ThreatIntelPanel from '../components/ThreatIntelPanel'
import MITREGrid from '../components/MITREGrid'

export default function IntelPage({ incidents }) {
  return <div className="grid"><ThreatIntelPanel incidents={incidents} /><MITREGrid incidents={incidents} /></div>
}
