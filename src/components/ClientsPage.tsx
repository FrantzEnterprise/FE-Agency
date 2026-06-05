import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Plus, Search, Edit3, Trash2, X } from 'lucide-react'
import type { Client } from '../types'

const initialForm = (): Omit<Client, 'id'> => ({
  name: '', industry: '', retainerTier: 'Foundation', mrr: 0,
  status: 'onboarding', health: 'green', since: new Date().toISOString().slice(0,10),
  lastQBR: '', nextRenewal: '',
})

const healthLabel: Record<string, string> = { green: 'Healthy', yellow: 'Warning', red: 'Critical' }
const statusLabel: Record<string, string> = { active: 'Active', onboarding: 'Onboarding', at_risk: 'At Risk', churned: 'Churned' }

export default function ClientsPage() {
  const { clients, addClient, updateClient } = useAppStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm())

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => { setEditId(null); setForm(initialForm()); setModalOpen(true) }
  const openEdit = (c: Client) => { setEditId(c.id); setForm({ name: c.name, industry: c.industry, retainerTier: c.retainerTier, mrr: c.mrr, status: c.status, health: c.health, since: c.since, lastQBR: c.lastQBR, nextRenewal: c.nextRenewal }); setModalOpen(true) }
  const save = () => {
    if (editId) updateClient(editId, form)
    else addClient(form)
    setModalOpen(false)
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Clients</h2>
          <p className="section-desc">{clients.length} active accounts · Plan → Run → Report</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Client</button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} clients</span>
        </div>
        <table>
          <thead>
            <tr>
              <th onClick={() => {}}>Client <span style={{ opacity: 0.4 }}>↕</span></th>
              <th>Industry</th>
              <th>Tier</th>
              <th>MRR</th>
              <th>Health</th>
              <th>Status</th>
              <th>Renewal</th>
              <th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8}><div className="empty-state"><Search size={32} /><p>No clients found</p></div></td></tr>
            ) : filtered.map(c => (
              <tr key={c.id}>
                <td><span style={{ fontWeight: 600 }}>{c.name}</span></td>
                <td><span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{c.industry}</span></td>
                <td><span className={`badge ${c.retainerTier === 'Scale' ? 'badge-purple' : c.retainerTier === 'Growth' ? 'badge-blue' : 'badge-gray'}`}>{c.retainerTier}</span></td>
                <td><span style={{ fontWeight: 700 }}>${c.mrr.toLocaleString()}</span></td>
                <td><span className={`badge badge-${c.health}`}><span className={`status-dot ${c.health}`} />{healthLabel[c.health]}</span></td>
                <td><span className={`badge ${c.status === 'active' ? 'badge-green' : c.status === 'onboarding' ? 'badge-blue' : c.status === 'at_risk' ? 'badge-red' : 'badge-gray'}`}>{statusLabel[c.status]}</span></td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.nextRenewal}</td>
                <td>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(c)}><Edit3 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Client' : 'New Client'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Summit Roofing Co" />
                </div>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input className="form-input" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} placeholder="e.g. Home Services" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Retainer Tier</label>
                    <select className="form-select" value={form.retainerTier} onChange={e => setForm({...form, retainerTier: e.target.value as any})}>
                      <option value="Foundation">Foundation</option>
                      <option value="Growth">Growth</option>
                      <option value="Scale">Scale</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Retainer ($)</label>
                    <input className="form-input" type="number" value={form.mrr} onChange={e => setForm({...form, mrr: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Health</label>
                    <select className="form-select" value={form.health} onChange={e => setForm({...form, health: e.target.value as any})}>
                      <option value="green">Green — Healthy</option>
                      <option value="yellow">Yellow — Warning</option>
                      <option value="red">Red — Critical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                      <option value="active">Active</option>
                      <option value="onboarding">Onboarding</option>
                      <option value="at_risk">At Risk</option>
                      <option value="churned">Churned</option>
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Since</label>
                    <input className="form-input" type="date" value={form.since} onChange={e => setForm({...form, since: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Next Renewal</label>
                    <input className="form-input" type="date" value={form.nextRenewal} onChange={e => setForm({...form, nextRenewal: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editId ? 'Save Changes' : 'Add Client'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
