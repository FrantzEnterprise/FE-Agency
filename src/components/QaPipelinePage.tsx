import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { CreativeAsset } from '../types'

const qaChecklist = [
  { id: 'brand-colors', label: 'Brand colors match guidelines' },
  { id: 'brand-fonts', label: 'Typography matches brand fonts' },
  { id: 'logo-usage', label: 'Logo placement and sizing correct' },
  { id: 'spelling', label: 'No spelling or grammar errors' },
  { id: 'scope-match', label: 'Matches SOW deliverables' },
  { id: 'client-format', label: 'Correct format/dimensions for channel' },
  { id: 'file-version', label: 'Correct file version delivered' },
]

export default function QaPipelinePage() {
  const { creativeAssets, agents } = useAppStore()
  const [selectedAsset, setSelectedAsset] = useState('')
  const [checks, setChecks] = useState<Record<string, boolean>>({})

  const qaAssets = creativeAssets.filter(a => a.status === 'qa' || a.status === 'revisions')
  const asset = creativeAssets.find(a => a.id === selectedAsset)
  const passedChecks = Object.values(checks).filter(Boolean).length
  const allPassed = qaChecklist.every(c => checks[c.id])

  const handlePass = () => {
    if (!asset) return
    const { updateCreativeAsset } = useAppStore.getState()
    updateCreativeAsset(asset.id, { status: 'client_review', version: asset.version + 1 })
    setSelectedAsset('')
    setChecks({})
  }

  const handleFail = () => {
    if (!asset) return
    const { updateCreativeAsset } = useAppStore.getState()
    updateCreativeAsset(asset.id, { status: 'revisions', version: asset.version + 1 })
    setSelectedAsset('')
    setChecks({})
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Creative QA Pipeline</h2>
          <p className="section-desc">QA for design, copy, and video: brand fidelity, scope check, client readiness gate.</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Assets Awaiting QA ({qaAssets.length})</h3>
        {qaAssets.map(a => (
          <div key={a.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 0', borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
            background: selectedAsset === a.id ? 'var(--bg-tertiary)' : 'transparent',
          }} onClick={() => { setSelectedAsset(a.id); setChecks({}) }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>v{a.version} · {a.assignee} · {a.status === 'revisions' ? '🔄 Revisions' : '✅ Ready'}</div>
            </div>
            <span className="tag" style={{ background: a.status === 'qa' ? 'var(--success-500)20' : 'var(--danger-500)20', color: a.status === 'qa' ? 'var(--success-500)' : 'var(--danger-500)' }}>
              {a.status === 'qa' ? 'Pass' : 'Revisions'}
            </span>
          </div>
        ))}
        {qaAssets.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 16 }}>No assets pending QA.</p>
        )}
      </div>

      {asset && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>QA Checklist — {asset.name}</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Review each item before passing to client review</p>

          {qaChecklist.map(c => (
            <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!checks[c.id]} onChange={() => setChecks(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                style={{ width: 16, height: 16, accentColor: 'var(--brand-500)' }} />
              <span>{c.label}</span>
            </label>
          ))}

          <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', margin: '12px 0', overflow: 'hidden' }}>
            <div style={{ width: `${(passedChecks / qaChecklist.length) * 100}%`, height: '100%', borderRadius: 3, background: allPassed ? 'var(--success-500)' : 'var(--warning-500)', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{passedChecks}/{qaChecklist.length} passed</div>

          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button className="btn btn-primary" disabled={!allPassed} onClick={handlePass}>Approve &amp; Send to Client</button>
            <button className="btn" style={{ borderColor: 'var(--danger-500)', color: 'var(--danger-500)' }} onClick={handleFail}>Send Back for Revisions</button>
          </div>
        </div>
      )}
    </div>
  )
}
