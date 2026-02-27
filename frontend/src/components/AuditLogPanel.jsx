function detailSummary(event) {
  const cls = event?.details?.classification || 'N/A'
  const risk = event?.details?.risk_level || 'N/A'
  const incident = event?.details?.incident_id ? event.details.incident_id.slice(0, 8) : 'n/a'
  return `Incident ${incident} · Classification ${cls} · Risk ${risk}`
}

export default function AuditLogPanel({ data = [] }) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <h3>Audit Trail</h3>
      {data.slice(0, 8).map((e, i) => (
        <div className="feed-item" key={i}>
          <div><strong>{e.actor}</strong>: {e.action}</div>
          <div className="muted" style={{ fontSize: 12 }}>{detailSummary(e)}</div>
        </div>
      ))}
      {!data.length && <div className="muted">No audit records yet.</div>}
    </div>
  )
}
