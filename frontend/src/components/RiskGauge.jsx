export default function RiskGauge({ incidents = [] }) {
  const score = incidents.length ? Math.round(incidents.reduce((a, b) => a + (b.risk_score || 0), 0) / incidents.length) : 0
  const level = score > 75 ? 'CRITICAL' : score > 55 ? 'HIGH' : score > 30 ? 'MEDIUM' : 'LOW'
  return (
    <div className="card" style={{ gridColumn: 'span 4' }}>
      <h3>Risk Gauge</h3>
      <div style={{ fontSize: 36, fontWeight: 700 }}>{score}</div>
      <div className="muted">Environment Risk Level: <strong>{level}</strong></div>
      <div className="bar" style={{ marginTop: 12 }}><span style={{ width: `${Math.min(score, 100)}%` }} /></div>
    </div>
  )
}
