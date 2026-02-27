export default function Layout({ nav, topbar, children }) {
  return (
    <div className="shell">
      <aside className="sidebar">{nav}</aside>
      <section className="main">
        {topbar}
        <main className="page">{children}</main>
      </section>
    </div>
  )
}
