import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { Client } from '../types'

// ─── Tier definitions as a priced data object ────────────────────────
export const RETAINER_TIERS = {
  Foundation: { min: 1500, max: 3000, scope: ['Social (3/wk)', 'Basic SEO', 'Content (4/mo)', 'Monthly Report'], color: 'var(--warning-500)' },
  Growth: { min: 4000, max: 6000, scope: ['Social (5/wk)', 'Advanced SEO', 'Content (8/mo)', 'Paid Media (1 platform)', 'Email Automation', 'Dedicated AM', 'Monthly Strategy Review'], color: 'var(--brand-500)' },
  Scale: { min: 7000, max: 10000, scope: ['Social (daily + ads)', 'Technical SEO', 'Content (16/mo)', 'Paid Media (3+ platforms)', 'Full Lifecycle Email', 'Dedicated AM', 'Monthly Strategy Review', 'Quarterly Business Review', 'Full Creative Studio'], color: 'var(--accent-500)' },
} as const

export default function PricingPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Pricing & Proposal Templates</h2>
          <p className="section-desc">Foundation · Growth · Scale — the three retainer tiers with full scope definitions and pricing rules.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        {(Object.entries(RETAINER_TIERS) as [keyof typeof RETAINER_TIERS, typeof RETAINER_TIERS['Foundation']][]).map(([tier, data]) => (
          <div
            key={tier}
            onClick={() => setSelected(selected === tier ? null : tier)}
            className="card"
            style={{
              flex: '1 1 220px',
              cursor: 'pointer',
              borderLeft: `4px solid ${data.color}`,
              borderColor: selected === tier ? data.color : 'var(--border)',
              transition: 'border-color 0.15s',
            }}
          >
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

      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Pricing Rules</h3>
        <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2 }}>
          <li><strong>Foundation</strong> — Flat rate at the agreed MRR. No overage billing. Upsell path: add a paid media channel → Growth tier.</li>
          <li><strong>Growth</strong> — MRR is locked for 90 days. Additional ad spend beyond $2K/mo is billed at cost + 15% management fee.</li>
          <li><strong>Scale</strong> — MRR locked for 180 days. Includes unlimited revisions within scope. Ad spend cost + 10% management fee.</li>
          <li><strong>Annual contracts</strong> — 10% discount on monthly rate if prepaid annually.</li>
          <li><strong>Rate increases</strong> — 5–8% YoY increase built into renewal terms for Growth and Scale tiers.</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Proposal Template</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Every proposal includes: Executive Summary → Current State Audit → Recommended Tier & Rationale → Scope of Work → Timeline → Pricing & Terms → Next Steps. 
          The SOW Builder below generates the actual contract deliverable.
        </p>
      </div>
    </div>
  )
}
