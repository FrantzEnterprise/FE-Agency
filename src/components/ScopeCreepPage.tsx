import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const impactLabels: Record<string, string> = { minor: 'Minor ⚡', moderate: 'Moderate ⚡⚡', major: 'Major ⚡⚡⚡' }
const impactColors: Record<string, string> = { minor: 'var(--warning-500)', moderate: 'var(--accent-500)', major: 'var(--danger-500)' }

const statusLabels: Record<string, string> = {
  detected: 'Detected', triaged: 'Triaged', amendment_drafted: 'Amendment Drafted',
  amendment_sent: 'Amendment Sent', resolved: 'Resolved',
}
const statusColors: Record<string, string> = {
  detected: 'var(--danger-500)', triaged: 'var(--warning-500)', amendment_drafted: 'var(--brand-500)',
  amendment_sent: 'var(--accent-500)', resolved: 'var(--success-500)',
}

export default function ScopeCreepPage() {
  const { scopeChanges, clients } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const active = scopeChanges.filter(s => s.status !== 'resolved')

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Scope Creep Recovery</h2>
          <p className="section-desc">Detect scope drift, triage impact, draft amendments, and protect margin.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Active Escalations</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--danger-500)' }}>{active.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Resolved</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success-500)' }}>{scopeChanges.filter(s => s.status === 'resolved').length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>At Risk MRR</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--warning-500)' }}>${scopeChanges.reduce((s, ch) => s + ch.mrrImpact, 0)}/mo</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Total Changes</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-500)' }}>{scopeChanges.length}</div>
        </div>
      </div>

      {scopeChanges.map(change => {
        const client = getClient(change.clientId)
        return (
          <div key={change.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{change.description}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{client?.name || 'Unknown'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className="tag" style={{ background: `${impactColors[change.impact]}20`, color: impactColors[change.impact] }}>
                    {impactLabels[change.impact]}
                  </span>
                  <span className="tag" style={{ background: `${statusColors[change.status]}20`, color: statusColors[change.status] }}>
                    {statusLabels[change.status]}
                  </span>
                </div>
                {change.mrrImpact > 0 && (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
                    +${change.mrrImpact}/mo
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>Detected: {new Date(change.detectedAt).toLocaleDateString()}</span>
              {change.resolvedAt && <span>Resolved: {new Date(change.resolvedAt).toLocaleDateString()}</span>}
            </div>
            {change.notes && <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-secondary)' }}>{change.notes}</div>}
          </div>
        )
      })}
    </div>
  )
}
