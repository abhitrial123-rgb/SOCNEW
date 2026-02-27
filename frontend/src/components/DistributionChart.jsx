export default function DistributionChart({ incidents = [] }) {
  const levels = ['Critical', 'High', 'Medium', 'Low']
  const counts = levels.map((l) => incidents.filter((i) => i.risk_level === l).length)
  const max = Math.max(...counts, 1)
  return (
    <div className="card" style={{ gridColumn: 'span 4' }}>
      <h3>Incident Distribution</h3>
      {levels.map((level, i) => (
        <div className="bar-row" key={level}>
          <div style={{ width: 60 }}>{level}</div>
          <div className="bar"><span style={{ width: `${(counts[i] / max) * 100}%` }} /></div>
          <div>{counts[i]}</div>
        </div>
      ))}
    </div>
  )
}
