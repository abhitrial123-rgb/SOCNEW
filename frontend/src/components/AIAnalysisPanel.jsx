export default function AIAnalysisPanel({ incident }) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <h3>AI Analysis</h3>
      <div><strong>{incident?.title || 'No incident selected'}</strong></div>
      <p className="muted" style={{ minHeight: 52 }}>{incident?.reasoning || 'Select an incident to inspect LLM reasoning and MITRE context.'}</p>
      <div className="muted">Confidence: {incident ? `${Math.round(incident.confidence * 100)}%` : 'n/a'}</div>
    </div>
  )
}
