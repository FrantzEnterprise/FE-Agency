import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const PLATFORMS = ['Google Ads', 'Meta', 'LinkedIn', 'TikTok', 'Twitter/X', 'Pinterest', 'Programmatic']

export default function PaidMediaPage() {
  const { campaigns, clients, addCampaign, updateCampaign } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ clientId: '', name: '', platform: 'Google Ads', budget: 1000, spent: 0, status: 'draft', notes: '', conversions: 0, impressions: 0, clicks: 0 })

  const filtered = useMemo(() => {
    let items = [...campaigns]
    if (statusFilter !== 'all') items = items.filter(c => c.status === statusFilter)
    if (platformFilter !== 'all') items = items.filter(c => c.platform === platformFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(c => c.name.toLowerCase().includes(q) || (getClient(c.clientId)?.name || '').toLowerCase().includes(q))
    }
    return items
  }, [campaigns, statusFilter, platformFilter, search])

  const totals = useMemo(() => ({
    active: campaigns.filter(c => c.status === 'active').length,
    budget: campaigns.reduce((s, c) => s + c.budget, 0),
    spent: campaigns.reduce((s, c) => s + c.spent, 0),
    conversions: campaigns.reduce((s, c) => s + c.conversions, 0),
    impressions: campaigns.reduce((s, c) => s + c.impressions, 0),
    clicks: campaigns.reduce((s, c) => s + c.clicks, 0),
  }), [campaigns])

  const platformBreakdown = useMemo(() => {
    const b: Record<string, { budget: number; spent: number; conv: number }> = {}
    for (const c of campaigns) {
      if (!b[c.platform]) b[c.platform] = { budget: 0, spent: 0, conv: 0 }
      b[c.platform].budget += c.budget
      b[c.platform].spent += c.spent
      b[c.platform].conv += c.conversions
    }
    return b
  }, [campaigns])

  const handleAdd = () => {
    if (!form.clientId || !form.name) return
    addCampaign({
      clientId: form.clientId,
      name: form.name,
      platform: form.platform,
      budget: form.budget || 0,
      spent: form.spent || 0,
      status: form.status as any,
      notes: form.notes || '',
      conversions: form.conversions || 0,
      impressions: form.impressions || 0,
      clicks: form.clicks || 0,
    })
    setForm({ clientId: '', name: '', platform: 'Google Ads', budget: 1000, spent: 0, status: 'draft', notes: '', conversions: 0, impressions: 0, clicks: 0 })
    setShowAdd(false)
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Paid Media Manager</h2>
          <p className="section-desc">Ad account audits, campaign tracking, budget pacing, and attribution across all platforms.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)} style={{ whiteSpace: 'nowrap' }}>
          {showAdd ? '✕ Cancel' : '+ New Campaign'}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <select value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))} style={inputStyle}>
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Campaign name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} style={inputStyle}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" placeholder="Budget $" value={form.budget || ''} onChange={e => setForm(p => ({ ...p, budget: Number(e.target.value) }))} style={{ ...inputStyle, flex: 1 }} />
              <input type="number" placeholder="Spent $" value={form.spent || ''} onChange={e => setForm(p => ({ ...p, spent: Number(e.target.value) }))} style={{ ...inputStyle, flex: 1 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" placeholder="Impressions" value={form.impressions || ''} onChange={e => setForm(p => ({ ...p, impressions: Number(e.target.value) }))} style={{ ...inputStyle, flex: 1 }} />
              <input type="number" placeholder="Clicks" value={form.clicks || ''} onChange={e => setForm(p => ({ ...p, clicks: Number(e.target.value) }))} style={{ ...inputStyle, flex: 1 }} />
              <input type="number" placeholder="Conversions" value={form.conversions || ''} onChange={e => setForm(p => ({ ...p, conversions: Number(e.target.value) }))} style={{ ...inputStyle, flex: 1 }} />
            </div>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <input placeholder="Notes" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, marginTop: 10, width: '100%' }} />
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={handleAdd} disabled={!form.clientId || !form.name}>Create Campaign</button>
        </div>
      )}

      {/* ── Overview Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Active', value: totals.active, color: 'var(--success-500)' },
          { label: 'Budget', value: `$${(totals.budget / 1000).toFixed(0)}K`, color: 'var(--brand-500)' },
          { label: 'Spent', value: `$${(totals.spent / 1000).toFixed(0)}K`, color: 'var(--accent-500)' },
          { label: 'Impressions', value: (totals.impressions / 1000).toFixed(0) + 'K', color: 'var(--warning-500)' },
          { label: 'Clicks', value: totals.clicks.toLocaleString(), color: 'var(--text-primary)' },
          { label: 'Conversions', value: totals.conversions.toLocaleString(), color: 'var(--success-500)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', padding: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{stat.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── Platform Breakdown ── */}
      <div className="card" style={{ marginBottom: 14, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>📊 Platform Breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          {Object.entries(platformBreakdown).sort((a, b) => b[1].spent - a[1].spent).map(([platform, data]) => (
            <div key={platform} style={{ background: 'var(--bg-tertiary)', padding: 10, borderRadius: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{platform}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Budget: ${data.budget.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Spent: ${data.spent.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Conversions: {data.conv}</div>
              <div style={{ marginTop: 4, height: 3, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: data.budget > 0 ? `${Math.min((data.spent / data.budget) * 100, 100)}%` : '0%', background: 'var(--brand-500)', borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 120 }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
        </select>
        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} style={{ ...inputStyle, width: 130 }}>
          <option value="all">All Platforms</option>
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input placeholder="Search campaigns…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 220, marginLeft: 'auto' }} />
      </div>

      {/* ── Campaign Cards ── */}
      {filtered.map(cam => {
        const client = getClient(cam.clientId)
        const ctr = cam.impressions > 0 ? ((cam.clicks / cam.impressions) * 100).toFixed(2) : '0.00'
        const cpa = cam.conversions > 0 ? Math.round(cam.spent / cam.conversions) : 0
        const pacing = cam.budget > 0 ? Math.round((cam.spent / cam.budget) * 100) : 0

        return (
          <div key={cam.id} className="card" style={{ marginBottom: 10, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{cam.name}</span>
                  <span className="tag" style={{ fontSize: 10, background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{cam.platform}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{client?.name}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="tag" style={{
                  background: cam.status === 'active' ? 'var(--success-500)20' : cam.status === 'paused' ? 'var(--warning-500)20' : 'var(--text-muted)20',
                  color: cam.status === 'active' ? 'var(--success-500)' : cam.status === 'paused' ? 'var(--warning-500)' : 'var(--text-muted)',
                  fontSize: 10,
                }}>
                  {cam.status === 'active' ? '🟢 Active' : cam.status === 'paused' ? '🟡 Paused' : cam.status === 'draft' ? '⚪ Draft' : '⚫ Completed'}
                </span>
                {cam.status !== 'completed' && (
                  <button className="btn" style={{ padding: '2px 8px', fontSize: 11 }}
                    onClick={() => updateCampaign(cam.id, { status: cam.status === 'active' ? 'paused' : cam.status === 'paused' ? 'active' : 'active' })}>
                    {cam.status === 'active' ? '⏸' : '▶️'}
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 10, fontSize: 12 }}>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Budget</div><div style={{ fontWeight: 600 }}>${cam.budget.toLocaleString()}</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Spent</div><div style={{ fontWeight: 600 }}>${cam.spent.toLocaleString()}</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>CTR</div><div style={{ fontWeight: 600 }}>{ctr}%</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>CPA</div><div style={{ fontWeight: 600 }}>${cpa}</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Conv.</div><div style={{ fontWeight: 600 }}>{cam.conversions}</div></div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>
                <span>Budget Pacing</span><span>{pacing}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(pacing, 100)}%`, height: '100%', borderRadius: 2,
                  background: pacing > 100 ? 'var(--danger-500)' : pacing > 80 ? 'var(--warning-500)' : 'var(--brand-500)' }} />
              </div>
            </div>

            {cam.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{cam.notes}</div>}
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              {cam.impressions.toLocaleString()} imp · {cam.clicks.toLocaleString()} clks
            </div>
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
          No campaigns found. {campaigns.length === 0 ? 'Create your first campaign above.' : 'Adjust filters.'}
        </div>
      )}

      <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        {filtered.length} of {campaigns.length} campaigns · Overall ROAS: {totals.spent > 0 ? (totals.conversions * 50 / totals.spent).toFixed(2) + 'x' : '—'}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12,
}
