import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const stageLabels: Record<string, string> = {
  research: 'Research', contacted: 'Contacted', discovery_scheduled: 'Discovery Scheduled',
  discovery_done: 'Discovery Done', proposal_sent: 'Proposal Sent',
  negotiating: 'Negotiating', closed_won: 'Closed Won', closed_lost: 'Closed Lost',
}

const stageColors: Record<string, string> = {
  research: 'var(--text-muted)', contacted: 'var(--accent-500)', discovery_scheduled: 'var(--brand-500)',
  discovery_done: 'var(--brand-600)', proposal_sent: 'var(--warning-500)',
  negotiating: 'var(--warning-600)', closed_won: 'var(--success-500)', closed_lost: 'var(--danger-500)',
}

export default function PitchEnginePage() {
  const { pitchDeals, clients } = useAppStore()
  const active = pitchDeals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
  const won = pitchDeals.filter(d => d.stage === 'closed_won')
  const pipelineMRR = active.reduce((s, d) => s + d.estimatedMRR, 0)
  const weightedMRR = active.reduce((s, d) => s + (d.estimatedMRR * ([1,1,1,3,4,6,0,0][d.stageOrder] || 0)) / 10, 0)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Retainer Pitch Engine</h2>
          <p className="section-desc">ICP target list, pitch deck builder, and proposal pipeline management.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Active Deals</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-500)' }}>{active.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Pipeline MRR</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--warning-500)' }}>${pipelineMRR.toLocaleString()}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Weighted MRR</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-500)' }}>${Math.round(weightedMRR).toLocaleString()}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Closed Won</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success-500)' }}>{won.length}</div>
        </div>
      </div>

      {pitchDeals.sort((a, b) => a.stageOrder - b.stageOrder).map(deal => (
        <div key={deal.id} className="card" style={{ marginBottom: 10, borderLeft: `4px solid ${stageColors[deal.stage]}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{deal.company}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{deal.contact} · {deal.contactRole} · {deal.targetTier} Tier</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="tag" style={{ background: `${stageColors[deal.stage]}20`, color: stageColors[deal.stage] }}>
                {stageLabels[deal.stage]}
              </span>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4, color: 'var(--text-primary)' }}>${deal.estimatedMRR.toLocaleString()}/mo</div>
            </div>
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <strong>Next:</strong> {deal.nextStep}
          </div>
          {deal.notes && <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>{deal.notes}</div>}
        </div>
      ))}
    </div>
  )
}
