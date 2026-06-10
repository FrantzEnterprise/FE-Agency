import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Sparkles, CalendarDays, Clock, Send, ChevronLeft, ChevronRight, Eye, Trash2, PenLine, X } from 'lucide-react'
import AiWriterModal from './AiWriterModal'
import EmptyState from './EmptyState'
import type { ContentPiece } from '../types'

type ContentType = 'all' | 'blog_post' | 'video' | 'infographic' | 'podcast' | 'whitepaper' | 'social_asset' | 'landing_page'
type ContentStatus = 'all' | 'brief' | 'production' | 'editing' | 'review' | 'published'
type ViewMode = 'pipeline' | 'calendar' | 'detail'

const CONTENT_TYPES: { id: ContentType; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'blog_post', label: 'Blog', icon: '📝' },
  { id: 'video', label: 'Video', icon: '🎬' },
  { id: 'infographic', label: 'Infographic', icon: '📊' },
  { id: 'podcast', label: 'Podcast', icon: '🎙️' },
  { id: 'whitepaper', label: 'Whitepaper', icon: '📄' },
  { id: 'social_asset', label: 'Social', icon: '📱' },
  { id: 'landing_page', label: 'Landing Page', icon: '🌐' },
]

const STATUS_PIPELINE: { id: ContentStatus; label: string; color: string }[] = [
  { id: 'brief', label: '📋 Brief', color: 'var(--text-muted)' },
  { id: 'production', label: '🔧 Production', color: 'var(--brand-500)' },
  { id: 'editing', label: '✂️ Editing', color: 'var(--warning-500)' },
  { id: 'review', label: '🔍 Review', color: 'var(--accent-500)' },
  { id: 'published', label: '✅ Published', color: 'var(--success-500)' },
]

const PLATFORMS = ['linkedin', 'google_business', 'facebook', 'instagram', 'twitter', 'tiktok'] as const

