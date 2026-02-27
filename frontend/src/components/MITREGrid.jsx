export default function MITREGrid({ incidents = [] }) {
  const ids = [...new Set(incidents.flatMap((i) => i.mitre_ids || []))]
  return (
    <div className="card" style={{ gridColumn: 'span 4' }}>
      <h3>MITRE Coverage</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {ids.length ? ids.map((id) => <span className="stage" key={id}>{id}</span>) : <span className="muted">No mapped techniques yet.</span>}
      </div>
    </div>
  )
}
