export default function ThreatIntelPanel({ incidents = [] }) {
  const avg = incidents.length ? Math.round(incidents.reduce((a, b) => a + b.severity * 25, 0) / incidents.length) : 0
  return (
    <div className="card" style={{ gridColumn: 'span 4' }}>
      <h3>Threat Intel Summary</h3>
      <div className="metric">{avg}</div>
      <div className="muted">Composite reputation score based on current detections and enrichment confidence.</div>
    </div>
  )
}
