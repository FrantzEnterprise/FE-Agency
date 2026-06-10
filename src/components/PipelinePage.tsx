import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Plus, Search, Edit3, X, TrendingUp } from 'lucide-react'
import type { PipelineDeal } from '../types'

const initialForm = (): Omit<PipelineDeal, 'id'> => ({
  company: '', contact: '', tier: 'Foundation', estimatedMRR: 0,
  stage: 'discovery', stageOrder: 1, probability: 20,
})

const stageLabels: Record<string, string> = {
  discovery: 'Discovery Call', proposal: 'Proposal Sent', negotiation: 'Negotiation',
  closed_won: 'Closed Won', closed_lost: 'Closed Lost',
}

export default function PipelinePage() {
  const store = useAppStore()
  const pipeline = store.pipeline || []
  const addPipelineDeal = store.addPipelineDeal
  const updatePipelineDeal = store.updatePipelineDeal
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm())

  const filtered = pipeline.filter(d =>
    d.company.toLowerCase().includes(search.toLowerCase()) ||
    d.contact.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => { setEditId(null); setForm(initialForm()); setModalOpen(true) }
  const openEdit = (d: PipelineDeal) => { setEditId(d.id); setForm({ company: d.company, contact: d.contact, tier: d.tier, estimatedMRR: d.estimatedMRR, stage: d.stage, stageOrder: d.stageOrder, probability: d.probability }); setModalOpen(true) }
  const save = () => {
    if (editId) updatePipelineDeal(editId, form)
    else addPipelineDeal(form)
    setModalOpen(false)
  }

  const totalPipeline = pipeline.reduce((s, d) => s + d.estimatedMRR, 0)
  const inNegotiation = pipeline.filter(d => d.stage === 'negotiation').reduce((s, d) => s + d.estimatedMRR, 0)
  const weightedPipeline = pipeline.reduce((s, d) => s + Math.round(d.estimatedMRR * d.probability / 100), 0)

  const stageOrder = { discovery: 1, proposal: 2, negotiation: 3, closed_won: 4, closed_lost: 5 }
  const sorted = [...filtered].sort((a, b) => (stageOrder[a.stage as keyof typeof stageOrder] || 0) - (stageOrder[b.stage as keyof typeof stageOrder] || 0))

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Sales Pipeline</h2>
          <p className="section-desc">{pipeline.length} deals · ${totalPipeline.toLocaleString()} total</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Deal</button>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-label">Total Pipeline</div><div className="stat-value">${totalPipeline.toLocaleString()}</div></div>
        <div className="stat-card"><div className="stat-label">Weighted Pipeline</div><div className="stat-value">${weightedPipeline.toLocaleString()}</div></div>
        <div className="stat-card"><div className="stat-label">In Negotiation</div><div className="stat-value">${inNegotiation.toLocaleString()}</div></div>
        <div className="stat-card"><div className="stat-label">Deals</div><div className="stat-value">{pipeline.length}</div></div>
      </div>

      {/* Pipeline stages visualization */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Pipeline Funnel</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          {['discovery', 'proposal', 'negotiation'].map(stage => {
            const deals = pipeline.filter(d => d.stage === stage)
            const value = deals.reduce((s, d) => s + d.estimatedMRR, 0)
            return (
              <div key={stage} style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>{stageLabels[stage]}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{deals.length}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>${value.toLocaleString()}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Company</th><th>Contact</th><th>Tier</th><th>MRR</th><th>Stage</th><th>Probability</th><th>Weighted</th><th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={8}><div className="empty-state"><TrendingUp size={32} /><p>No deals in pipeline</p></div></td></tr>
            ) : sorted.map(d => (
              <tr key={d.id}>
                <td><span style={{ fontWeight: 600 }}>{d.company}</span></td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{d.contact}</td>
                <td><span className={`badge ${d.tier === 'Scale' ? 'badge-purple' : d.tier === 'Growth' ? 'badge-blue' : 'badge-gray'}`}>{d.tier}</span></td>
                <td><span style={{ fontWeight: 700 }}>${(d.estimatedMRR || 0).toLocaleString()}</span></td>
                <td><span className={`badge ${d.stage === 'negotiation' ? 'badge-green' : d.stage === 'proposal' ? 'badge-blue' : 'badge-gray'}`}>{stageLabels[d.stage]}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ width: 80 }}><div className="progress-fill" style={{ width: `${d.probability}%`, background: d.probability > 60 ? 'var(--success)' : d.probability > 35 ? 'var(--warning)' : 'var(--info)' }} /></div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{d.probability}%</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>${Math.round((d.estimatedMRR || 0) * (d.probability || 0) / 100).toLocaleString()}</td>
                <td><button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(d)}><Edit3 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Deal' : 'New Deal'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Contact</label><input className="form-input" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tier</label>
                    <select className="form-select" value={form.tier} onChange={e => setForm({...form, tier: e.target.value as any, estimatedMRR: e.target.value === 'Scale' ? 8000 : e.target.value === 'Growth' ? 5000 : 2500})}>
                      <option value="Foundation">Foundation ($2.5K)</option>
                      <option value="Growth">Growth ($5K)</option>
                      <option value="Scale">Scale ($8K)</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Est. MRR ($)</label><input className="form-input" type="number" value={form.estimatedMRR} onChange={e => setForm({...form, estimatedMRR: Number(e.target.value)})} /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Stage</label>
                    <select className="form-select" value={form.stage} onChange={e => setForm({...form, stage: e.target.value as any, stageOrder: {discovery:1, proposal:2, negotiation:3, closed_won:4, closed_lost:5}[e.target.value] || 1})}>
                      <option value="discovery">Discovery Call</option>
                      <option value="proposal">Proposal Sent</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed_won">Closed Won</option>
                      <option value="closed_lost">Closed Lost</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Probability (%)</label><input className="form-input" type="number" min="0" max="100" value={form.probability} onChange={e => setForm({...form, probability: Number(e.target.value)})} /></div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editId ? 'Save Changes' : 'Add Deal'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
