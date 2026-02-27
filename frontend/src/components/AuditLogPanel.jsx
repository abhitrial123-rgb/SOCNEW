export default function AuditLogPanel({ data = [] }) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <h3>Audit Trail</h3>
      {data.slice(0, 6).map((e, i) => <div className="feed-item" key={i}>{e.actor}: {e.action}</div>)}
      {!data.length && <div className="muted">No audit records yet.</div>}
    </div>
  )
}
