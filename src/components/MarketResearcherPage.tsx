import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function MarketResearcherPage() {
  const { marketIntel, clients } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Market Researcher</h2>
          <p className="section-desc">Industry research, competitive analysis, keyword trends, and benchmarking intel.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['industry', 'competitor', 'keyword', 'trend', 'benchmark'].map(type => (
          <span key={type} className="tag" style={{
            background: marketIntel.filter(m => m.type === type).length > 0 ? 'var(--brand-500)20' : 'var(--bg-tertiary)',
            color: marketIntel.filter(m => m.type === type).length > 0 ? 'var(--brand-500)' : 'var(--text-muted)',
          }}>
            {type.charAt(0).toUpperCase() + type.slice(1)} ({marketIntel.filter(m => m.type === type).length})
          </span>
        ))}
      </div>

      {marketIntel.map(intel => {
        const client = getClient(intel.clientId)
        return (
          <div key={intel.id} className="card" style={{ marginBottom: 10, borderLeft: `4px solid ${intel.relevance === 'high' ? 'var(--success-500)' : intel.relevance === 'medium' ? 'var(--warning-500)' : 'var(--text-muted)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{intel.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {client?.name} · {intel.type}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="tag" style={{
                  background: intel.relevance === 'high' ? 'var(--success-500)20' : intel.relevance === 'medium' ? 'var(--warning-500)20' : 'var(--text-muted)20',
                  color: intel.relevance === 'high' ? 'var(--success-500)' : intel.relevance === 'medium' ? 'var(--warning-500)' : 'var(--text-muted)',
                }}>
                  {intel.relevance.toUpperCase()}
                </span>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{intel.source}</div>
              </div>
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{intel.summary}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>📅 {new Date(intel.date).toLocaleDateString()}</div>
          </div>
        )
      })}
    </div>
  )
}
