import { useEffect, useMemo, useState } from 'react'
import Layout from './components/Layout'
import Topbar from './components/Topbar'
import IncidentDrawer from './components/IncidentDrawer'
import DashboardPage from './pages/DashboardPage'
import IncidentsPage from './pages/IncidentsPage'
import CasesPage from './pages/CasesPage'
import AuditPage from './pages/AuditPage'
import AgentsPage from './pages/AgentsPage'
import IntelPage from './pages/IntelPage'
import MITREPage from './pages/MITREPage'
import SIEMPage from './pages/SIEMPage'
import IngestionPage from './pages/IngestionPage'
import api from './services/api'
import { useAuth } from './context/AuthContext'

const tabs = ['Dashboard', 'Incidents', 'Cases', 'Intel', 'MITRE', 'Agents', 'SIEM', 'Audit', 'Ingestion']

function LoginForm() {
  const { login } = useAuth()
  const [username, setUsername] = useState('analyst')
  const [password, setPassword] = useState('analyst123')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(username, password)
    } catch {
      setError('Login failed. Try analyst/analyst123, manager/manager123, or admin/admin123')
    }
  }

  return <div className="login-wrap"><form className="card login-card" onSubmit={submit}><h3>Secure Access</h3><input className="input" value={username} onChange={(e) => setUsername(e.target.value)} /><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="btn" type="submit">Login</button><p className="muted">{error}</p></form></div>
}

export default function App() {
  const { user, loading, logout } = useAuth()
  const [tab, setTab] = useState('Dashboard')
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [state, setState] = useState({ metrics: {}, incidents: [], cases: [], sla: [], audit: [], agents: [], siem: {} })

  const refresh = async () => {
    const calls = await Promise.allSettled([
      api.get('/api/dashboard/metrics'),
      api.get('/api/incidents'),
      api.get('/api/cases'),
      api.get('/api/sla/status'),
      api.get('/api/audit'),
      api.get('/api/agents/activity'),
      api.get('/api/siem/status')
    ])
    setState({
      metrics: calls[0].value?.data || {},
      incidents: calls[1].value?.data || [],
      cases: calls[2].value?.data || [],
      sla: calls[3].value?.data || [],
      audit: calls[4].value?.data || [],
      agents: calls[5].value?.data || [],
      siem: calls[6].value?.data || {}
    })
  }

  useEffect(() => { if (user) refresh() }, [user])

  useEffect(() => {
    if (!user) return
    const ws = new WebSocket((import.meta.env.VITE_WS_URL || 'ws://localhost:8000') + '/ws/live')
    ws.onopen = () => ws.send('subscribe')
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data)
      if (payload.incidents) {
        setState((prev) => ({ ...prev, incidents: [...payload.incidents, ...prev.incidents] }))
      }
    }
    return () => ws.close()
  }, [user])

  const page = useMemo(() => {
    if (tab === 'Dashboard') return <DashboardPage state={state} selectedIncident={selectedIncident} onSelectIncident={setSelectedIncident} onRefresh={refresh} />
    if (tab === 'Incidents') return <IncidentsPage incidents={state.incidents} onSelect={setSelectedIncident} onRefresh={refresh} />
    if (tab === 'Cases') return <CasesPage cases={state.cases} sla={state.sla} incidents={state.incidents} onRefresh={refresh} />
    if (tab === 'Intel') return <IntelPage incidents={state.incidents} />
    if (tab === 'MITRE') return <MITREPage incidents={state.incidents} selectedIncident={selectedIncident} />
    if (tab === 'Agents') return <AgentsPage agents={state.agents} />
    if (tab === 'SIEM') return <SIEMPage siem={state.siem} />
    if (tab === 'Audit') return <AuditPage audit={state.audit} agents={state.agents} />
    return <IngestionPage onRefresh={refresh} />
  }, [tab, state, selectedIncident])

  if (loading) return <div className="login-wrap">Loading...</div>
  if (!user) return <LoginForm />

  return (
    <>
      <Layout
        nav={<><div className="brand">NEXUS // SOC</div>{tabs.map((item) => <button key={item} className={`nav-btn ${tab === item ? 'active' : ''}`} onClick={() => setTab(item)}>{item}</button>)}<button className="btn ghost" onClick={logout}>Logout</button></>}
        topbar={<Topbar user={user} onRefresh={refresh} />}
      >
        {page}
      </Layout>
      <IncidentDrawer incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
    </>
  )
}
