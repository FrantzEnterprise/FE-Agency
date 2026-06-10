import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'

type Platform = 'all' | 'linkedin' | 'instagram' | 'facebook' | 'twitter' | 'tiktok'

const PLATFORMS: { id: Platform; label: string; color: string }[] = [
  { id: 'all', label: 'All Platforms', color: '' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'twitter', label: 'Twitter/X', color: '#1DA1F2' },
  { id: 'tiktok', label: 'TikTok', color: '#000000' },
]

export default function SocialPage() {
  const { socialPosts, clients, addSocialPost } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)
  const [filter, setFilter] = useState<Platform>('all')
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [showComposer, setShowComposer] = useState(false)

  const filtered = filter === 'all' ? socialPosts : socialPosts.filter(p => p.platform === filter)

  const posted = filtered.filter(p => p.status === 'posted')
  const scheduled = filtered.filter(p => p.status === 'scheduled')
  const draft = filtered.filter(p => p.status === 'draft')
  const totalImp = posted.reduce((s, p) => s + p.impressions, 0)
  const totalEng = posted.reduce((s, p) => s + p.likes + p.comments + p.shares, 0)
  const avgEngRate = totalImp > 0 ? ((totalEng / totalImp) * 100).toFixed(1) : '0.0'

  const byPlatform = useMemo(() => {
    const map: Record<string, { posted: number; impressions: number; engagement: number }> = {}
    socialPosts.forEach(p => {
      if (!map[p.platform]) map[p.platform] = { posted: 0, impressions: 0, engagement: 0 }
      if (p.status === 'posted') {
        map[p.platform].posted++
        map[p.platform].impressions += p.impressions
        map[p.platform].engagement += p.likes + p.comments + p.shares
      }
    })
    return map
  }, [socialPosts])

  // Build calendar data for upcoming 14 days
  const calendarDays = useMemo(() => {
    const days: { date: string; posts: typeof socialPosts }[] = []
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      const dateStr = d.toISOString().slice(0, 10)
      days.push({
        date: dateStr,
        posts: socialPosts.filter(p => p.scheduledFor?.startsWith(dateStr) || (p.status === 'scheduled' && p.scheduledFor?.startsWith(dateStr)))
      })
    }
    return days
  }, [socialPosts])

  // Composer state
  const [newPlatform, setNewPlatform] = useState('linkedin')
  const [newContent, setNewContent] = useState('')
  const [newClient, setNewClient] = useState('')
  const [newSchedule, setNewSchedule] = useState('')

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Social Media Manager</h2>
          <p className="section-desc">Platform analytics, content calendar, post composer, and engagement tracking.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowComposer(!showComposer)}>
          {showComposer ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {/* Platform breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 14 }}>
        {PLATFORMS.filter(p => p.id !== 'all').map(pf => {
          const stats = byPlatform[pf.id] || { posted: 0, impressions: 0, engagement: 0 }
          return (
            <div key={pf.id} className="card" style={{ textAlign: 'center', padding: 12, borderTop: `3px solid ${pf.color}` }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{pf.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: pf.color, margin: '4px 0' }}>{stats.posted}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stats.impressions.toLocaleString()} imp</div>
            </div>
          )
        })}
      </div>

      {/* Overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
        <StatBox label="Posted" value={posted.length.toString()} color="var(--success-500)" />
        <StatBox label="Scheduled" value={scheduled.length.toString()} color="var(--brand-500)" />
        <StatBox label="Drafts" value={draft.length.toString()} color="var(--text-muted)" />
        <StatBox label="Impressions" value={totalImp.toLocaleString()} color="var(--accent-500)" />
        <StatBox label="Engagements" value={totalEng.toLocaleString()} color="var(--warning-500)" />
        <StatBox label="Eng. Rate" value={`${avgEngRate}%`} color="var(--brand-400)" />
      </div>

      {/* Post composer */}
      {showComposer && (
        <div className="card" style={{ marginBottom: 14, padding: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>New Social Post</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <select value={newClient} onChange={e => setNewClient(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13 }}>
              <option value="">Client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={newPlatform} onChange={e => setNewPlatform(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13 }}>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter/X</option>
              <option value="tiktok">TikTok</option>
            </select>
            <input type="datetime-local" value={newSchedule} onChange={e => setNewSchedule(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13 }} />
          </div>
          <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Write your post content..." rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: 13, resize: 'vertical', marginBottom: 10, fontFamily: 'inherit' }} />
          <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => {
            if (!newClient || !newContent.trim()) { alert('Select a client and write content'); return }
            addSocialPost({
              clientId: newClient,
              platform: newPlatform,
              content: newContent.trim(),
              status: newSchedule ? 'scheduled' : 'draft',
              scheduledFor: newSchedule || '',
            })
            setNewContent(''); setNewSchedule(''); setShowComposer(false)
          }}>Save</button>
        </div>
      )}

      {/* Filters + view toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {PLATFORMS.map(pf => (
            <button key={pf.id} className="btn" style={{
              padding: '4px 10px', fontSize: 12, borderRadius: 6,
              background: filter === pf.id ? 'var(--brand-500)' : 'var(--bg-secondary)',
              color: filter === pf.id ? '#fff' : 'var(--text-primary)',
              border: 'none', cursor: 'pointer', fontWeight: 600,
            }} onClick={() => setFilter(pf.id)}>{pf.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn" style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, background: view === 'list' ? 'var(--brand-500)' : 'var(--bg-secondary)', color: view === 'list' ? '#fff' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => setView('list')}>📋 List</button>
          <button className="btn" style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, background: view === 'calendar' ? 'var(--brand-500)' : 'var(--bg-secondary)', color: view === 'calendar' ? '#fff' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => setView('calendar')}>📅 Calendar</button>
        </div>
      </div>

      {/* Calendar view */}
      {view === 'calendar' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 16 }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' }}>{d}</div>
          ))}
          {calendarDays.map(day => (
            <div key={day.date} className="card" style={{ padding: 6, minHeight: 60, fontSize: 11 }}>
              <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-muted)' }}>{new Date(day.date).getDate()}</div>
              {day.posts.map(p => (
                <div key={p.id} style={{
                  padding: '2px 4px', marginBottom: 2, borderRadius: 3, fontSize: 10,
                  background: p.status === 'scheduled' ? 'var(--brand-500)20' : 'var(--success-500)20',
                  color: p.status === 'scheduled' ? 'var(--brand-500)' : 'var(--success-500)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{p.platform}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14 }}>
          {filter === 'all' ? 'No social posts yet. Create your first post!' : `No posts for ${filter}.`}
        </div>
      )}
      {view === 'list' && filtered.map(post => {
        const client = getClient(post.clientId)
        const pf = PLATFORMS.find(p => p.id === post.platform)
        return (
          <div key={post.id} className="card" style={{ marginBottom: 10, padding: 14, borderLeft: `3px solid ${pf?.color || 'var(--border)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: pf?.color }}>{pf?.label || post.platform}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>· {client?.name || 'Unknown'}</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-primary)' }}>{post.content}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 80 }}>
                <span className="tag" style={{
                  background: post.status === 'posted' ? 'var(--success-500)20' : post.status === 'scheduled' ? 'var(--brand-500)20' : 'var(--text-muted)20',
                  color: post.status === 'posted' ? 'var(--success-500)' : post.status === 'scheduled' ? 'var(--brand-500)' : 'var(--text-muted)',
                  fontSize: 11,
                }}>
                  {post.status === 'posted' ? '✅ Posted' : post.status === 'scheduled' ? `📅 ${post.scheduledFor ? new Date(post.scheduledFor).toLocaleDateString() : ''}` : '⚪ Draft'}
                </span>
              </div>
            </div>
            {post.status === 'posted' && (
              <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>🔄 {post.shares}</span>
                <span>👁️ {post.impressions.toLocaleString()}</span>
                <span style={{ color: 'var(--text-muted)' }}>{post.postedAt ? new Date(post.postedAt).toLocaleDateString() : ''}</span>
              </div>
            )}
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
