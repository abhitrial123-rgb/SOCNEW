const stages = ['Ingestion', 'Detection', 'AI Correlation', 'Risk Prioritization', 'Mitigation']

export default function PipelineFlow({ activeStage = 'Risk Prioritization' }) {
  return (
    <div className="card" style={{ gridColumn: 'span 8' }}>
      <h3>Pipeline Flow (Streamlined)</h3>
      <div className="pipeline">
        {stages.map((s) => <div key={s} className={`stage ${s === activeStage ? 'active' : ''}`}>{s}</div>)}
      </div>
    </div>
  )
}
