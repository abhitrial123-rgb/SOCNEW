import { useState } from 'react'
import api from '../services/api'

export default function IngestionPage({ onRefresh }) {
  const [logs, setLogs] = useState('[{"event":"Failed login from 10.10.1.5"}]')
  const [status, setStatus] = useState('')

  const submit = async () => {
    try {
      await api.post('/api/ingest/manual', { source: 'manual', logs: JSON.parse(logs) })
      setStatus('Manual ingestion completed')
      onRefresh()
    } catch {
      setStatus('Failed to ingest logs: ensure valid JSON and authentication')
    }
  }

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 8' }}>
        <h3>Manual Ingestion</h3>
        <textarea className="input" rows="8" value={logs} onChange={(e) => setLogs(e.target.value)} />
        <button className="btn" onClick={submit}>Ingest Logs</button>
        <p className="muted">{status}</p>
      </div>
    </div>
  )
}
