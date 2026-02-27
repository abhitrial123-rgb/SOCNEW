import api from '../services/api'

function badge(level = 'Low') {
  const cls = level.toLowerCase()
  return <span className={`badge ${cls}`}>{level}</span>
}

async function doAction(action, incidentId) {
  await api.post(`/api/mitigation/${action}`, { incident_id: incidentId })
}

export default function LiveIncidentFeed({ data = [], onSelect, onRefresh, onActionOpen }) {
  const handleAction = async (action, incident) => {
    await doAction(action, incident.id)
    onActionOpen?.(incident)
    await onRefresh?.()
  }

  return (
    <div className="card" style={{ gridColumn: 'span 4' }}>
      <h3>Live Incident Feed</h3>
      {data.slice(0, 6).map((incident) => (
        <div className="feed-item" key={incident.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong onClick={() => onSelect?.(incident)} style={{ cursor: 'pointer' }}>{incident.title}</strong>{badge(incident.risk_level)}
          </div>
          <div className="muted">Source IP: {incident.source_ip || 'N/A'}</div>
          <div className="muted">Created: {incident.created_at ? new Date(incident.created_at).toLocaleString() : 'N/A'}</div>
          <div className="muted">Classification: {incident.classification || 'N/A'} · Confidence {Math.round((incident.confidence || 0) * 100)}%</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <button className="btn ghost" onClick={() => handleAction('approve', incident)}>Approve</button>
            <button className="btn ghost" onClick={() => handleAction('reject', incident)}>Reject</button>
            <button className="btn" onClick={() => handleAction('execute', incident)}>Execute</button>
          </div>
        </div>
      ))}
    </div>
  )
}
