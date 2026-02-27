export default function AgentActivityPanel({ data = [] }) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <h3>Agent Activity</h3>
      {data.slice(0, 8).map((a, i) => (
        <div className="feed-item" key={i}>
          <div><strong>{a.agent}</strong></div>
          <div className="muted">{a.decision}</div>
        </div>
      ))}
      {!data.length && <div className="muted">No agent events available. Trigger ingestion to populate planner/executor/auditor decisions.</div>}
    </div>
  )
}
