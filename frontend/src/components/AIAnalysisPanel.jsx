export default function AIAnalysisPanel({ incident }) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <h3>AI Analysis</h3>
      <div><strong>{incident?.title || 'No incident selected'}</strong></div>
      <div className="muted" style={{ marginTop: 6 }}>
        Classification: <strong>{incident?.classification || 'n/a'}</strong>
      </div>
      <p className="muted" style={{ minHeight: 52 }}>{incident?.reasoning || 'Select an incident to inspect AI reasoning, ATT&CK mapping, and references.'}</p>
      <div className="muted">Confidence: {incident ? `${Math.round(incident.confidence * 100)}%` : 'n/a'}</div>
      <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
        References: {incident?.references?.length ? incident.references.join(' • ') : 'No references available'}
      </div>
    </div>
  )
}
