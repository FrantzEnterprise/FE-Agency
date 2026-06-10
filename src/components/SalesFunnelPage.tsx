import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const funnelStages = [
  { id: 'top', label: 'TOP OF FUNNEL', icon: '🎯', color: '#6366f1', metric: 'reach' },
  { id: 'awareness', label: 'AWARENESS', icon: '👁️', color: '#3b82f6', metric: 'impressions' },
  { id: 'interest', label: 'INTEREST', icon: '🔥', color: '#06b6d4', metric: 'leads' },
  { id: 'consideration', label: 'CONSIDERATION', icon: '💎', color: '#8b5cf6', metric: 'proposals' },
  { id: 'decision', label: 'DECISION', icon: '⚡', color: '#f59e0b', metric: 'meetings' },
  { id: 'action', label: 'ACTION', icon: '🏆', color: '#22c55e', metric: 'sales' },
]

const sampleLead = { name: 'Sarah Chen', company: 'BrightPath Dental', stage: 'interest', value: 9500, source: 'Google Ads', daysInStage: 3 }

export default function SalesFunnelPage() {
  const clients = useAppStore(s => s.clients)
  const [expandedStage, setExpandedStage] = useState<string | null>('interest')

  const stageTotals: Record<string, number> = {
    reach: 24800,
    impressions: 12400,
    leads: 1840,
    proposals: 421,
    meetings: 147,
    sales: 48,
  }

  const pipelineValue: Record<string, number> = {
    reach: 0,
    impressions: 0,
    leads: 920000,
    proposals: 584000,
    meetings: 312000,
    sales: 456000,
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Sales Funnel</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Visual pipeline from awareness to closed deal</p>
      </div>

      {/* MEGA FUNNEL VISUALIZATION */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        marginBottom: 32, position: 'relative',
      }}>
        {funnelStages.map((stage, idx) => {
          const count = stageTotals[stage.metric]
          const value = pipelineValue[stage.metric]
          const widthPercent = 100 - (idx * 14)
          const isExpanded = expandedStage === stage.id

          return (
            <div
              key={stage.id}
              onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
              style={{
                width: `${widthPercent}%`,
                minWidth: 200,
                background: isExpanded ? stage.color : `${stage.color}22`,
                border: `2px solid ${stage.color}`,
                borderRadius: 12,
                padding: isExpanded ? '20px 24px' : '14px 20px',
                marginBottom: 4,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                boxShadow: isExpanded ? `0 8px 32px ${stage.color}40` : 'none',
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: isExpanded ? 28 : 24 }}>{stage.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: stage.color, letterSpacing: '0.08em' }}>
                      {stage.label}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#e2e8f0' }}>
                      {count.toLocaleString()}
                      <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b', marginLeft: 8 }}>
                        {idx === 0 ? 'visitors' : idx === 5 ? 'clients' : 'prospects'}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {value > 0 && (
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>
                      ${(value / 1000).toFixed(0)}K
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    {idx === 0 ? '↘' : `${((count / stageTotals[funnelStages[idx - 1].metric]) * 100).toFixed(0)}%`} conversion
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{ marginTop: 16, borderTop: `1px solid ${stage.color}44`, paddingTop: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div style={{ background: `${stage.color}15`, borderRadius: 8, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0' }}>
                        {((count / (idx > 0 ? stageTotals[funnelStages[idx - 1].metric] : count)) * 100).toFixed(0)}%
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Conv. Rate</div>
                    </div>
                    <div style={{ background: `${stage.color}15`, borderRadius: 8, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>
                        ${(value / (idx > 0 ? count : 1) || 0).toFixed(0)}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Avg. Value</div>
                    </div>
                    <div style={{ background: `${stage.color}15`, borderRadius: 8, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0' }}>
                        {(idx > 0 ? ((stageTotals[funnelStages[idx - 1].metric] - count) / stageTotals[funnelStages[idx - 1].metric] * 100).toFixed(0) : '—')}%
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Drop-off</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Current leads in this stage:</div>
                  {[sampleLead, { ...sampleLead, name: 'Mike Torres', company: 'Summit Roofing', value: 14200, daysInStage: 7 }].map((lead, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px', background: `${stage.color}10`, borderRadius: 6, marginBottom: 4,
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{lead.company} · {lead.source}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>${lead.value.toLocaleString()}</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>{lead.daysInStage}d in stage</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <button className="btn btn-primary btn-sm" style={{ fontSize: 12 }}>
                      View All {count} {stage.label.toLowerCase()} leads →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pipeline Value</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', marginTop: 4 }}>
            ${Object.values(pipelineValue).reduce((a, b) => a + b, 0).toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Total weighted pipeline</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Win Rate</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#6366f1', marginTop: 4 }}>
            {((stageTotals.sales / stageTotals.meetings) * 100).toFixed(0)}%
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{stageTotals.sales} won of {stageTotals.meetings} meetings</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg. Deal Size</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b', marginTop: 4 }}>
            ${(stageTotals.sales > 0 ? (pipelineValue.sales / stageTotals.sales) : 9500).toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Across {stageTotals.sales} closed deals</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conversion Time</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#06b6d4', marginTop: 4 }}>14 days</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Average top-to-close</div>
        </div>
      </div>

      {/* TOP CLIENTS */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🏆 Top Accounts by Stage</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Client</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Industry</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Tier</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Monthly</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Stage</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>LTV</th>
              </tr>
            </thead>
            <tbody>
              {clients.slice(0, 5).map((c, i) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#e2e8f0' }}>{c.name}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{c.industry}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: c.retainerTier === 'Scale' ? '#22c55e20' : c.retainerTier === 'Growth' ? '#6366f120' : '#3b82f620',
                      color: c.retainerTier === 'Scale' ? '#22c55e' : c.retainerTier === 'Growth' ? '#6366f1' : '#3b82f6',
                    }}>
                      {c.retainerTier}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#22c55e' }}>
                    ${(c.mrr || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                      background: i === 0 ? '#22c55e20' : i === 1 ? '#6366f120' : i === 2 ? '#f59e0b20' : '#3b82f620',
                      color: i === 0 ? '#22c55e' : i === 1 ? '#6366f1' : i === 2 ? '#f59e0b' : '#3b82f6',
                    }}>
                      {i === 0 ? 'Action' : i === 1 ? 'Decision' : i === 2 ? 'Consideration' : 'Interest'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#e2e8f0' }}>
                    ${((c.mrr || 0) * 24).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
