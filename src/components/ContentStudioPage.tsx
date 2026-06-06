import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function ContentStudioPage() {
  const { contentPieces, clients } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const published = contentPieces.filter(c => c.status === 'published')
  const inProduction = contentPieces.filter(c => c.status === 'production' || c.status === 'editing')
  const briefed = contentPieces.filter(c => c.status === 'brief')

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Content Studio Pipeline</h2>
          <p className="section-desc">Content production workflow: brief → production → editing → review → publish.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Total Pieces</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-500)' }}>{contentPieces.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Published</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success-500)' }}>{published.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>In Production</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--warning-500)' }}>{inProduction.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>In Brief</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-muted)' }}>{briefed.length}</div>
        </div>
      </div>

      {contentPieces.map(piece => {
        const client = getClient(piece.clientId)
        return (
          <div key={piece.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{piece.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{client?.name || 'Unknown'} · {piece.type.replace(/_/g, ' ')}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="tag" style={{
                  background: piece.status === 'published' ? 'var(--success-500)20' : piece.status === 'production' ? 'var(--brand-500)20' : piece.status === 'brief' ? 'var(--text-muted)20' : 'var(--warning-500)20',
                  color: piece.status === 'published' ? 'var(--success-500)' : piece.status === 'production' ? 'var(--brand-500)' : piece.status === 'brief' ? 'var(--text-muted)' : 'var(--warning-500)',
                }}>
                  {piece.status === 'published' ? '✅ Published' : piece.status === 'production' ? '🔧 Production' : piece.status === 'editing' ? '✂️ Editing' : piece.status === 'script' ? '📝 Script' : piece.status === 'review' ? '🔍 Review' : '📋 Brief'}
                </span>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{piece.assignee}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>Due: {new Date(piece.dueDate).toLocaleDateString()}</span>
              {piece.publishedAt && <span>Published: {new Date(piece.publishedAt).toLocaleDateString()}</span>}
              {piece.url && <span><a href={piece.url} style={{ color: 'var(--brand-500)' }} target="_blank">View →</a></span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
