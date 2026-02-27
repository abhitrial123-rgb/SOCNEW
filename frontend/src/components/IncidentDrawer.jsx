import { useEffect, useState } from 'react'
import api from '../services/api'

export default function IncidentDrawer({ incident, onClose }) {
  const [playbook, setPlaybook] = useState(null)
  const [incidentLog, setIncidentLog] = useState([])
  const [incidentAudit, setIncidentAudit] = useState([])
  const [incidentAgents, setIncidentAgents] = useState([])
  const [report, setReport] = useState('')

  useEffect(() => {
    let mounted = true
    if (!incident?.id) {
      setPlaybook(null)
      setIncidentLog([])
      setIncidentAudit([])
      setIncidentAgents([])
      setReport('')
      return
    }

    Promise.allSettled([
      api.get(`/api/playbooks/${incident.id}`),
      api.get(`/api/incidents/${incident.id}/log`),
      api.get(`/api/incidents/${incident.id}/audit`),
      api.get(`/api/incidents/${incident.id}/agents`),
      api.get(`/api/incidents/${incident.id}/report`),
    ]).then(([p, l, a, g, r]) => {
      if (!mounted) return
      setPlaybook(p.status === 'fulfilled' ? p.value.data : null)
      setIncidentLog(l.status === 'fulfilled' ? l.value.data : [])
      setIncidentAudit(a.status === 'fulfilled' ? a.value.data : [])
      setIncidentAgents(g.status === 'fulfilled' ? g.value.data : [])
      setReport(r.status === 'fulfilled' ? r.value.data.report : '')
    })

    return () => { mounted = false }
  }, [incident?.id])

  if (!incident) return null
  const execEntry = incidentLog.find((e) => e.action === 'executed')

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

      <h3>Expert AI Breakdown</h3>
      <p className="muted">{incident.expert_analysis || playbook?.llm_contribution?.expert_analysis || 'No expert analysis available.'}</p>
      <div className="muted" style={{ fontSize: 12 }}>References: {(playbook?.llm_contribution?.references || incident.references || []).join(' • ') || 'N/A'}</div>

      <h3>Recommended Analyst Response</h3>
      <ol>
        {(incident.recommended_actions || playbook?.recommended_actions || []).map((step) => <li key={step}>{step}</li>)}
      </ol>

      <h3>Mitigation Execution Timeline</h3>
      <ul>
        {incidentLog.map((entry, idx) => (
          <li key={`${entry.timestamp}-${idx}`}>{entry.timestamp} · {entry.stage} · {entry.action}</li>
        ))}
      </ul>
      <p className="muted">Commands: {(execEntry?.details?.commands_executed || []).join(' | ') || 'Not executed yet'}</p>
      <pre className="code-block">{execEntry?.details?.mitigation_code || '# No mitigation code executed yet'}</pre>

      <h3>Incident-specific Audits</h3>
      <ul>
        {incidentAudit.map((item, idx) => <li key={idx}>{item.timestamp} · {item.actor} · {item.action}</li>)}
      </ul>

      <h3>Agents Used in This Incident</h3>
      <ul>
        {incidentAgents.map((a, idx) => <li key={idx}>{a.timestamp} · {a.agent}: {a.decision}</li>)}
      </ul>

      <h3>Formal Incident Log</h3>
      <pre className="code-block">{report || 'Report pending'}</pre>
    </aside>
  )
}
