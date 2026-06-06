import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function EmailPage() {
  const { emailCampaigns, clients } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)

  const active = emailCampaigns.filter(e => e.status === 'active')
  const totalSent = emailCampaigns.reduce((s, e) => s + e.sent, 0)
  const totalOpens = emailCampaigns.reduce((s, e) => s + e.opens, 0)
  const avgOpenRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : '0.0'

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Email &amp; Lifecycle Automation</h2>
          <p className="section-desc">Newsletter campaigns, drip sequences, lifecycle automation, and retention workflows.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Total Sent</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-500)' }}>{totalSent.toLocaleString()}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Open Rate</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-500)' }}>{avgOpenRate}%</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Active</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success-500)' }}>{active.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Total Campaigns</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{emailCampaigns.length}</div>
        </div>
      </div>

      {emailCampaigns.map(cam => {
        const client = getClient(cam.clientId)
        const openRate = cam.sent > 0 ? ((cam.opens / cam.sent) * 100).toFixed(1) : '0.0'
        const clickRate = cam.sent > 0 ? ((cam.clicks / cam.sent) * 100).toFixed(1) : '0.0'

        return (
          <div key={cam.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{cam.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{client?.name || 'Unknown'} · {cam.type}</div>
              </div>
              <span className="tag" style={{
                background: cam.status === 'active' ? 'var(--success-500)20' : cam.status === 'draft' ? 'var(--warning-500)20' : 'var(--text-muted)20',
                color: cam.status === 'active' ? 'var(--success-500)' : cam.status === 'draft' ? 'var(--warning-500)' : 'var(--text-muted)',
              }}>
                {cam.status === 'active' ? '🟢 Active' : cam.status === 'draft' ? '⚪ Draft' : cam.status === 'paused' ? '🟡 Paused' : '⚫ Completed'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 8, fontSize: 12 }}>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Sent</div><div style={{ fontWeight: 600 }}>{cam.sent.toLocaleString()}</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Open Rate</div><div style={{ fontWeight: 600 }}>{openRate}%</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Click Rate</div><div style={{ fontWeight: 600 }}>{clickRate}%</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Bounces</div><div style={{ fontWeight: 600, color: cam.bounces > 20 ? 'var(--danger-500)' : 'var(--text-muted)' }}>{cam.bounces}</div></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
