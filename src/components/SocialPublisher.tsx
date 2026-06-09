import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const platforms = [
  { id: 'linkedin' as const, label: 'LinkedIn', color: '#0A66C2', icon: '💼' },
  { id: 'google_business' as const, label: 'Google Business', color: '#4285F4', icon: '📍' },
  { id: 'yelp' as const, label: 'Yelp', color: '#D32323', icon: '⭐' },
  { id: 'amazon' as const, label: 'Amazon', color: '#FF9900', icon: '🛍️' },
  { id: 'reddit' as const, label: 'Reddit', color: '#FF4500', icon: '🧵' },
  { id: 'facebook' as const, label: 'Facebook', color: '#1877F2', icon: '📘' },
  { id: 'instagram' as const, label: 'Instagram', color: '#E4405F', icon: '📸' },
  { id: 'twitter' as const, label: 'X / Twitter', color: '#000000', icon: '🐦' },
  { id: 'tiktok' as const, label: 'TikTok', color: '#00F2EA', icon: '🎵' },
]

export default function SocialPublisher() {
  const { clients, socialQueue, addSocialQueueItem, updateSocialQueueItem } = useAppStore()
  const [showPoster, setShowPoster] = useState(false)
  const [selectedClient, setSelectedClient] = useState('')
  const [content, setContent] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [tab, setTab] = useState<'queued' | 'posted' | 'drafts'>('queued')

  const posted = socialQueue.filter(q => q.status === 'posted')
  const queued = socialQueue.filter(q => q.status === 'queued')
  const drafts = socialQueue.filter(q => q.status === 'draft')

  const handleQueue = () => {
    if (!content.trim() || !selectedClient || selectedPlatforms.length === 0) return
    selectedPlatforms.forEach(p => {
      addSocialQueueItem({
        clientId: selectedClient,
        content: content.trim(),
        mediaUrl,
        platform: p as any,
        status: scheduleDate ? 'queued' : 'draft',
        scheduledAt: scheduleDate || '',
        postedAt: '',
        platformPostId: '',
        error: '',
      })
    })
    setContent('')
    setMediaUrl('')
    setSelectedPlatforms([])
    setScheduleDate('')
    setShowPoster(false)
  }

  const handlePost = (id: string) => {
    updateSocialQueueItem(id, { status: 'posted', postedAt: new Date().toISOString() })
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Social Publisher</h2>
          <p className="section-desc">Create, schedule, and post content to LinkedIn, Google, Yelp, Amazon, Reddit, and more.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowPoster(!showPoster)}>
          {showPoster ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className={`btn btn-ghost btn-sm ${tab === 'queued' ? 'btn-active' : ''}`} onClick={() => setTab('queued')}>
          📅 Queued ({queued.length})
        </button>
        <button className={`btn btn-ghost btn-sm ${tab === 'posted' ? 'btn-active' : ''}`} onClick={() => setTab('posted')}>
          ✅ Posted ({posted.length})
        </button>
        <button className={`btn btn-ghost btn-sm ${tab === 'drafts' ? 'btn-active' : ''}`} onClick={() => setTab('drafts')}>
          📝 Drafts ({drafts.length})
        </button>
      </div>

      {showPoster && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>New Post</h3>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Client</label>
            <select className="input" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
              <option value="">Select client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Content</label>
            <textarea className="input" style={{ minHeight: 100, resize: 'vertical' }}
              value={content} onChange={e => setContent(e.target.value)}
              placeholder="Write your post content..."
            />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{content.length} characters</div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Media URL (optional)</label>
            <input className="input" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Publish to</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {platforms.map(p => (
                <label key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                  borderRadius: 6, cursor: 'pointer', fontSize: 12,
                  background: selectedPlatforms.includes(p.id) ? `${p.color}20` : 'var(--bg-tertiary)',
                  border: selectedPlatforms.includes(p.id) ? `1px solid ${p.color}40` : '1px solid var(--border)',
                }}>
                  <input type="checkbox" checked={selectedPlatforms.includes(p.id)}
                    onChange={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                    style={{ display: 'none' }} />
                  <span>{p.icon}</span>
                  <span style={{ fontWeight: selectedPlatforms.includes(p.id) ? 600 : 400 }}>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Schedule (optional)</label>
            <input className="input" type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
          </div>

          <button className="btn btn-primary" onClick={handleQueue}
            disabled={!content.trim() || !selectedClient || selectedPlatforms.length === 0}>
            {scheduleDate ? 'Schedule Posts' : 'Queue for Review'}
          </button>
        </div>
      )}

      {tab === 'queued' && queued.map(item => {
        const platform = platforms.find(p => p.id === item.platform)
        const client = clients.find(c => c.id === item.clientId)
        return (
          <div key={item.id} className="card" style={{ marginBottom: 10, borderLeft: `4px solid ${platform?.color || 'var(--border)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {client?.name} · <strong>{platform?.icon} {platform?.label}</strong>
                </div>
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{item.content}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {item.scheduledAt && <span className="tag" style={{ background: 'var(--brand-500)20', color: 'var(--brand-500)' }}>
                  📅 {new Date(item.scheduledAt).toLocaleDateString()}
                </span>}
                <button className="btn btn-sm btn-primary" onClick={() => handlePost(item.id)}>Post Now</button>
              </div>
            </div>
          </div>
        )
      })}

      {tab === 'posted' && posted.map(item => {
        const platform = platforms.find(p => p.id === item.platform)
        const client = clients.find(c => c.id === item.clientId)
        return (
          <div key={item.id} className="card" style={{ marginBottom: 10, borderLeft: `4px solid ${platform?.color || 'var(--border)'}`, opacity: 0.85 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {client?.name} · <strong>{platform?.icon} {platform?.label}</strong>
                </div>
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{item.content}</div>
                {item.platformPostId && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Post ID: {item.platformPostId}</div>}
              </div>
              <span className="tag" style={{ background: 'var(--success-500)20', color: 'var(--success-500)' }}>
                ✅ Posted {item.postedAt ? new Date(item.postedAt).toLocaleDateString() : ''}
              </span>
            </div>
          </div>
        )
      })}

      {tab === 'drafts' && drafts.map(item => {
        const platform = platforms.find(p => p.id === item.platform)
        const client = clients.find(c => c.id === item.clientId)
        return (
          <div key={item.id} className="card" style={{ marginBottom: 10, borderLeft: `4px solid ${platform?.color || 'var(--border)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {client?.name} · <strong>{platform?.icon} {platform?.label}</strong>
                </div>
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{item.content}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-sm" onClick={() => updateSocialQueueItem(item.id, { status: 'queued' })}>Queue</button>
                <button className="btn btn-sm btn-primary" onClick={() => handlePost(item.id)}>Post Now</button>
              </div>
            </div>
          </div>
        )
      })}

      {tab === 'posted' && posted.length === 0 && tab === 'queued' && queued.length === 0 && tab === 'drafts' && drafts.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>No posts yet. Create your first one.</p>
      )}
    </div>
  )
}
