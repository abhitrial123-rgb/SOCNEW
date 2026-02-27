import api from '../services/api'

async function send(action, incident_id) {
  await api.post(`/api/mitigation/${action}`, { incident_id })
}

const analystGuide = [
  '1) Validate affected asset and user context before containment.',
  '2) Approve containment for confirmed malicious incidents only.',
  '3) Reject and request telemetry expansion for low-confidence detections.',
  '4) Execute playbook only after approval and notify stakeholders.',
]

export default function MitigationQueue({ incidents = [], onRefresh, onSelectIncident }) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <h3>Mitigation Queue</h3>
      <div className="muted" style={{ marginBottom: 8 }}>
        SOC Response Guide:
        <ul>
          {analystGuide.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </div>
      {incidents.slice(0, 4).map((i) => (
        <div className="feed-item" key={i.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span onClick={() => onSelectIncident?.(i)} style={{ cursor: 'pointer' }}><strong>{i.title}</strong> · {i.classification || 'Suspicious Activity'}</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button className="btn ghost" onClick={() => send('approve', i.id).then(onRefresh)}>Approve</button>
              <button className="btn ghost" onClick={() => send('reject', i.id).then(onRefresh)}>Reject</button>
              <button className="btn" onClick={() => send('execute', i.id).then(onRefresh)}>Execute</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
