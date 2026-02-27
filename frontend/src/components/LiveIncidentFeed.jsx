import api from '../services/api'

function badge(level = 'Low') {
  const cls = level.toLowerCase()
  return <span className={`badge ${cls}`}>{level}</span>
}

async function doAction(action, incidentId) {
  await api.post(`/api/mitigation/${action}`, { incident_id: incidentId })
}

export default function LiveIncidentFeed({ data = [], onSelect, onRefresh }) {
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
            <button className="btn ghost" onClick={() => doAction('approve', incident.id).then(onRefresh)}>Approve</button>
            <button className="btn ghost" onClick={() => doAction('reject', incident.id).then(onRefresh)}>Reject</button>
            <button className="btn" onClick={() => doAction('execute', incident.id).then(onRefresh)}>Execute</button>
          </div>
        </div>
      ))}
    </div>
  )
}
