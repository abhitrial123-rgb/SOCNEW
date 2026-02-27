export default function AgentActivityPanel({ data = [] }) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <h3>Agent Activity</h3>
      {data.slice(0, 6).map((a, i) => <div className="feed-item" key={i}>{a.agent}: {a.decision}</div>)}
      {!data.length && <div className="muted">No agent events available.</div>}
    </div>
  )
}
