function badge(level = 'Low') {
  const cls = level.toLowerCase()
  return <span className={`badge ${cls}`}>{level}</span>
}

export default function LiveIncidentFeed({ data = [], onSelect }) {
  return (
    <div className="card" style={{ gridColumn: 'span 4' }}>
      <h3>Live Incident Feed</h3>
      {data.slice(0, 6).map((incident) => (
        <div className="feed-item" key={incident.id} onClick={() => onSelect?.(incident)}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{incident.title}</strong>{badge(incident.risk_level)}
          </div>
          <div className="muted">Confidence {Math.round((incident.confidence || 0) * 100)}% · MITRE {incident.mitre_ids?.join(', ') || 'n/a'}</div>
        </div>
      ))}
    </div>
  )
}
