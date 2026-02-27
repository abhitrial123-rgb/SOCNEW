export default function IncidentDrawer({ incident, onClose }) {
  if (!incident) return null
  return (
    <aside className="drawer">
      <button className="btn ghost" onClick={onClose}>Close</button>
      <h2>{incident.title}</h2>
      <p className="muted">{incident.id}</p>
      <p><strong>Risk:</strong> {incident.risk_score} ({incident.risk_level})</p>
      <p><strong>MITRE:</strong> {incident.mitre_ids?.join(', ') || 'n/a'}</p>
      <p>{incident.reasoning || 'No reasoning provided.'}</p>
    </aside>
  )
}
