import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function DiscoveryCallPage() {
  const { discoveryCalls, pitchDeals } = useAppStore()

  const getDeal = (company: string) => pitchDeals.find(d => d.company === company)

  const upcoming = discoveryCalls.filter(d => d.status === 'scheduled')
  const completed = discoveryCalls.filter(d => d.status === 'completed')

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Discovery Call Orchestrator</h2>
          <p className="section-desc">Call structure, qualification scoring, and intake management.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Total Calls</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-500)' }}>{discoveryCalls.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Upcoming</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-500)' }}>{upcoming.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Completed</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success-500)' }}>{completed.length}</div>
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Upcoming Calls</h3>
      {upcoming.map(call => (
        <div key={call.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{call.company}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{call.contact} · {call.duration}min call</div>
            </div>
            <span className="tag" style={{ background: 'var(--brand-500)20', color: 'var(--brand-500)' }}>
              📅 {new Date(call.scheduledAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}

      <h3 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 10px' }}>Completed Calls</h3>
      {completed.map(call => {
        const deal = getDeal(call.company)
        return (
          <div key={call.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{call.company}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{call.contact} · {new Date(call.scheduledAt).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: call.qualificationScore >= 70 ? 'var(--success-500)' : call.qualificationScore >= 40 ? 'var(--warning-500)' : 'var(--danger-500)' }}>
                  {call.qualificationScore}/100
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{call.decisionMaker ? '✅ Decision Maker' : '❌ Not DM'}</div>
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              <strong>Needs:</strong> {call.needsIdentified.join(', ')}
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              <span>💰 {call.budgetRange}</span>
              <span>⏱️ {call.timeline}</span>
            </div>
            {call.notes && <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>{call.notes}</div>}
          </div>
        )
      })}
    </div>
  )
}
