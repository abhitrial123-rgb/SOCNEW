const fields = [
  ['Active Incidents', 'active_incidents'],
  ['Critical Incidents', 'critical_incidents'],
  ['Open Cases', 'open_cases'],
  ['Avg SLA (min)', 'avg_sla_minutes']
]

export default function MetricsRow({ data }) {
  return fields.map(([label, key], idx) => (
    <div className="card" style={{ gridColumn: 'span 3' }} key={idx}>
      <div className="muted">{label}</div>
      <div className="metric">{data?.[key] ?? 0}</div>
    </div>
  ))
}
