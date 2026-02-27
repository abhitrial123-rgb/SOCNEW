export default function SLATracker({ data = [] }) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <h3>SLA Tracker</h3>
      {data.slice(0, 6).map((s) => (
        <div className="bar-row" key={s.incident_id}>
          <div style={{ width: 120 }}>{s.incident_id.slice(0, 8)}</div>
          <div className="bar"><span style={{ width: `${Math.min(Math.round((s.elapsed_minutes / s.policy_minutes) * 100), 100)}%` }} /></div>
          <div>{s.elapsed_minutes}/{s.policy_minutes}m</div>
        </div>
      ))}
    </div>
  )
}