export default function ContentStudioPage() {
  const { contentPieces, clients, addContentPiece, updateContentPiece, deleteContentPiece } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const [viewMode, setViewMode] = useState<ViewMode>('pipeline')
  const [typeFilter, setTypeFilter] = useState<ContentType>('all')
  const [statusFilter, setStatusFilter] = useState<ContentStatus>('all')
  const [showNewForm, setShowNewForm] = useState(false)
  const [showAiWriter, setShowAiWriter] = useState(false)
  const [detailPiece, setDetailPiece] = useState<string | null>(null)

  // Calendar state
  const [calendarWeekOffset, setCalendarWeekOffset] = useState(0)

  // New piece form
  const [npTitle, setNpTitle] = useState('')
  const [npType, setNpType] = useState<ContentType>('blog_post')
  const [npClient, setNpClient] = useState('')
  const [npDue, setNpDue] = useState('')

  // Schedule picker
  const [schedulePieceId, setSchedulePieceId] = useState<string | null>(null)
  const [schedDate, setSchedDate] = useState('')
  const [schedPlatform, setSchedPlatform] = useState<'linkedin' | 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'google_business'>('linkedin')

  const filtered = useMemo(() => {
    let items = contentPieces
    if (typeFilter !== 'all') items = items.filter(p => p.type === typeFilter)
    if (statusFilter !== 'all') items = items.filter(p => p.status === statusFilter)
    return items.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
  }, [contentPieces, typeFilter, statusFilter])

  const published = contentPieces.filter(c => c.status === 'published')
  const inProduction = contentPieces.filter(c => c.status === 'production' || c.status === 'editing' || c.status === 'review')
  const briefed = contentPieces.filter(c => c.status === 'brief')
  const scheduled = contentPieces.filter(c => c.scheduledAt && c.scheduledAt !== '')

  // Pipeline groups
  const pipelineGroups = useMemo(() => {
    const groups: Record<string, typeof contentPieces> = {}
    STATUS_PIPELINE.forEach(s => { groups[s.id] = contentPieces.filter(p => p.status === s.id) })
    return groups
  }, [contentPieces])

  // Calendar helpers
  const weekStart = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + calendarWeekOffset * 7)
    const day = d.getDay()
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
    d.setHours(0, 0, 0, 0)
    return d
  }, [calendarWeekOffset])

  const weekDays = useMemo(() => {
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  }, [weekStart])

  const calendarPieces = useMemo(() => {
    return contentPieces.filter(p => p.scheduledAt && p.scheduledAt !== '')
  }, [contentPieces])

  // Detail view
  const detail = detailPiece ? contentPieces.find(p => p.id === detailPiece) : null

  // Handlers
  const handleAiSave = (data: any) => {
    addContentPiece({
      ...data,
      clientId: npClient || clients[0]?.id || 'default',
    })
    setShowAiWriter(false)
    setNpTitle('')
  }

  const handleCreateSimple = () => {
    if (!npTitle.trim() || !npClient) return
    addContentPiece({
      clientId: npClient, title: npTitle.trim(), type: npType,
      status: 'brief', assignee: '',
      outline: '', body: '', seoKeywords: [], wordCount: 0,
      tone: 'professional', targetAudience: '',
      dueDate: npDue || new Date().toISOString().slice(0, 10),
      publishedAt: '', url: '', scheduledAt: '',
      socialPost: '', generatedWithAi: false,
    })
    setNpTitle(''); setNpDue('')
  }

  const handleSchedule = () => {
    if (!schedulePieceId || !schedDate) return
    updateContentPiece(schedulePieceId, { scheduledAt: `${schedDate}T12:00:00` })
    setSchedulePieceId(null); setSchedDate('')
  }

  const handleDelete = (id: string) => {
    deleteContentPiece(id)
    setDetailPiece(null)
  }

  const changeStatus = (id: string, status: ContentStatus) => {
    updateContentPiece(id, {
      status,
      publishedAt: status === 'published' ? new Date().toISOString().slice(0, 10) : undefined,
    })
  }

  // ═══════════════════════════ RENDER ═══════════════════════════

  // ── Detail View ──
  if (detail) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">{detail.title}</h2>
            <p className="section-desc">{getClient(detail.clientId)?.name || 'Unknown'} · {detail.type.replace(/_/g, ' ')}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setDetailPiece(null)}>← Back</button>
        </div>

        {/* Status meta */}
        <div className="card" style={{ padding: 14, marginBottom: 14, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="tag" style={{ background: `${STATUS_PIPELINE.find(s => s.id === detail.status)?.color}20`, color: STATUS_PIPELINE.find(s => s.id === detail.status)?.color }}>
            {STATUS_PIPELINE.find(s => s.id === detail.status)?.label || detail.status}
          </span>
          {detail.generatedWithAi && <span className="tag" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}><Sparkles size={11} /> AI Generated</span>}
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📅 Due: {new Date(detail.dueDate).toLocaleDateString()}</span>
          {detail.scheduledAt && <span style={{ fontSize: 12, color: 'var(--info)' }}>📆 Scheduled: {new Date(detail.scheduledAt).toLocaleDateString()}</span>}
          {detail.wordCount > 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📊 {detail.wordCount} words</span>}
          {detail.tone && <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>🎯 {detail.tone}</span>}
          {detail.seoKeywords.length > 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🔑 {detail.seoKeywords.join(', ')}</span>}

          {/* Quick status change */}
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            {STATUS_PIPELINE.filter(s => s.id !== 'all').map(s => (
              <button key={s.id}
                className={`btn btn-sm ${detail.status === s.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => changeStatus(detail.id, s.id as ContentStatus)}
                style={{ fontSize: 11, padding: '3px 8px' }}
              >
                {s.label.split(' ').slice(1).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Outline */}
        {detail.outline && (
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Outline</h3>
            <pre style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0 }}>{detail.outline}</pre>
          </div>
        )}

        {/* Body */}
        {detail.body && (
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Body</h3>
            <pre style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.6, margin: 0 }}>{detail.body}</pre>
          </div>
        )}

        {/* Social */}
        {detail.socialPost && (
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Social Post</h3>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', padding: 10, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              {detail.socialPost}
            </div>
          </div>
        )}

        {/* Schedule & actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          {schedulePieceId === detail.id ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} style={inputStyle} />
              <select value={schedPlatform} onChange={e => setSchedPlatform(e.target.value as any)} style={selectStyle}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
              </select>
              <button className="btn btn-primary btn-sm" onClick={handleSchedule}><Send size={12} /> Schedule</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSchedulePieceId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => { setSchedulePieceId(detail.id); setSchedDate('') }}>
                <CalendarDays size={12} /> Schedule
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(detail.id)} style={{ color: 'var(--danger)' }}>
                <Trash2 size={12} /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // ── Calendar View ──
  if (viewMode === 'calendar') {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">📅 Content Calendar</h2>
            <p className="section-desc">Weekly view of scheduled content.</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setViewMode('pipeline')}>← Pipeline View</button>
        </div>

        {/* Week nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setCalendarWeekOffset(prev => prev - 1)}><ChevronLeft size={14} /> Prev</button>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { setCalendarWeekOffset(0) }}>Today</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setCalendarWeekOffset(prev => prev + 1)}>Next <ChevronRight size={14} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' }}>{d}</div>
          ))}
          {weekDays.map((day, i) => {
            const dayStr = day.toISOString().slice(0, 10)
            const dayPieces = calendarPieces.filter(p => p.scheduledAt?.startsWith(dayStr))
            const isToday = dayStr === new Date().toISOString().slice(0, 10)
            return (
              <div key={i} className="card" style={{
                minHeight: 100, padding: 6, fontSize: 11,
                borderColor: isToday ? 'var(--brand-500)' : 'var(--border)',
                borderWidth: isToday ? 2 : 1,
              }}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: isToday ? 'var(--brand-500)' : 'var(--text-primary)' }}>
                  {day.getDate()}
                </div>
                {dayPieces.map(p => (
                  <div key={p.id} style={{
                    padding: '2px 4px', marginBottom: 2, borderRadius: 3, fontSize: 10,
                    background: STATUS_PIPELINE.find(s => s.id === p.status)?.color + '20',
                    cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }} onClick={() => { setDetailPiece(p.id); setViewMode('detail') }}>
                    {p.title.length > 20 ? p.title.slice(0, 20) + '…' : p.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Upcoming scheduled */}
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 8px' }}>📋 All Scheduled Content</h3>
        {calendarPieces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>No content scheduled yet. Open a piece and click "Schedule".</div>
        ) : (
          calendarPieces.sort((a, b) => (a.scheduledAt || '').localeCompare(b.scheduledAt || '')).map(p => (
            <div key={p.id} className="card" style={{ padding: 10, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => { setDetailPiece(p.id); setViewMode('detail') }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{getClient(p.clientId)?.name} · {p.type.replace(/_/g, ' ')}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--info)', fontWeight: 500 }}>
                📆 {new Date(p.scheduledAt!).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  // ═══════════════════════════ PIPELINE VIEW ═══════════════════════════
  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Content Studio</h2>
          <p className="section-desc">AI-powered content creation, pipeline management, and scheduling.</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setViewMode('calendar')}>
            <CalendarDays size={14} /> Calendar
          </button>
          <button className="btn btn-primary" onClick={() => setShowAiWriter(true)}>
            <Sparkles size={14} /> AI Write
          </button>
          <button className="btn btn-secondary" onClick={() => setShowNewForm(!showNewForm)}>
            {showNewForm ? 'Cancel' : '+ Manual'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
        <StatBox label="All Content" value={contentPieces.length.toString()} color="var(--brand-500)" />
        <StatBox label="Published" value={published.length.toString()} color="var(--success-500)" />
        <StatBox label="In Production" value={inProduction.length.toString()} color="var(--warning-500)" />
        <StatBox label="In Brief" value={briefed.length.toString()} color="var(--text-muted)" />
        <StatBox label="Scheduled" value={scheduled.length.toString()} color="var(--info)" />
      </div>

      {/* AI Writer Modal */}
      <AiWriterModal show={showAiWriter} onClose={() => setShowAiWriter(false)} onSave={handleAiSave} />

      {/* New piece form */}
      {showNewForm && (
        <div className="card" style={{ marginBottom: 14, padding: 14 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <input placeholder="Title..." value={npTitle} onChange={e => setNpTitle(e.target.value)} style={{ flex: 2, minWidth: 200, ...inputStyle }} />
            <select value={npType} onChange={e => setNpType(e.target.value as ContentType)} style={selectStyle}>
              {CONTENT_TYPES.filter(t => t.id !== 'all').map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
            </select>
            <select value={npClient} onChange={e => setNpClient(e.target.value)} style={selectStyle}>
              <option value="">Client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="date" value={npDue} onChange={e => setNpDue(e.target.value)} style={inputStyle} />
            <button className="btn btn-primary" onClick={handleCreateSimple}>Create</button>
          </div>
        </div>
      )}

      {/* Pipeline columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
        {STATUS_PIPELINE.map(s => {
          const items = pipelineGroups[s.id] || []
          return (
            <div key={s.id} style={{ minHeight: 200 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: s.color, marginBottom: 6, textAlign: 'center' }}>
                {s.label} ({items.length})
              </div>
              {items.slice(0, 8).map(p => (
                <div key={p.id} className="card" style={{
                  padding: 8, marginBottom: 4, fontSize: 12, cursor: 'pointer',
                  borderLeft: `3px solid ${s.color}`,
                  position: 'relative',
                }} onClick={() => setDetailPiece(p.id)}>
                  {p.generatedWithAi && <span style={{ position: 'absolute', top: 4, right: 4, fontSize: 9, opacity: 0.5 }}>🤖</span>}
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{getClient(p.clientId)?.name || '?'}</div>
                  {p.scheduledAt && <div style={{ fontSize: 10, color: 'var(--info)' }}>📆 {new Date(p.scheduledAt).toLocaleDateString()}</div>}
                </div>
              ))}
              {items.length > 8 && <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>+{items.length - 8} more</div>}
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

      {/* List */}
      {filtered.length === 0 && (
        <EmptyState
          icon={<Sparkles size={40} />}
          title="No content yet"
          description="Generate content with AI or create a piece manually."
          action={{ label: 'Write with AI', onClick: () => setShowAiWriter(true) }}
        />
      )}
      {filtered.map(piece => {
        const client = getClient(piece.clientId)
        const statusInfo = STATUS_PIPELINE.find(s => s.id === piece.status)
        return (
          <div key={piece.id} className="card" style={{
            marginBottom: 8, padding: 12,
            borderLeft: `3px solid ${statusInfo?.color || 'var(--border)'}`,
            cursor: 'pointer',
          }} onClick={() => setDetailPiece(piece.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  {piece.generatedWithAi && <Sparkles size={12} style={{ color: '#8b5cf6', marginRight: 4, display: 'inline' }} />}
                  {piece.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {client?.name || 'Unknown'} · <span style={{ textTransform: 'capitalize' }}>{piece.type.replace(/_/g, ' ')}</span>
                  {piece.wordCount > 0 && <> · {piece.wordCount} words</>}
                  {piece.seoKeywords.length > 0 && <> · 🔑 {piece.seoKeywords.slice(0, 2).join(', ')}</>}
                </div>
              </div>
              <span className="tag" style={{ background: `${statusInfo?.color}20`, color: statusInfo?.color, fontSize: 11, whiteSpace: 'nowrap' }}>
                {statusInfo?.label || piece.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>📅 {new Date(piece.dueDate).toLocaleDateString()}</span>
              {piece.scheduledAt && <span>📆 Scheduled: {new Date(piece.scheduledAt).toLocaleDateString()}</span>}
              {piece.publishedAt && <span>✅ {new Date(piece.publishedAt).toLocaleDateString()}</span>}
            </div>
          </div>
        )
      })}

      {/* Schedule Modal */}
      {schedulePieceId && !detail && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 100,
          background: 'var(--bg-primary)', borderRadius: 12, padding: 14,
          border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          width: 340,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Schedule Content</span>
            <button className="btn btn-ghost btn-icon" onClick={() => setSchedulePieceId(null)}><X size={14} /></button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexDirection: 'column' }}>
            <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} style={inputStyle} />
            <select value={schedPlatform} onChange={e => setSchedPlatform(e.target.value as any)} style={selectStyle}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={handleSchedule}><Send size={12} /> Queue for Publish</button>
          </div>
        </div>
      )}
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

const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13,
}
const selectStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13,
}
