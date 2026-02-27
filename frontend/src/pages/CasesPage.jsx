import { useState } from 'react'
import api from '../services/api'
import CasePanel from '../components/CasePanel'
import SLATracker from '../components/SLATracker'

export default function CasesPage({ cases, sla, incidents = [], onRefresh }) {
  const [selectedIncidentId, setSelectedIncidentId] = useState('')
  const [noteCaseId, setNoteCaseId] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')

  const createCase = async () => {
    if (!selectedIncidentId) return setStatus('Select an incident first')
    try {
      await api.post(`/api/cases?incident_id=${selectedIncidentId}`)
      setStatus('Case created successfully')
      onRefresh?.()
    } catch {
      setStatus('Case creation failed')
    }
  }

  const addNote = async () => {
    if (!noteCaseId || !note) return setStatus('Provide case ID and note')
    try {
      await api.put(`/api/cases/${noteCaseId}?note=${encodeURIComponent(note)}`)
      setStatus('Case note added')
      setNote('')
      onRefresh?.()
    } catch {
      setStatus('Case note update failed')
    }
  }

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 6' }}>
        <h3>Case Operations</h3>
        <select className="input" value={selectedIncidentId} onChange={(e) => setSelectedIncidentId(e.target.value)}>
          <option value="">Select incident for case creation</option>
          {incidents.map((i) => <option key={i.id} value={i.id}>{i.title} ({i.risk_level})</option>)}
        </select>
        <button className="btn" onClick={createCase}>Create Case</button>

        <input className="input" placeholder="Case ID" value={noteCaseId} onChange={(e) => setNoteCaseId(e.target.value)} />
        <textarea className="input" rows="3" placeholder="Case note" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="btn ghost" onClick={addNote}>Add Note</button>
        <p className="muted">{status}</p>
      </div>

      <CasePanel cases={cases} />
      <SLATracker data={sla} />
    </div>
  )
}
