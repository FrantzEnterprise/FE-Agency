import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const statusColors: Record<string, string> = {
  brief: 'var(--text-muted)',
  in_progress: 'var(--brand-500)',
  qa: 'var(--warning-500)',
  client_review: 'var(--accent-500)',
  approved: 'var(--success-500)',
  revisions: 'var(--danger-500)',
  delivered: 'var(--success-500)',
}

const statusLabels: Record<string, string> = {
  brief: 'Brief', in_progress: 'In Progress', qa: 'QA', client_review: 'Client Review',
  approved: 'Approved', revisions: 'Revisions', delivered: 'Delivered',
}

export default function CreativeStudioPage() {
  const { clients, creativeAssets } = useAppStore()

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || id

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Creative Delivery Studio</h2>
          <p className="section-desc">Track creative assets through production: brief → production → QA → client review → delivery.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, marginBottom: 16 }}>
        {Object.entries(statusLabels).map(([key, label]) => (
          <div key={key} className="card" style={{ textAlign: 'center', padding: 12, borderTop: `3px solid ${statusColors[key]}` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: statusColors[key] }}>{creativeAssets.filter(a => a.status === key).length}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {creativeAssets.map(asset => (
        <div key={asset.id} className="card" style={{ marginBottom: 10, borderLeft: `4px solid ${statusColors[asset.status]}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{asset.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{asset.description} · {getClientName(asset.clientId)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="tag" style={{ background: `${statusColors[asset.status]}20`, color: statusColors[asset.status] }}>
                {statusLabels[asset.status]}
              </span>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>v{asset.version} · {asset.assignee}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>Due: {new Date(asset.dueDate).toLocaleDateString()}</span>
            <span>Created: {new Date(asset.createdAt).toLocaleDateString()}</span>
            <span>Type: {asset.type}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
