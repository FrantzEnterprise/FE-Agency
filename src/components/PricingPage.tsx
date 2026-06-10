import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export const RETAINER_TIERS = {
  Foundation: { min: 1500, max: 3000, scope: ['Social (3/wk)', 'Basic SEO', 'Content (4/mo)', 'Monthly Report'], color: 'var(--warning-500)' },
  Growth: { min: 4000, max: 6000, scope: ['Social (5/wk)', 'Advanced SEO', 'Content (8/mo)', 'Paid Media (1 platform)', 'Email Automation', 'Dedicated AM', 'Monthly Strategy Review'], color: 'var(--brand-500)' },
  Scale: { min: 7000, max: 10000, scope: ['Social (daily + ads)', 'Technical SEO', 'Content (16/mo)', 'Paid Media (3+ platforms)', 'Full Lifecycle Email', 'Dedicated AM', 'Monthly Strategy Review', 'Quarterly Business Review', 'Full Creative Studio'], color: 'var(--accent-500)' },
} as const

const ADD_ONS = [
  { name: 'Paid Media Management (per platform)', price: 750 },
  { name: 'Content Upcharge (16+ pieces/mo)', price: 500 },
  { name: 'Video Production (2 videos/mo)', price: 1200 },
  { name: 'HubSpot/CRM Management', price: 400 },
  { name: 'Conversion Rate Optimization', price: 600 },
  { name: 'Reputation Management', price: 350 },
  { name: 'Landing Page Development (per page)', price: 800 },
]

type TierKey = keyof typeof RETAINER_TIERS

