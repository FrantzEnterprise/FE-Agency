import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const METRICS = [
  { key: 'delivery_rate', label: 'Deliverable Completion Rate', unit: '%' },
  { key: 'qbr_recency', label: 'QBR Recency (days since last)', unit: 'days' },
  { key: 'response_time', label: 'Avg Response Time (hours)', unit: 'hrs' },
  { key: 'flag_count', label: 'Open Flags / Issues', unit: 'flags' },
  { key: 'mrr_trend', label: 'MRR Trend (last 90 days)', unit: '%' },
  { key: 'satisfaction', label: 'Satisfaction Score (1–10)', unit: 'pts' },
] as const

type ClientHealth = 'green' | 'yellow' | 'red'

interface ScoreResult {
  score: number
  health: ClientHealth
  breakdown: { key: string; label: string; value: number; impact: number }[]
}

function calculateHealth(metrics: Record<string, number>): ScoreResult {
  const breakdown = METRICS.map(m => {
    let value = metrics[m.key] ?? 0
    let impact = 0
    switch (m.key) {
      case 'delivery_rate': impact = value >= 90 ? 10 : value >= 70 ? 5 : -5; break
      case 'qbr_recency': impact = value <= 30 ? 10 : value <= 60 ? 5 : value <= 90 ? 0 : -10; break
      case 'response_time': impact = value <= 4 ? 10 : value <= 8 ? 5 : value <= 24 ? 0 : -5; break
      case 'flag_count': impact = value === 0 ? 10 : value <= 2 ? 5 : value <= 5 ? -5 : -10; break
      case 'mrr_trend': impact = value >= 5 ? 10 : value >= 0 ? 5 : value >= -10 ? -5 : -10; break
      case 'satisfaction': impact = value >= 8 ? 10 : value >= 6 ? 5 : value >= 4 ? 0 : -10; break
    }
    return { key: m.key, label: m.label, value, impact }
  })

  const totalImpact = breakdown.reduce((s, b) => s + b.impact, 0)
  const score = Math.max(0, Math.min(100, 50 + totalImpact))
  const health: ClientHealth = score >= 70 ? 'green' : score >= 40 ? 'yellow' : 'red'

  return { score, health, breakdown }
}

const DEFAULT_METRICS: Record<string, number> = {
  delivery_rate: 85,
  qbr_recency: 45,
  response_time: 6,
  flag_count: 1,
  mrr_trend: 3,
  satisfaction: 7,
}

export default function AccountHealthPage() {
  const { clients, updateClientHealth } = useAppStore()
  const [editing, setEditing] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<Record<string, Record<string, number>>>({})

  const getMetrics = (clientId: string) => metrics[clientId] || { ...DEFAULT_METRICS }

  const handleScore = (clientId: string) => {
    const m = getMetrics(clientId)
    const result = calculateHealth(m)
    updateClientHealth(clientId, result.health)
    setEditing(null)
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Account Health Scoring</h2>
          <p className="section-desc">Weekly health scoring across retainer accounts — green/yellow/red with recovery triggers.</p>
        </div>
      </div>

      {clients.map(client => {
        const m = getMetrics(client.id)
        const result = calculateHealth(m)
        const healthColors = { green: 'var(--success-500)', yellow: 'var(--warning-500)', red: 'var(--danger-500)' }

        return (
          <div key={client.id} className="card" style={{ marginBottom: 14, borderLeft: `4px solid ${healthColors[result.health]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{client.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{client.retainerTier} · ${client.mrr.toLocaleString()}/mo · Since {client.since}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: healthColors[result.health],
                  boxShadow: `0 0 8px ${healthColors[result.health]}40`,
                }} />
                <span style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: healthColors[result.health] }}>{result.health}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Score: {result.score}/100</span>
              </div>
            </div>

            {/* Score bar */}
            <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', marginBottom: 12, overflow: 'hidden' }}>
              <div style={{
                width: `${result.score}%`, height: '100%',
                borderRadius: 3,
                background: result.health === 'green' ? 'var(--success-500)' : result.health === 'yellow' ? 'var(--warning-500)' : 'var(--danger-500)',
                transition: 'width 0.3s',
              }} />
            </div>

            {/* Breakdown */}
            <details>
              <summary style={{ fontSize: 12, cursor: 'pointer', color: 'var(--text-muted)', marginBottom: 8 }}>View metrics breakdown</summary>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                {result.breakdown.map(b => (
                  <div key={b.key} style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{b.label}</span>
                    <span style={{ fontWeight: 600, color: b.impact > 0 ? 'var(--success-500)' : b.impact < 0 ? 'var(--danger-500)' : 'var(--text-muted)' }}>
                      {b.value}{b.key === 'delivery_rate' || b.key === 'mrr_trend' ? '%' : b.key === 'qbr_recency' ? 'd' : b.key === 'response_time' ? 'h' : ''}
                      <span style={{ marginLeft: 4 }}>({b.impact > 0 ? '+' : ''}{b.impact})</span>
                    </span>
                  </div>
                ))}
              </div>
            </details>

            {/* Edit metrics */}
            {editing === client.id ? (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {METRICS.map(m => (
                    <div key={m.key} className="form-field">
                      <label>{m.label}</label>
                      <input type="number" value={getMetrics(client.id)[m.key]} onChange={e => {
                        setMetrics(prev => ({
                          ...prev,
                          [client.id]: { ...getMetrics(client.id), [m.key]: Number(e.target.value) }
                        }))
                      }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn btn-primary" onClick={() => handleScore(client.id)}>Recalculate & Save</button>
                  <button className="btn" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="btn" style={{ marginTop: 10, fontSize: 12 }} onClick={() => { setMetrics(m => ({ ...m, [client.id]: m[client.id] || { ...DEFAULT_METRICS } })); setEditing(client.id) }}>
                Update Metrics
              </button>
            )}

            {/* Recovery trigger for red clients */}
            {result.health === 'red' && (
              <div style={{ marginTop: 12, padding: 10, background: 'var(--danger-500)15', borderRadius: 8, border: '1px solid var(--danger-500)30', fontSize: 12, color: 'var(--danger-500)' }}>
                ⚠️ <strong>Recovery needed.</strong> Initiate churn prevention playbook: schedule rescue call within 48 hours, prepare recovery plan with concrete milestones.
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
