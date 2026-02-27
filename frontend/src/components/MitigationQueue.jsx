import api from '../services/api'

async function send(action, incident_id) {
  await api.post(`/api/mitigation/${action}`, { incident_id })
}

export default function MitigationQueue({ incidents = [], onRefresh }) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <h3>Mitigation Queue</h3>
      {incidents.slice(0, 4).map((i) => (
        <div className="feed-item" key={i.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{i.title}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn ghost" onClick={() => send('approve', i.id).then(onRefresh)}>Approve</button>
              <button className="btn ghost" onClick={() => send('reject', i.id).then(onRefresh)}>Reject</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
