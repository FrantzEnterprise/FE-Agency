import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function SeoPage() {
  const { seoKeywords, clients } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const [clientFilter, setClientFilter] = useState<string>('all')
  const [groupBy, setGroupBy] = useState<'all' | 'top10' | 'top20' | 'top50' | '100+'>('all')

  const filtered = useMemo(() => {
    let items = seoKeywords
    if (clientFilter !== 'all') items = items.filter(k => k.clientId === clientFilter)
    if (groupBy === 'top10') items = items.filter(k => k.position <= 10)
    else if (groupBy === 'top20') items = items.filter(k => k.position <= 20)
    else if (groupBy === 'top50') items = items.filter(k => k.position <= 50)
    else if (groupBy === '100+') items = items.filter(k => k.position > 50)
    return items.sort((a, b) => a.position - b.position)
  }, [seoKeywords, clientFilter, groupBy])

  const avgPos = filtered.length > 0 ? (filtered.reduce((s, k) => s + k.position, 0) / filtered.length).toFixed(1) : '—'
  const improved = filtered.filter(k => k.position < k.previousPosition).length
  const declined = filtered.filter(k => k.position > k.previousPosition).length
  const stable = filtered.filter(k => k.position === k.previousPosition).length
  const totalVol = filtered.reduce((s, k) => s + k.volume, 0)
  const avgDiff = filtered.length > 0 ? (filtered.reduce((s, k) => s + (k.previousPosition - k.position), 0) / filtered.length).toFixed(1) : '—'

  // Rank distribution
  const rank10 = filtered.filter(k => k.position <= 10).length
  const rank20 = filtered.filter(k => k.position > 10 && k.position <= 30).length
  const rank50 = filtered.filter(k => k.position > 30 && k.position <= 50).length
  const rank100 = filtered.filter(k => k.position > 50).length

  // By-client aggregation
  const clientStats = useMemo(() => {
    const map: Record<string, { keywords: number; avgPos: number; improved: number; declined: number; volume: number }> = {}
    clients.forEach(c => {
      const kw = seoKeywords.filter(k => k.clientId === c.id)
      if (kw.length > 0) {
        map[c.id] = {
          keywords: kw.length,
          avgPos: Math.round((kw.reduce((s, k) => s + k.position, 0) / kw.length) * 10) / 10,
          improved: kw.filter(k => k.position < k.previousPosition).length,
          declined: kw.filter(k => k.position > k.previousPosition).length,
          volume: kw.reduce((s, k) => s + k.volume, 0),
        }
      }
    })
    return map
  }, [seoKeywords, clients])

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">SEO Suite</h2>
          <p className="section-desc">Keyword tracking, rank monitoring, content gap analysis, and competitive insights.</p>
        </div>
      </div>

      {/* Overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
        <StatBox label="Keywords Tracked" value={filtered.length.toString()} color="var(--brand-500)" />
        <StatBox label="Avg Position" value={avgPos} color={Number(avgPos) <= 5 ? 'var(--success-500)' : Number(avgPos) <= 10 ? 'var(--warning-500)' : 'var(--danger-500)'} />
        <StatBox label="Improved ↑" value={improved.toString()} color="var(--success-500)" />
        <StatBox label="Declined ↓" value={declined.toString()} color="var(--danger-500)" />
        <StatBox label="Stable —" value={stable.toString()} color="var(--text-muted)" />
        <StatBox label="Total Volume" value={totalVol.toLocaleString()} color="var(--accent-500)" />
      </div>

      {/* Rank distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        <RankCard label="Position 1-10" count={rank10} total={filtered.length} color="var(--success-500)" />
        <RankCard label="Position 11-30" count={rank20} total={filtered.length} color="var(--accent-500)" />
        <RankCard label="Position 31-50" count={rank50} total={filtered.length} color="var(--warning-500)" />
        <RankCard label="Position 50+" count={rank100} total={filtered.length} color="var(--danger-500)" />
      </div>

      {/* Client breakdown */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {Object.entries(clientStats).map(([cid, stats]) => {
          const client = getClient(cid)
          return (
            <div key={cid} className="card" style={{ padding: '8px 12', fontSize: 12, cursor: 'pointer', border: clientFilter === cid ? '2px solid var(--brand-500)' : '1px solid var(--border)' }} onClick={() => setClientFilter(clientFilter === cid ? 'all' : cid)}>
              <div style={{ fontWeight: 700 }}>{client?.name || 'Unknown'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{stats.keywords} kw · #{stats.avgPos} avg · {stats.volume.toLocaleString()} vol</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 2, fontSize: 11 }}>
                <span style={{ color: 'var(--success-500)' }}>↑{stats.improved}</span>
                <span style={{ color: 'var(--danger-500)' }}>↓{stats.declined}</span>
              </div>
            </div>
          )
        })}
        <div className="card" style={{ padding: '8px 12', fontSize: 12, cursor: 'pointer', border: clientFilter === 'all' ? '2px solid var(--brand-500)' : '1px solid var(--border)' }} onClick={() => setClientFilter('all')}>
          <div style={{ fontWeight: 700 }}>All Clients</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{seoKeywords.length} keywords</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
        {(['all', 'top10', 'top20', 'top50', '100+'] as const).map(g => (
          <button key={g} className="btn" style={{
            padding: '4px 10px', fontSize: 12, borderRadius: 6,
            background: groupBy === g ? 'var(--brand-500)' : 'var(--bg-secondary)',
            color: groupBy === g ? '#fff' : 'var(--text-primary)',
            border: 'none', cursor: 'pointer', fontWeight: 600,
          }} onClick={() => setGroupBy(g)}>
            {g === 'all' ? 'All' : g === 'top10' ? '🏆 Top 10' : g === 'top20' ? '🥈 Top 20' : g === 'top50' ? '🥉 Top 50' : '📉 50+'}
          </button>
        ))}
      </div>

      {/* Keyword table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1.2fr', gap: 8, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', padding: '10px 14px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
          <div>Keyword</div>
          <div>Volume</div>
          <div>Difficulty</div>
          <div>Position</div>
          <div>Prev</div>
          <div>Change</div>
          <div>Client</div>
        </div>
        {filtered.map(k => {
          const change = k.position - k.previousPosition
          return (
            <div key={k.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1.2fr', gap: 8, fontSize: 12,
              padding: '10px 14px', borderBottom: '1px solid var(--border)', alignItems: 'center',
              background: k.position <= 3 ? 'var(--success-500)08' : k.position <= 10 ? 'var(--accent-500)08' : 'transparent',
            }}>
              <div style={{ fontWeight: 600 }}>{k.keyword}</div>
              <div>{k.volume.toLocaleString()}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{k.difficulty}</span>
                  <div style={{ width: 30, height: 4, borderRadius: 2, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                    <div style={{ width: `${k.difficulty}%`, height: '100%', borderRadius: 2, background: k.difficulty > 70 ? 'var(--danger-500)' : k.difficulty > 40 ? 'var(--warning-500)' : 'var(--success-500)' }} />
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: k.position <= 3 ? 'var(--success-500)' : k.position <= 10 ? 'var(--accent-500)' : k.position <= 30 ? 'var(--warning-500)' : 'var(--danger-500)' }}>#{k.position}</div>
              <div style={{ color: 'var(--text-muted)' }}>#{k.previousPosition}</div>
              <div>
                {change < 0 ? (
                  <span style={{ color: 'var(--success-500)', fontWeight: 600 }}>↑ {Math.abs(change)}</span>
                ) : change > 0 ? (
                  <span style={{ color: 'var(--danger-500)', fontWeight: 600 }}>↓ {change}</span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{getClient(k.clientId)?.name || '—'}</div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14 }}>No keywords match the current filter.</div>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 12 }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
    </div>
  )
}

function RankCard({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 16, fontWeight: 800, color }}>{count}</div>
      </div>
      <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: color }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{pct}% of tracked</div>
    </div>
  )
}
