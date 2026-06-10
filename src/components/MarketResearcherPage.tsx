import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

type SortField = 'date' | 'relevance'
const TYPE_TAGS = ['all', 'industry', 'competitor', 'keyword', 'trend', 'benchmark'] as const
const RELEVANCE_ORDER = { high: 3, medium: 2, low: 1 }

export default function MarketResearcherPage() {
  const { marketIntel, clients, addMarketIntel, updateMarketIntel } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [clientFilter, setClientFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ clientId: '', type: 'industry' as string, title: '', summary: '', source: '', relevance: 'medium' as string })

  const filtered = useMemo(() => {
    let items = [...marketIntel]

    if (typeFilter !== 'all') items = items.filter(i => i.type === typeFilter)
    if (clientFilter !== 'all') items = items.filter(i => i.clientId === clientFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q))
    }
    if (sortBy === 'date') items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (sortBy === 'relevance') items.sort((a, b) => RELEVANCE_ORDER[b.relevance] - RELEVANCE_ORDER[a.relevance])

    return items
  }, [marketIntel, typeFilter, clientFilter, sortBy, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const m of marketIntel) { c[m.type] = (c[m.type] || 0) + 1 }
    return c
  }, [marketIntel])

  const handleAdd = () => {
    if (!form.clientId || !form.title || !form.summary) return
    addMarketIntel({
      clientId: form.clientId,
      type: form.type as any,
      title: form.title,
      summary: form.summary,
      source: form.source || 'Manual Entry',
      date: new Date().toISOString(),
      relevance: form.relevance as any,
    })
    setForm({ clientId: '', type: 'industry', title: '', summary: '', source: '', relevance: 'medium' })
    setShowAdd(false)
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Market Researcher</h2>
          <p className="section-desc">Industry research, competitive analysis, keyword trends, and benchmarking intel.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)} style={{ whiteSpace: 'nowrap' }}>
          {showAdd ? '✕ Cancel' : '+ Add Intel'}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <select value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))} style={inputStyle}>
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
              {TYPE_TAGS.filter(t => t !== 'all').map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Source (e.g., SEMrush)" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
              <select value={form.relevance} onChange={e => setForm(p => ({ ...p, relevance: e.target.value }))} style={{ ...inputStyle, width: 100 }}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <textarea placeholder="Summary / key findings…" value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} rows={3} style={{ ...inputStyle, marginTop: 10, width: '100%', resize: 'vertical' }} />
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={handleAdd} disabled={!form.clientId || !form.title || !form.summary}>
            Save Intel
          </button>
        </div>
      )}

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 14 }}>
        {TYPE_TAGS.filter(t => t !== 'all').map(type => (
          <div key={type} className="card" style={{ textAlign: 'center', padding: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-500)' }}>{counts[type] || 0}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{type.charAt(0).toUpperCase() + type.slice(1)}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        {TYPE_TAGS.map(type => (
          <span key={type} className="tag" onClick={() => setTypeFilter(type)}
            style={{ cursor: 'pointer', background: typeFilter === type ? 'var(--brand-500)' : 'var(--bg-tertiary)',
              color: typeFilter === type ? '#fff' : 'var(--text-muted)', padding: '4px 10px', borderRadius: 6 }}>
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
        <span style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} style={{ ...inputStyle, width: 140 }}>
          <option value="all">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortField)} style={{ ...inputStyle, width: 100 }}>
          <option value="date">Newest</option>
          <option value="relevance">Relevance</option>
        </select>
        <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 180, marginLeft: 'auto' }} />
      </div>

      {/* ── Results ── */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
          No intel found. {marketIntel.length === 0 ? 'Add your first piece of intel above.' : 'Try adjusting filters.'}
        </div>
      ) : (
        filtered.map(intel => {
          const client = getClient(intel.clientId)
          return (
            <div key={intel.id} className="card" style={{ marginBottom: 10, borderLeft: `4px solid ${intel.relevance === 'high' ? 'var(--success-500)' : intel.relevance === 'medium' ? 'var(--warning-500)' : 'var(--text-muted)'}`, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{intel.title}</span>
                    <span className="tag" style={{ fontSize: 10, background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{intel.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{client?.name}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <span className="tag" style={{
                    background: intel.relevance === 'high' ? 'var(--success-500)20' : intel.relevance === 'medium' ? 'var(--warning-500)20' : 'var(--text-muted)20',
                    color: intel.relevance === 'high' ? 'var(--success-500)' : intel.relevance === 'medium' ? 'var(--warning-500)' : 'var(--text-muted)',
                    fontSize: 10,
                  }}>
                    {intel.relevance.toUpperCase()}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{intel.summary}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>📅 {new Date(intel.date).toLocaleDateString()} · {intel.source}</span>
                <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => {
                  const next = intel.relevance === 'high' ? 'medium' : intel.relevance === 'medium' ? 'low' : 'high'
                  updateMarketIntel(intel.id, { relevance: next })
                }}>Mark {intel.relevance === 'high' ? '→ Medium' : intel.relevance === 'medium' ? '→ Low' : '→ High'}</span>
              </div>
            </div>
          )
        })
      )}

      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        {filtered.length} of {marketIntel.length} intel items shown
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12,
}
