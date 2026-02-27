import { useEffect, useState } from 'react'
import api from '../services/api'

export default function IncidentDrawer({ incident, onClose }) {
  const [playbook, setPlaybook] = useState(null)
  const [incidentLog, setIncidentLog] = useState([])
  const [report, setReport] = useState('')

  useEffect(() => {
    let mounted = true
    if (!incident?.id) {
      setPlaybook(null)
      setIncidentLog([])
      setReport('')
      return
    }

    Promise.allSettled([
      api.get(`/api/playbooks/${incident.id}`),
      api.get(`/api/incidents/${incident.id}/log`),
      api.get(`/api/incidents/${incident.id}/report`),
    ]).then(([p, l, r]) => {
      if (!mounted) return
      setPlaybook(p.status === 'fulfilled' ? p.value.data : null)
      setIncidentLog(l.status === 'fulfilled' ? l.value.data : [])
      setReport(r.status === 'fulfilled' ? r.value.data.report : '')
    })

    return () => { mounted = false }
  }, [incident?.id])

  if (!incident) return null
  return (
    <aside className="drawer">
      <button className="btn ghost" onClick={onClose}>Close</button>
      <h2>{incident.title}</h2>
      <p className="muted">{incident.id}</p>
      <p><strong>Source IP:</strong> {incident.source_ip || 'N/A'}</p>
      <p><strong>Generated:</strong> {incident.created_at ? new Date(incident.created_at).toLocaleString() : 'N/A'}</p>
      <p><strong>Classification:</strong> {incident.classification || 'N/A'}</p>
      <p><strong>Risk:</strong> {incident.risk_score} ({incident.risk_level})</p>
      <p><strong>MITRE:</strong> {incident.mitre_ids?.join(', ') || 'n/a'}</p>
      <p><strong>Reasoning:</strong> {incident.reasoning || 'No reasoning provided.'}</p>

      <h3>How LLM Contributed</h3>
      <p className="muted">{playbook?.llm_contribution?.reasoning || incident.reasoning}</p>
      <div className="muted" style={{ fontSize: 12 }}>References: {(playbook?.llm_contribution?.references || incident.references || []).join(' • ') || 'N/A'}</div>

      <h3>Recommended Analyst Response</h3>
      <ol>
        {(incident.recommended_actions || playbook?.recommended_actions || []).map((step) => <li key={step}>{step}</li>)}
      </ol>

      <h3>Execution Process</h3>
      <ul>
        {(incidentLog || []).map((entry, idx) => (
          <li key={`${entry.timestamp}-${idx}`}>{entry.timestamp} · {entry.stage} · {entry.action}</li>
        ))}
      </ul>
      <p className="muted">Commands: {(incidentLog.find((e) => e.action === 'executed')?.details?.commands_executed || []).join(' | ') || 'Not executed yet'}</p>
      <pre className="code-block">{incidentLog.find((e) => e.action === 'executed')?.details?.mitigation_code || '# No mitigation code executed yet'}</pre>

      <h3>Formal Incident Log</h3>
      <pre className="code-block">{report || 'Report pending'}</pre>
    </aside>
  )
}
