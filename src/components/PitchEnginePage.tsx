import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const PITCH_STAGES = ['discovery', 'proposal', 'presentation', 'negotiation', 'closed_won', 'closed_lost'] as const
const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery', proposal: 'Proposal Draft', presentation: 'Presentation',
  negotiation: 'Negotiation', closed_won: '✅ Closed Won', closed_lost: '❌ Closed Lost',
}
const STAGE_COLORS: Record<string, string> = {
  discovery: 'var(--text-muted)', proposal: 'var(--brand-500)', presentation: 'var(--accent-500)',
  negotiation: 'var(--warning-500)', closed_won: 'var(--success-500)', closed_lost: 'var(--danger-500)',
}

export default function PitchEnginePage() {
  const store = useAppStore()
  const pitchDeals = store.pitchDeals || []
  const clients = store.clients
  const addPitchDeal = store.addPitchDeal
  const updatePitchDeal = store.updatePitchDeal
  const getClient = (id: string) => clients.find(c => c.id === id)

  const [stageFilter, setStageFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', estimatedMRR: 0, notes: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ clientId: '', name: '', stage: 'discovery', value: 0, notes: '' })

  const filtered = useMemo(() => {
    let items = [...pitchDeals]
    if (stageFilter !== 'all') items = items.filter(d => d.stage === stageFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(d => d.name.toLowerCase().includes(q) || (getClient(d.clientId)?.name || '').toLowerCase().includes(q))
    }
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return items
  }, [pitchDeals, stageFilter, search])

  const stageTotals = useMemo(() => {
    const c: Record<string, { count: number; value: number }> = {}
    for (const d of pitchDeals) {
      if (!c[d.stage]) c[d.stage] = { count: 0, value: 0 }
      c[d.stage].count++
      c[d.stage].value += d.estimatedMRR
    }
    return c
  }, [pitchDeals])

  const totalPipeline = useMemo(() => pitchDeals.filter(d => d.stage !== 'closed_lost' && d.stage !== 'closed_won').reduce((s, d) => s + d.estimatedMRR, 0), [pitchDeals])
  const totalWon = useMemo(() => pitchDeals.filter(d => d.stage === 'closed_won').reduce((s, d) => s + d.estimatedMRR, 0), [pitchDeals])

  const handleAdd = () => {
    if (!form.clientId || !form.name) return
    addPitchDeal({
      clientId: form.clientId,
      name: form.name,
      stage: form.stage as any,
      value: form.estimatedMRR || 0,
      notes: form.notes || '',
      date: new Date().toISOString(),
    })
    setForm({ clientId: '', name: '', stage: 'discovery', value: 0, notes: '' })
    setShowAdd(false)
  }



  const handleStartEdit = (deal) => {
    setEditingId(deal.id)
    setEditForm({ name: deal.name, estimatedMRR: deal.estimatedMRR || 0, notes: deal.notes || "" })
  }

  const handleSaveEdit = (id) => {
    updatePitchDeal(id, { name: editForm.name, estimatedMRR: editForm.estimatedMRR, notes: editForm.notes })
    setEditingId(null)
  }

  const handleStageClick = (id: string, current: string) => {
    const idx = PITCH_STAGES.indexOf(current as any)
    if (idx < PITCH_STAGES.length - 1) updatePitchDeal(id, { stage: PITCH_STAGES[idx + 1] })
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Pitch Engine</h2>
          <p className="section-desc">Track discovery calls, proposals, presentations, and closed deals through the full sales cycle.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)} style={{ whiteSpace: 'nowrap' }}>
          {showAdd ? '✕ Cancel' : '+ New Pitch'}
        </button>
      </div>

      {/* ── Revenue / Pipeline Overview ── */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: 14, flex: '1 1 200px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active Pipeline</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-500)' }}>${(totalPipeline || 0).toLocaleString()}</div>
        </div>
        <div className="card" style={{ padding: 14, flex: '1 1 200px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Closed Won (total)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--success-500)' }}>${(totalWon || 0).toLocaleString()}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pitchDeals.filter(d => d.stage === 'closed_won').length} deals</div>
        </div>
        <div className="card" style={{ padding: 14, flex: '1 1 200px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Deals</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{pitchDeals.length}</div>
        </div>
        <div className="card" style={{ padding: 14, flex: '1 1 200px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Win Rate</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>
            {pitchDeals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost').length > 0
              ? Math.round(pitchDeals.filter(d => d.stage === 'closed_won').length / pitchDeals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost').length * 100) + '%'
              : '—'}
          </div>
        </div>
      </div>

      {/* ── Pipeline Funnel ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 16 }}>
        {PITCH_STAGES.map(s => {
          const st = stageTotals[s]
          return (
            <div key={s} className="card" style={{ textAlign: 'center', padding: 10, borderTop: `3px solid ${STAGE_COLORS[s]}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: STAGE_COLORS[s] }}>{st?.count || 0}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{STAGE_LABELS[s]}</div>
              {st?.estimatedMRR ? <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>${(st.estimatedMRR || 0).toLocaleString()}</div> : null}
            </div>
          )
        })}
      </div>

      {/* ── Add Form ── */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <select value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))} style={inputStyle}>
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Pitch name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))} style={{ ...inputStyle, flex: 1 }}>
                {PITCH_STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
              </select>
              <input type="number" placeholder="Value $" value={form.value || ''} onChange={e => setForm(p => ({ ...p, value: Number(e.target.value) }))} style={{ ...inputStyle, width: 100 }} />
            </div>
          </div>
          <input placeholder="Notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, marginTop: 10, width: '100%' }} />
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={handleAdd} disabled={!form.clientId || !form.name}>Add Pitch</button>
        </div>
      )}

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} style={{ ...inputStyle, width: 140 }}>
          <option value="all">All Stages</option>
          {PITCH_STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
        </select>
        <input placeholder="Search pitch or client…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 220, marginLeft: 'auto' }} />
      </div>

      {/* ── Deal Cards ── */}
      {filtered.map(deal => {
        const client = getClient(deal.clientId)
        const stageIdx = PITCH_STAGES.indexOf(deal.stage as any)
        if (editingId === deal.id) {
          return (
            <div key={deal.id} className="card" style={{ padding: 14, marginBottom: 10, borderLeft: `4px solid ${STAGE_COLORS[deal.stage]}` }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Pitch name" style={{ flex: 1, minWidth: 150, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)' }} />
                <input type="number" value={editForm.estimatedMRR || ''} onChange={e => setEditForm(p => ({ ...p, estimatedMRR: Number(e.target.value) }))}
                  placeholder="Value $" style={{ width: 120, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)' }} />
              </div>
              <textarea value={editForm.notes} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Notes" rows={3} style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', resize: 'vertical', fontSize: 12 }} />
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button className="btn btn-primary" style={{ padding: '4px 14px', fontSize: 11 }} onClick={() => handleSaveEdit(deal.id)}>Save</button>
                <button className="btn" style={{ padding: '4px 14px', fontSize: 11 }} onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          )
        }
        return (
          <div key={deal.id} className="card" style={{ marginBottom: 10, borderLeft: `4px solid ${STAGE_COLORS[deal.stage]}`, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{deal.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{client?.name} · ${(deal.estimatedMRR || 0).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 100 }}>
                <span className="tag" style={{ background: `${STAGE_COLORS[deal.stage]}20`, color: STAGE_COLORS[deal.stage], fontSize: 10 }}>
                  {STAGE_LABELS[deal.stage]}
                </span>
              </div>
            </div>
            {deal.notes && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>{deal.notes}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📅 {new Date(deal.date).toLocaleDateString()}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {stageIdx < PITCH_STAGES.length - 1 && (
                  <button className="btn" style={{ padding: '2px 10px', fontSize: 11 }} onClick={() => handleStageClick(deal.id, deal.stage)}>
                    → {STAGE_LABELS[PITCH_STAGES[stageIdx + 1]]}
                  </button>
                )}
                {deal.stage === 'closed_won' || deal.stage === 'closed_lost' ? (
                  <button className="btn" style={{ padding: '2px 10px', fontSize: 11 }} onClick={() => updatePitchDeal(deal.id, { stage: 'discovery' })}>
                    ↻ Reopen
                  </button>
                ) : null}
                <button className="btn" style={{ padding: '2px 10px', fontSize: 11 }} onClick={() => handleStartEdit(deal)}>
                  ✏️ Edit
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
          No deals found. {pitchDeals.length === 0 ? 'Start tracking pitches above.' : 'Try different filters.'}
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12,
}
