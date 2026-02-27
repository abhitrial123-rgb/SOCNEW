const stages = ['Ingestion', 'Detection', 'LLM/RAG', 'MITRE', 'Intel', 'Risk', 'Playbook', 'Case']

export default function PipelineFlow({ activeStage = 'Risk' }) {
  return (
    <div className="card" style={{ gridColumn: 'span 8' }}>
      <h3>Pipeline Flow</h3>
      <div className="pipeline">
        {stages.map((s) => <div key={s} className={`stage ${s === activeStage ? 'active' : ''}`}>{s}</div>)}
      </div>
    </div>
  )
}
