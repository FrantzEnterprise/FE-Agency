import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const QBR_SECTIONS = [
  { id: 'results', label: 'Results vs Objectives', desc: 'Compare actual KPIs against the objectives set last quarter. Show progress, regression, and variances.' },
  { id: 'deliverables', label: 'Delivered vs Committed', desc: 'What was committed in the SOW vs what was actually delivered. Flag any gaps and explain.' },
  { id: 'channels', label: 'Channel Performance', desc: 'Breakdown by channel: paid, organic, email, social, content. Covers spend, ROI, growth trends.' },
  { id: 'health', label: 'Account Health Review', desc: 'Current health score trended over the quarter. Renewal posture: strong, neutral, or at risk.' },
  { id: 'opportunity', label: 'Upsell Opportunities', desc: 'Identify chances to grow: new channels, higher tier, additional services, or expanded scope.' },
  { id: 'plan', label: 'Next Quarter Plan', desc: 'Strategic priorities for the next 90 days. Goals, proposed changes, and expected outcomes.' },
]

const QBR_STATUS: Record<string, { draft: string[]; final: string[] }> = {
  draft: { draft: ['Pre-fill KPI data', 'Pre-fill deliverable log', 'Draft executive summary'], final: [] },
  review: { draft: [], final: ['Internal team review', 'QA numbers and claims', 'Add QBR date/time to calendar'] },
  client: { draft: [], final: ['Send to client 72h in advance', 'Schedule QBR presentation call', 'Collect post-QBR feedback'] },
  closed: { draft: [], final: ['Update health score', 'File QBR notes', 'Update next quarter SOW if scope changed', 'Log upsell opportunity if identified'] },
}

export default function QbrPage() {
  const { clients, weeklyNotes, addWeeklyNote } = useAppStore()
  const [selectedClient, setSelectedClient] = useState('')
  const [phase, setPhase] = useState<'draft' | 'review' | 'client' | 'closed'>('draft')
  const [notes, setNotes] = useState('')

  const client = clients.find(c => c.id === selectedClient)
  const clientNotes = weeklyNotes.filter(n => n.author === selectedClient)

  const handleAddNote = () => {
    if (!notes.trim() || !selectedClient) return
    addWeeklyNote({
      week: new Date().toISOString().slice(0, 7),
      content: notes,
      author: selectedClient,
    })
    setNotes('')
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Quarterly Business Review Templates</h2>
          <p className="section-desc">QBR format: results-vs-objectives, renewal posture, and upsell opportunities.</p>
        </div>
      </div>

      <div className="card">
        <div className="form-field" style={{ maxWidth: 400, marginBottom: 14 }}>
          <label>Client</label>
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
            <option value="">— Select client —</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} · Last QBR: {c.lastQBR} · Renewal: {c.nextRenewal}</option>
            ))}
          </select>
        </div>

        {client && (
          <div style={{ display: 'flex', gap: 10 }}>
            {(['draft', 'review', 'client', 'closed'] as const).map(p => (
              <button key={p} className={`btn btn-sm ${phase === p ? 'btn-primary' : ''}`} onClick={() => setPhase(p)}>
                {p === 'draft' ? 'Draft' : p === 'review' ? 'Internal Review' : p === 'client' ? 'Client Review' : 'Closed'}
              </button>
            ))}
          </div>
        )}
      </div>

      {client && (
        <>
          {/* Client context */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            <div className="card" style={{ textAlign: 'center', padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Tier</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-500)' }}>{client.retainerTier}</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>MRR</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--brand-500)' }}>${client.mrr.toLocaleString()}</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Health</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: client.health === 'green' ? 'var(--success-500)' : client.health === 'yellow' ? 'var(--warning-500)' : 'var(--danger-500)' }}>
                {client.health.toUpperCase()}
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Industry</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{client.industry}</div>
            </div>
          </div>

          {/* QBR sections */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Quarterly Review — Sections</h3>
            {QBR_SECTIONS.map(section => (
              <details key={section.id} style={{ marginBottom: 8 }}>
                <summary style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '6px 0', color: 'var(--text-primary)' }}>
                  {section.label}
                </summary>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '6px 0 0 16px' }}>{section.desc}</p>
              </details>
            ))}
          </div>

          {/* Phase checklist */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{phase === 'draft' ? 'Draft' : phase === 'review' ? 'Internal Review' : phase === 'client' ? 'Client Review' : 'Close'} Checklist</h3>
            {QBR_STATUS[phase]?.draft.map(item => (
              <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--brand-500)' }} /> {item}
              </label>
            ))}
            {QBR_STATUS[phase]?.final.map(item => (
              <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--brand-500)' }} /> {item}
              </label>
            ))}
          </div>

          {/* Notes */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>QBR Notes</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <textarea
                className="form-textarea"
                style={{ flex: 1, minHeight: 60 }}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add a note for this QBR..."
              />
              <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={handleAddNote}>Add Note</button>
            </div>
            {clientNotes.length > 0 && (
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {clientNotes.slice().reverse().map(n => (
                  <div key={n.id} style={{ fontSize: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{n.week} — {n.author}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{n.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
