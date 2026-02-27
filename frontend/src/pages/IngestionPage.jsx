import { useEffect, useState } from 'react'
import api from '../services/api'

export default function IngestionPage({ onRefresh }) {
  const [logs, setLogs] = useState('[{"event":"Failed login from 10.10.1.5"}]')
  const [status, setStatus] = useState('')
  const [scheduler, setScheduler] = useState({ enabled: false, interval_seconds: 60, last_run: null })

  const loadScheduler = async () => {
    try {
      const res = await api.get('/api/ingest/scheduler/status')
      setScheduler(res.data)
    } catch {
      setStatus('Unable to fetch scheduler status')
    }
  }

  useEffect(() => {
    loadScheduler()
  }, [])

  const submit = async () => {
    try {
      await api.post('/api/ingest/manual', { source: 'manual', logs: JSON.parse(logs) })
      setStatus('Manual ingestion completed')
      onRefresh()
    } catch {
      setStatus('Failed to ingest logs: ensure valid JSON and authentication')
    }
  }

  const ingestDataset = async () => {
    try {
      await api.post('/api/ingest/dataset/start')
      setStatus('Dataset ingestion completed')
      onRefresh()
    } catch {
      setStatus('Dataset ingestion failed')
    }
  }

  const toggleScheduler = async (enabled) => {
    try {
      const res = await api.post(`/api/ingest/scheduler/toggle?enabled=${enabled}&interval_seconds=${scheduler.interval_seconds}`)
      setScheduler(res.data)
      setStatus(`Automatic ingestion ${enabled ? 'enabled' : 'disabled'}`)
    } catch {
      setStatus('Scheduler toggle failed (manager role required)')
    }
  }

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 6' }}>
        <h3>Manual Ingestion</h3>
        <textarea className="input" rows="8" value={logs} onChange={(e) => setLogs(e.target.value)} />
        <button className="btn" onClick={submit}>Ingest Logs</button>
      </div>

      <div className="card" style={{ gridColumn: 'span 6' }}>
        <h3>Automatic / API Ingestion</h3>
        <p className="muted">Scheduler: <strong>{scheduler.enabled ? 'Enabled' : 'Disabled'}</strong></p>
        <p className="muted">Interval: {scheduler.interval_seconds}s</p>
        <p className="muted">Last run: {scheduler.last_run ? new Date(scheduler.last_run).toLocaleString() : 'Never'}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={ingestDataset}>Run Dataset Now</button>
          <button className="btn ghost" onClick={() => toggleScheduler(true)}>Enable Auto</button>
          <button className="btn ghost" onClick={() => toggleScheduler(false)}>Disable Auto</button>
          <button className="btn ghost" onClick={loadScheduler}>Refresh Status</button>
        </div>
      </div>

      <div className="card" style={{ gridColumn: 'span 12' }}>
        <p className="muted">{status}</p>
      </div>
    </div>
  )
}
