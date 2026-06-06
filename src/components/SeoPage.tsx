import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function SeoPage() {
  const { seoKeywords, clients } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const avgPosition = seoKeywords.length ? Math.round((seoKeywords.reduce((s, k) => s + k.position, 0) / seoKeywords.length) * 10) / 10 : 0
  const improved = seoKeywords.filter(k => k.position < k.previousPosition)
  const declined = seoKeywords.filter(k => k.position > k.previousPosition)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">SEO Suite</h2>
          <p className="section-desc">Keyword tracking, rank monitoring, technical SEO audits, and content optimization.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Keywords Tracked</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-500)' }}>{seoKeywords.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Avg Position</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: avgPosition <= 5 ? 'var(--success-500)' : avgPosition <= 10 ? 'var(--warning-500)' : 'var(--danger-500)' }}>{avgPosition}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Improved ↑</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success-500)' }}>{improved.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Declined ↓</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--danger-500)' }}>{declined.length}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '0 0 8px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ gridColumn: 'span 2' }}>Keyword</div>
          <div>Volume</div>
          <div>Difficulty</div>
          <div>Position</div>
          <div>Prev</div>
          <div>Status</div>
        </div>
        {seoKeywords.map(k => (
          <div key={k.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, fontSize: 12, padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <div style={{ gridColumn: 'span 2', fontWeight: 600 }}>{k.keyword}<div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>{getClient(k.clientId)?.name}</div></div>
            <div>{k.volume.toLocaleString()}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{k.difficulty}</span>
                <div style={{ width: 30, height: 4, borderRadius: 2, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                  <div style={{ width: `${k.difficulty}%`, height: '100%', borderRadius: 2, background: k.difficulty > 70 ? 'var(--danger-500)' : k.difficulty > 50 ? 'var(--warning-500)' : 'var(--success-500)' }} />
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: k.position <= 5 ? 'var(--success-500)' : k.position <= 10 ? 'var(--warning-500)' : 'var(--danger-500)' }}>#{k.position}</div>
            <div style={{ color: 'var(--text-muted)' }}>#{k.previousPosition}</div>
            <div>
              {k.position < k.previousPosition ? <span style={{ color: 'var(--success-500)' }}>↑ +{k.previousPosition - k.position}</span> :
               k.position > k.previousPosition ? <span style={{ color: 'var(--danger-500)' }}>↓ -{k.position - k.previousPosition}</span> :
               <span style={{ color: 'var(--text-muted)' }}>—</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
