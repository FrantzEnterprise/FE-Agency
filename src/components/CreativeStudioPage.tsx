import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const STATUS_FLOW = ['brief', 'in_progress', 'qa', 'client_review', 'approved', 'revisions', 'delivered']
const STATUS_MAP: Record<string, string> = {
  brief: 'Brief', in_progress: 'In Progress', qa: 'QA', client_review: 'Client Review',
  approved: 'Approved', revisions: 'Revisions', delivered: 'Delivered',
}
const STATUS_COLOR: Record<string, string> = {
  brief: 'var(--text-muted)', in_progress: 'var(--brand-500)', qa: 'var(--warning-500)',
  client_review: 'var(--accent-500)', approved: 'var(--success-500)',
  revisions: 'var(--danger-500)', delivered: 'var(--success-500)',
}
const TYPE_OPTIONS = ['graphic', 'video', 'copy', 'web', 'social', 'print', 'branding']

export default function CreativeStudioPage() {
  const { clients, creativeAssets, projects, addCreativeAsset, updateCreativeAsset } = useAppStore()
  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || id
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || '—'

  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [kanban, setKanban] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ clientId: '', projectId: '', name: '', description: '', type: 'graphic', status: 'brief' as string, assignee: '', dueDate: '' })

  const filtered = useMemo(() => {
    let items = [...creativeAssets]
    if (typeFilter !== 'all') items = items.filter(a => a.type === typeFilter)
    if (statusFilter !== 'all') items = items.filter(a => a.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
    }
    items.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    return items
  }, [creativeAssets, typeFilter, statusFilter, search])

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const a of creativeAssets) c[a.status] = (c[a.status] || 0) + 1
    return c
  }, [creativeAssets])

  const handleAdd = () => {
    if (!form.clientId || !form.name) return
    addCreativeAsset({
      clientId: form.clientId,
      projectId: form.projectId || undefined,
      name: form.name,
      description: form.description || '',
      type: form.type as any,
      status: form.status as any,
      version: 1,
      assignee: form.assignee || 'Unassigned',
      dueDate: form.dueDate || new Date(Date.now() + 14 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    })
    setForm({ clientId: '', projectId: '', name: '', description: '', type: 'graphic', status: 'brief', assignee: '', dueDate: '' })
    setShowAdd(false)
  }

  const handleAdvance = (id: string, currentStatus: string) => {
    const idx = STATUS_FLOW.indexOf(currentStatus)
    if (idx < STATUS_FLOW.length - 1) updateCreativeAsset(id, { status: STATUS_FLOW[idx + 1] as any })
  }

  const cardContent = (items: typeof filtered) => items.map(asset => (
    <div key={asset.id} className="card" style={{ marginBottom: 10, borderLeft: `4px solid ${STATUS_COLOR[asset.status]}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{asset.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{asset.description}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{getClientName(asset.clientId)} · {getProjectName(asset.projectId || '')}</div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 70 }}>
          <span className="tag" style={{ background: `${STATUS_COLOR[asset.status]}20`, color: STATUS_COLOR[asset.status], fontSize: 10 }}>
            {STATUS_MAP[asset.status]}
          </span>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{asset.assignee} · v{asset.version}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
          <span>📅 Due: {new Date(asset.dueDate).toLocaleDateString()}</span>
          <span>✨ {new Date(asset.createdAt).toLocaleDateString()}</span>
          <span>📁 {asset.type}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUS_FLOW.indexOf(asset.status) < STATUS_FLOW.length - 1 && (
            <button className="btn" style={{ padding: '2px 10px', fontSize: 11 }} onClick={() => handleAdvance(asset.id, asset.status)}>
              → {STATUS_MAP[STATUS_FLOW[STATUS_FLOW.indexOf(asset.status) + 1]]}
            </button>
          )}
          {['approved', 'revisions', 'delivered'].includes(asset.status) && (
            <button className="btn" style={{ padding: '2px 10px', fontSize: 11 }} onClick={() => updateCreativeAsset(asset.id, { status: 'brief' })}>
              ↻ Reset
            </button>
          )}
        </div>
      </div>
    </div>
  ))

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Creative Delivery Studio</h2>
          <p className="section-desc">Track creative assets through production: brief → production → QA → client review → delivery.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => setKanban(!kanban)} style={{ whiteSpace: 'nowrap' }}>
            {kanban ? '📋 List View' : '📊 Kanban'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)} style={{ whiteSpace: 'nowrap' }}>
            {showAdd ? '✕ Cancel' : '+ New Asset'}
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 14 }}>
        {STATUS_FLOW.map(s => (
          <div key={s} className="card" style={{ textAlign: 'center', padding: 10, borderTop: `3px solid ${STATUS_COLOR[s]}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: STATUS_COLOR[s] }}>{statusCounts[s] || 0}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{STATUS_MAP[s]}</div>
          </div>
        ))}
      </div>

      {/* ── Add Form ── */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <select value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))} style={inputStyle}>
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={form.projectId} onChange={e => setForm(p => ({ ...p, projectId: e.target.value }))} style={inputStyle}>
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <input placeholder="Asset name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            <input placeholder="Assignee" value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} style={inputStyle} />
            <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} style={inputStyle} />
          </div>
          <input placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, marginTop: 10, width: '100%' }} />
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={handleAdd} disabled={!form.clientId || !form.name}>
            Create Asset
          </button>
        </div>
      )}

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ ...inputStyle, width: 120 }}>
          <option value="all">All Types</option>
          {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 130 }}>
          <option value="all">All Status</option>
          {STATUS_FLOW.map(s => <option key={s} value={s}>{STATUS_MAP[s]}</option>)}
        </select>
        <input placeholder="Search by name / description…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 220, marginLeft: 'auto' }} />
      </div>

      {/* ── Content ── */}
      {kanban ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {STATUS_FLOW.map(s => (
            <div key={s} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 8, minHeight: 200 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[s], marginBottom: 8, textAlign: 'center' }}>{STATUS_MAP[s]}</div>
              {filtered.filter(a => a.status === s).map(asset => (
                <div key={asset.id} className="card" style={{ padding: 8, marginBottom: 6, cursor: 'pointer', fontSize: 11 }}
                  onClick={() => handleAdvance(asset.id, asset.status)}>
                  <div style={{ fontWeight: 600 }}>{asset.name}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{getClientName(asset.clientId)}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{asset.assignee}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
            No assets found. {creativeAssets.length === 0 ? 'Create your first asset above.' : 'Adjust filters to see more.'}
          </div>
        ) : cardContent(filtered)
      )}

      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        {filtered.length} of {creativeAssets.length} assets shown
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12,
}
