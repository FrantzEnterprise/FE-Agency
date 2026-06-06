import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function SocialPage() {
  const { socialPosts, clients } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const posted = socialPosts.filter(p => p.status === 'posted')
  const scheduled = socialPosts.filter(p => p.status === 'scheduled')
  const totalImpressions = posted.reduce((s, p) => s + p.impressions, 0)
  const totalEngagement = posted.reduce((s, p) => s + p.likes + p.comments + p.shares, 0)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Social Media Manager</h2>
          <p className="section-desc">Content calendar, post composer, approval flow, and engagement tracking.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Total Posted</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success-500)' }}>{posted.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Scheduled</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-500)' }}>{scheduled.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Impressions</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-500)' }}>{totalImpressions.toLocaleString()}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Engagements</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--warning-500)' }}>{totalEngagement.toLocaleString()}</div>
        </div>
      </div>

      {socialPosts.map(post => {
        const client = getClient(post.clientId)
        return (
          <div key={post.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {client?.name} · <strong>{post.platform}</strong>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{post.content}</div>
              </div>
              <span className="tag" style={{
                background: post.status === 'posted' ? 'var(--success-500)20' : post.status === 'scheduled' ? 'var(--brand-500)20' : 'var(--text-muted)20',
                color: post.status === 'posted' ? 'var(--success-500)' : post.status === 'scheduled' ? 'var(--brand-500)' : 'var(--text-muted)',
              }}>
                {post.status === 'posted' ? '✅ Posted' : post.status === 'scheduled' ? `📅 ${new Date(post.scheduledFor).toLocaleDateString()}` : '⚪ Draft'}
              </span>
            </div>
            {post.status === 'posted' && (
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>🔄 {post.shares}</span>
                <span>👁️ {post.impressions.toLocaleString()}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
