import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function PaidMediaPage() {
  const { campaigns, clients } = useAppStore()

  const getClient = (id: string) => clients.find(c => c.id === id)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Paid Media Manager</h2>
          <p className="section-desc">Ad account audits, campaign tracking, budget pacing, and attribution.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'active').length, color: 'var(--success-500)' },
          { label: 'Total Budget', value: `$${campaigns.reduce((s, c) => s + c.budget, 0).toLocaleString()}`, color: 'var(--brand-500)' },
          { label: 'Total Spent', value: `$${campaigns.reduce((s, c) => s + c.spent, 0).toLocaleString()}`, color: 'var(--accent-500)' },
          { label: 'Total Conversions', value: campaigns.reduce((s, c) => s + c.conversions, 0).toLocaleString(), color: 'var(--success-500)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{stat.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {campaigns.map(cam => {
        const client = getClient(cam.clientId)
        const ctr = cam.impressions > 0 ? ((cam.clicks / cam.impressions) * 100).toFixed(2) : '0.00'
        const cpa = cam.conversions > 0 ? Math.round(cam.spent / cam.conversions) : 0
        const pacing = cam.budget > 0 ? Math.round((cam.spent / cam.budget) * 100) : 0

        return (
          <div key={cam.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{cam.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{client?.name || 'Unknown'} · {cam.platform}</div>
              </div>
              <span className="tag" style={{
                background: cam.status === 'active' ? 'var(--success-500)20' : cam.status === 'paused' ? 'var(--warning-500)20' : 'var(--text-muted)20',
                color: cam.status === 'active' ? 'var(--success-500)' : cam.status === 'paused' ? 'var(--warning-500)' : 'var(--text-muted)',
              }}>
                {cam.status === 'active' ? '🟢 Active' : cam.status === 'paused' ? '🟡 Paused' : cam.status === 'draft' ? '⚪ Draft' : '⚫ Completed'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 10, fontSize: 12 }}>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Budget</div><div style={{ fontWeight: 600 }}>${cam.budget.toLocaleString()}</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Spent</div><div style={{ fontWeight: 600 }}>${cam.spent.toLocaleString()}</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>CTR</div><div style={{ fontWeight: 600 }}>{ctr}%</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>CPA</div><div style={{ fontWeight: 600 }}>${cpa}</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Conv.</div><div style={{ fontWeight: 600 }}>{cam.conversions}</div></div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>
                <span>Budget Pacing</span><span>{pacing}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(pacing, 100)}%`, height: '100%', borderRadius: 2, background: pacing > 80 ? 'var(--warning-500)' : pacing > 100 ? 'var(--danger-500)' : 'var(--brand-500)' }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{cam.notes}</div>
          </div>
        )
      })}
    </div>
  )
}
