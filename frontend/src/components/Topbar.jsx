export default function Topbar({ user, onRefresh }) {
  return (
    <header className="topbar">
      <div>
        <strong>NEXUS SOC Command Center</strong>
        <div className="muted" style={{ fontSize: 12 }}>Live AI-driven security operations</div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="muted">{user?.username} · {user?.role}</span>
        <button className="btn ghost" onClick={onRefresh}>Refresh</button>
      </div>
    </header>
  )
}
