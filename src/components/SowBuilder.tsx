import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { RETAINER_TIERS } from './PricingPage'

export default function SowBuilder() {
  const { clients } = useAppStore()
  const [clientId, setClientId] = useState('')
  const [tier, setTier] = useState<'Foundation' | 'Growth' | 'Scale'>('Foundation')
  const [mrr, setMrr] = useState(3000)
  const [deliverables, setDeliverables] = useState('')
  const [timeline, setTimeline] = useState('')
  const [terms, setTerms] = useState('')
  const [generated, setGenerated] = useState(false)

  const client = clients.find(c => c.id === clientId)

  const handleGenerate = () => {
    setGenerated(true)
  }

  const handleCopy = () => {
    const text = `STATEMENT OF WORK
Client: ${client?.name || 'N/A'}
Tier: ${tier}
Monthly Retainer: $${mrr.toLocaleString()}
Timeline: ${timeline || 'Monthly retainer, 90-day initial term'}
Deliverables:
${deliverables}
Terms:
${terms || 'Standard retainer terms. 30-day cancellation notice.'}
${RETAINER_TIERS[tier].scope.map(s => `- ${s}`).join('\n')}`
    navigator.clipboard.writeText(text)
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">SOW Builder</h2>
          <p className="section-desc">Generate Statements of Work with deliverables, timeline, pricing, and terms.</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-field">
            <label>Client</label>
            <select value={clientId} onChange={e => {
              const c = clients.find(c => c.id === e.target.value)
              setClientId(e.target.value)
              if (c) {
                setTier(c.retainerTier)
                setMrr(c.mrr)
              }
            }}>
              <option value="">— Select client —</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.retainerTier})</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Tier</label>
            <select value={tier} onChange={e => setTier(e.target.value as any)}>
              <option value="Foundation">Foundation</option>
              <option value="Growth">Growth</option>
              <option value="Scale">Scale</option>
            </select>
          </div>
          <div className="form-field">
            <label>Monthly Retainer ($)</label>
            <input type="number" value={mrr} onChange={e => setMrr(Number(e.target.value))} />
          </div>
          <div className="form-field">
            <label>Timeline</label>
            <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} placeholder="e.g. Monthly retainer, 90-day initial term" />
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label>Deliverables</label>
            <textarea rows={4} value={deliverables} onChange={e => setDeliverables(e.target.value)} placeholder="List key deliverables for this engagement..." />
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label>Custom Terms</label>
            <textarea rows={3} value={terms} onChange={e => setTerms(e.target.value)} placeholder="Payment terms, cancellation policy, special clauses..." />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleGenerate}>Generate SOW</button>
          {generated && <button className="btn" onClick={handleCopy}>Copy to Clipboard</button>}
        </div>
      </div>

      {generated && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Statement of Work</h3>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {`STATEMENT OF WORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client: ${client?.name || 'N/A'} (${client?.industry || 'N/A'})
Tier: ${tier}
Monthly Retainer: $${mrr.toLocaleString()}
Timeline: ${timeline || 'Monthly retainer, 90-day initial term'}
Start Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

━━━━ SCOPE OF WORK ━━━━━━━━━━━━━━━━━━━━
${deliverables || RETAINER_TIERS[tier].scope.join('\n')}

━━━━ TERMS ━━━━━━━━━━━━━━━━━━━━━━━━━━━
${terms || 'Standard retainer terms. 30-day cancellation notice required in writing. Invoiced monthly, net-15.'}

━━━━ SIGNATURES ━━━━━━━━━━━━━━━━━━━━━━━
Client: ___________________________ Date: ________
Frantz Enterprise: ________________ Date: ________`}
          </div>
        </div>
      )}
    </div>
  )
}