export default function PricingPage() {
  const { clients, revenueHistory } = useAppStore()

  const [selected, setSelected] = useState<TierKey | null>(null)
  const [annual, setAnnual] = useState(false)
  const [addOns, setAddOns] = useState<Record<string, boolean>>({})
  const [showBuilder, setShowBuilder] = useState(false)
  const [clientId, setClientId] = useState('')
  const [discount, setDiscount] = useState(0)

  const tier = selected ? RETAINER_TIERS[selected] : null
  const basePrice = tier ? annual ? Math.round(tier.min * 12 * 0.9) : tier.min : 0
  const addOnTotal = useMemo(() => Object.entries(addOns).filter(([, v]) => v).reduce((s, [k]) => s + (ADD_ONS.find(a => a.name === k)?.price || 0), 0), [addOns])
  const discountAmt = Math.round(basePrice * (discount / 100))
  const total = basePrice + addOnTotal - discountAmt

  const clientMatches = useMemo(() => {
    if (!clientId) return null
    const client = clients.find(c => c.id === clientId)
    if (!client) return null
    const clientRev = revenueHistory.filter(r => r.clientId === clientId)
    const avgMonthly = clientRev.length > 0 ? Math.round(clientRev.reduce((s, r) => s + r.revenue, 0) / clientRev.length) : 0
    let rec: TierKey = 'Foundation'
    if (avgMonthly > 5000) rec = 'Growth'
    if (avgMonthly > 10000) rec = 'Scale'
    return { client, avgMonthly, recommended: rec }
  }, [clientId, clients, revenueHistory])

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Pricing & Proposal Builder</h2>
          <p className="section-desc">Foundation · Growth · Scale — retainer tiers, add-ons, and automated proposal generation.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowBuilder(!showBuilder)} style={{ whiteSpace: 'nowrap' }}>
          {showBuilder ? '✕ Close Builder' : '📄 Proposal Builder'}
        </button>
      </div>

      {/* ── Proposal Builder ── */}
      {showBuilder && (
        <div className="card" style={{ marginBottom: 20, padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Proposal Generator</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
            <select value={clientId} onChange={e => setClientId(e.target.value)} style={inputStyle}>
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <input type="checkbox" checked={annual} onChange={e => setAnnual(e.target.checked)} />
              Annual (10% off)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              Discount %
              <input type="number" min={0} max={50} value={discount} onChange={e => setDiscount(Number(e.target.value))} style={{ ...inputStyle, width: 60 }} />
            </label>
          </div>

          {clientMatches && (
            <div style={{ fontSize: 13, marginBottom: 12, padding: 10, background: 'var(--bg-tertiary)', borderRadius: 6 }}>
              <strong>{clientMatches.client.name}</strong> · Avg monthly revenue: <strong>${clientMatches.avgMonthly.toLocaleString()}</strong> · Recommended tier: <strong style={{ color: RETAINER_TIERS[clientMatches.recommended].color }}>{clientMatches.recommended}</strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
            {(Object.entries(RETAINER_TIERS) as [TierKey, typeof RETAINER_TIERS[TierKey]][]).map(([k, data]) => (
              <div key={k} className="card" onClick={() => setSelected(k)} style={{ cursor: 'pointer', padding: 12, flex: '1 1 180px', border: selected === k ? `2px solid ${data.color}` : '1px solid var(--border)' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{k}</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>${data.min.toLocaleString()}/mo</div>
              </div>
            ))}
          </div>

          {tier && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6, marginBottom: 12 }}>
                {ADD_ONS.map(a => (
                  <label key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!addOns[a.name]} onChange={e => setAddOns(p => ({ ...p, [a.name]: e.target.checked }))} />
                    {a.name} <span style={{ color: 'var(--text-muted)' }}>(+${a.price})</span>
                  </label>
                ))}
              </div>

              <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>
                <strong>Proposal Summary</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 8 }}>
                  <span>Base ({selected}):</span><span style={{ textAlign: 'right' }}>${basePrice.toLocaleString()}{annual ? '/yr' : '/mo'}</span>
                  <span>Add-ons:</span><span style={{ textAlign: 'right' }}>+${addOnTotal.toLocaleString()}</span>
                  {discount > 0 && <><span>Discount ({discount}%):</span><span style={{ textAlign: 'right', color: 'var(--danger-500)' }}>-${discountAmt.toLocaleString()}</span></>}
                  <span style={{ borderTop: '1px solid var(--border)', paddingTop: 4 }}><strong>Total:</strong></span>
                  <span style={{ textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: 4, fontWeight: 700, fontSize: 16 }}>
                    ${total.toLocaleString()}{annual ? '/yr' : '/mo'}
                  </span>
                </div>
              </div>
            </>
          )}

          <button className="btn btn-primary" disabled={!clientId || !selected} onClick={() => {
            const blob = new Blob([
              `PROPOSAL — ${clientMatches?.client.name || 'Client'}\n`,
              `Tier: ${selected}\n`,
              `Term: ${annual ? 'Annual' : 'Monthly'}\n`,
              `Base: $${basePrice.toLocaleString()}/mo\n`,
              `Add-ons: $${addOnTotal.toLocaleString()}\n`,
              `Total: $${total.toLocaleString()}/${annual ? 'yr' : 'mo'}\n`,
              `---\n`,
              `Generated ${new Date().toLocaleDateString()}\n`,
            ], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = `proposal-${clientMatches?.client.name || 'draft'}-${selected}.txt`
            a.click(); URL.revokeObjectURL(url)
          }} style={{ marginRight: 8 }}>📥 Download Proposal</button>
        </div>
      )}

      {/* ── Tier Cards ── */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        {(Object.entries(RETAINER_TIERS) as [TierKey, typeof RETAINER_TIERS[TierKey]][]).map(([tier, data]) => (
          <div key={tier} className="card" style={{ flex: '1 1 220px', borderLeft: `4px solid ${data.color}` }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{tier}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
              ${data.min.toLocaleString()}–${data.max.toLocaleString()}
              <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>
            </div>
            <ul style={{ marginTop: 12, paddingLeft: 16, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {data.scope.map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Pricing Rules ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Pricing Rules</h3>
          <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li><strong>Foundation</strong> — Flat rate. No overage billing.</li>
            <li><strong>Growth</strong> — MRR locked 90 days. Ad spend over $2K/mo at cost + 15%.</li>
            <li><strong>Scale</strong> — MRR locked 180 days. Unlimited in-scope revisions. Ad spend at cost + 10%.</li>
            <li><strong>Annual</strong> — 10% discount on monthly rate if prepaid.</li>
            <li><strong>Rate increase</strong> — 5–8% YoY built into Growth/Scale renewals.</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Add-on Services</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
            {ADD_ONS.map(a => (
              <div key={a.name}><span style={{ color: 'var(--text-muted)' }}>+${a.price}</span> {a.name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12,
}
