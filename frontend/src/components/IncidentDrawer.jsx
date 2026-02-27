import { useEffect, useState } from 'react'
import api from '../services/api'

export default function IncidentDrawer({ incident, onClose }) {
  const [playbook, setPlaybook] = useState(null)

  useEffect(() => {
    let mounted = true
    if (!incident?.id) {
      setPlaybook(null)
      return
    }
    api.get(`/api/playbooks/${incident.id}`).then((res) => {
      if (mounted) setPlaybook(res.data)
    }).catch(() => {
      if (mounted) setPlaybook(null)
    })
    return () => { mounted = false }
  }, [incident?.id])

  if (!incident) return null
  return (
    <aside className="drawer">
      <button className="btn ghost" onClick={onClose}>Close</button>
      <h2>{incident.title}</h2>
      <p className="muted">{incident.id}</p>
      <p><strong>Classification:</strong> {incident.classification || 'N/A'}</p>
      <p><strong>Risk:</strong> {incident.risk_score} ({incident.risk_level})</p>
      <p><strong>MITRE:</strong> {incident.mitre_ids?.join(', ') || 'n/a'}</p>
      <p><strong>Reasoning:</strong> {incident.reasoning || 'No reasoning provided.'}</p>

      <h3>Recommended Analyst Response</h3>
      <ol>
        {(incident.recommended_actions || playbook?.recommended_actions || []).map((step) => <li key={step}>{step}</li>)}
      </ol>

      <h3>Mitigation Queue Navigation</h3>
      <ul>
        <li>Use <strong>Approve</strong> for verified malicious events with clear impact.</li>
        <li>Use <strong>Reject</strong> if evidence is insufficient and gather additional telemetry.</li>
        <li>Use <strong>Execute</strong> only after approval to run containment/recovery actions.</li>
      </ul>
    </aside>
  )
}
