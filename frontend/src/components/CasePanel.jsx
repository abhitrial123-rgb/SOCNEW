export default function CasePanel({ cases = [] }) {
  return (
    <div className="card" style={{ gridColumn: 'span 4' }}>
      <h3>Case Management</h3>
      {cases.slice(0, 5).map((c) => <div className="feed-item" key={c.id}>{c.id} · {c.status}</div>)}
      {!cases.length && <div className="muted">No cases created.</div>}
    </div>
  )
}
