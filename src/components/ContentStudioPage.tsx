import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'

type ContentType = 'all' | 'blog_post' | 'video' | 'infographic' | 'podcast' | 'whitepaper' | 'social' | 'landing_page'
type ContentStatus = 'all' | 'brief' | 'production' | 'editing' | 'review' | 'published'

const CONTENT_TYPES: { id: ContentType; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'blog_post', label: 'Blog', icon: '📝' },
  { id: 'video', label: 'Video', icon: '🎬' },
  { id: 'infographic', label: 'Infographic', icon: '📊' },
  { id: 'podcast', label: 'Podcast', icon: '🎙️' },
  { id: 'whitepaper', label: 'Whitepaper', icon: '📄' },
  { id: 'social', label: 'Social', icon: '📱' },
  { id: 'landing_page', label: 'Landing Page', icon: '🌐' },
]

const STATUS_PIPELINE: { id: ContentStatus; label: string; color: string }[] = [
  { id: 'brief', label: '📋 Brief', color: 'var(--text-muted)' },
  { id: 'production', label: '🔧 Production', color: 'var(--brand-500)' },
  { id: 'editing', label: '✂️ Editing', color: 'var(--warning-500)' },
  { id: 'review', label: '🔍 Review', color: 'var(--accent-500)' },
  { id: 'published', label: '✅ Published', color: 'var(--success-500)' },
]

export default function ContentStudioPage() {
  const { contentPieces, clients, addContentPiece } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const [typeFilter, setTypeFilter] = useState<ContentType>('all')
  const [statusFilter, setStatusFilter] = useState<ContentStatus>('all')
  const [showNew, setShowNew] = useState(false)

  const filtered = useMemo(() => {
    let items = contentPieces
    if (typeFilter !== 'all') items = items.filter(p => p.type === typeFilter)
    if (statusFilter !== 'all') items = items.filter(p => p.status === statusFilter)
    return items.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
  }, [contentPieces, typeFilter, statusFilter])

  const published = contentPieces.filter(c => c.status === 'published')
  const inProduction = contentPieces.filter(c => c.status === 'production' || c.status === 'editing' || c.status === 'review')
  const briefed = contentPieces.filter(c => c.status === 'brief')

  // Pipeline view: pieces grouped by status
  const pipelineGroups = useMemo(() => {
    const groups: Record<string, typeof contentPieces> = {}
    STATUS_PIPELINE.forEach(s => {
      groups[s.id] = contentPieces.filter(p => p.status === s.id)
    })
    return groups
  }, [contentPieces])

  // New piece state
  const [npTitle, setNpTitle] = useState('')
  const [npType, setNpType] = useState<ContentType>('blog_post')
  const [npClient, setNpClient] = useState('')
  const [npDue, setNpDue] = useState('')

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Content Studio Pipeline</h2>
          <p className="section-desc">Full content production workflow: brief → production → editing → review → publish.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(!showNew)}>{showNew ? 'Cancel' : '+ New Piece'}</button>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
        <StatBox label="All Content" value={contentPieces.length.toString()} color="var(--brand-500)" />
        <StatBox label="Published" value={published.length.toString()} color="var(--success-500)" />
        <StatBox label="In Production" value={inProduction.length.toString()} color="var(--warning-500)" />
        <StatBox label="In Brief" value={briefed.length.toString()} color="var(--text-muted)" />
        <StatBox label="Production %" value={contentPieces.length > 0 ? `${Math.round((inProduction.length / contentPieces.length) * 100)}%` : '0%'} color="var(--accent-500)" />
      </div>

      {/* New piece form */}
      {showNew && (
        <div className="card" style={{ marginBottom: 14, padding: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>New Content Piece</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <input placeholder="Title..." value={npTitle} onChange={e => setNpTitle(e.target.value)} style={{ flex: 2, minWidth: 200, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13 }} />
            <select value={npType} onChange={e => setNpType(e.target.value as ContentType)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13 }}>
              {CONTENT_TYPES.filter(t => t.id !== 'all').map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
            </select>
            <select value={npClient} onChange={e => setNpClient(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13 }}>
              <option value="">Client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="date" value={npDue} onChange={e => setNpDue(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13 }} />
            <button className="btn btn-primary" style={{ padding: '6px 14px' }} onClick={() => {
              if (!npTitle.trim() || !npClient) return
              addContentPiece({ clientId: npClient, title: npTitle.trim(), type: npType, status: 'brief', assignee: '', dueDate: npDue || new Date().toISOString().slice(0,10), publishedAt: '', url: '' })
              setNpTitle(''); setNpDue(''); setShowNew(false)
            }}>Create</button>
          </div>
        </div>
      )}

      {/* Pipeline view */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
        {STATUS_PIPELINE.map(s => {
          const items = pipelineGroups[s.id] || []
          return (
            <div key={s.id} style={{ minHeight: 200 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: s.color, marginBottom: 6, textAlign: 'center' }}>{s.label} ({items.length})</div>
              {items.slice(0, 6).map(p => (
                <div key={p.id} className="card" style={{ padding: 8, marginBottom: 4, fontSize: 12, cursor: 'pointer', borderLeft: `3px solid ${s.color}` }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{getClient(p.clientId)?.name || 'Unknown'} · {p.type.replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>📅 {new Date(p.dueDate).toLocaleDateString()}</div>
                </div>
              ))}
              {items.length > 6 && <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>+{items.length - 6} more</div>}
              {items.length === 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>—</div>}
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {CONTENT_TYPES.map(t => (
          <button key={t.id} className="btn" style={{
            padding: '4px 10px', fontSize: 12, borderRadius: 6,
            background: typeFilter === t.id ? 'var(--brand-500)' : 'var(--bg-secondary)',
            color: typeFilter === t.id ? '#fff' : 'var(--text-primary)',
            border: 'none', cursor: 'pointer', fontWeight: 600,
          }} onClick={() => setTypeFilter(t.id)}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Content list */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14 }}>No content pieces found.</div>
      )}
      {filtered.map(piece => {
        const client = getClient(piece.clientId)
        const statusInfo = STATUS_PIPELINE.find(s => s.id === piece.status)
        return (
          <div key={piece.id} className="card" style={{ marginBottom: 10, padding: 12, borderLeft: `3px solid ${statusInfo?.color || 'var(--border)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{piece.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {client?.name || 'Unknown'} · <span style={{ textTransform: 'capitalize' }}>{piece.type.replace(/_/g, ' ')}</span>
                  {piece.assignee && <> · 👤 {piece.assignee}</>}
                </div>
              </div>
              <span className="tag" style={{ background: `${statusInfo?.color}20`, color: statusInfo?.color, fontSize: 11 }}>{statusInfo?.label || piece.status}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>📅 Due: {new Date(piece.dueDate).toLocaleDateString()}</span>
              {piece.publishedAt && <span>✅ Published: {new Date(piece.publishedAt).toLocaleDateString()}</span>}
              {piece.url && <span><a href={piece.url} style={{ color: 'var(--brand-500)' }} target="_blank">🔗 View →</a></span>}
            </div>
          </div>
        )
      })}
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
