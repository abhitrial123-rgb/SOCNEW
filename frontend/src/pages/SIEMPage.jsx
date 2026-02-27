export default function SIEMPage({ siem }) {
  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 6' }}>
        <h3>SIEM Connectivity</h3>
        {siem?.connectors?.map((c) => <div className="feed-item" key={c.name}>{c.name}: {c.status}</div>)}
      </div>
    </div>
  )
}
