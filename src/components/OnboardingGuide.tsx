import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { X } from 'lucide-react'

const steps = [
  {
    title: '👋 Welcome to Frantz Enterprise',
    desc: 'Your all-in-one agency operations platform. Manage clients, projects, campaigns, content, and reporting — all in one place.',
  },
  {
    title: '📋 Set Up Your Clients',
    desc: 'Start by adding your first client in the Clients page. Track MRR, health status, and retainer tiers. Foundation ($2K/mo), Growth ($4-6K), or Scale ($7-10K).',
  },
  {
    title: '📊 Build Your Pipeline',
    desc: 'Track deals through every stage — from research to closed-won. Automate discovery calls, proposals, and follow-ups from the Pipeline page.',
  },
  {
    title: '🎨 Deliver Creative Work',
    desc: 'Use Creative Studio to manage assets from brief → production → QA → client review → delivery. The QA Pipeline catches issues before they reach clients.',
  },
  {
    title: '📈 Report & Grow',
    desc: 'Monthly client reports, KPI dashboards, revenue charts — generate printable PDFs from the Client Reports page. Use data to drive upsells and renewals.',
  },
  {
    title: '🔗 Connect Your Tools',
    desc: 'Go to Settings → Integrations to connect email sending (SendGrid/Mailgun/Sendiio), social platforms, and analytics tools.',
  },
  {
    title: '⚡ Pro Tips',
    desc: '• Press Cmd+K to search anything\n• Dark mode persists across sessions\n• Data auto-saves to your browser\n• Export/Import data for backups\n• Share Client Portal links for client access',
  },
]

export default function OnboardingGuide() {
  const [dismissed, setDismissed] = useState(false)
  const { clients } = useAppStore()

  // Auto-dismiss if clients exist and user has content
  if (dismissed || clients.length >= 3) return null

  const [step, setStep] = useState(0)

  const st = steps[step]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        right: 24,
        width: 340,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        zIndex: 200,
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
          {st.title}
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 4, display: 'flex',
            flexShrink: 0,
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '12px 16px 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
        {st.desc}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i === step ? 'var(--brand-500)' : 'var(--text-muted)',
                opacity: i === step ? 1 : 0.3,
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setDismissed(true)}
          >
            Dismiss
          </button>
          <button
            className={`btn btn-sm ${step < steps.length - 1 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              if (step < steps.length - 1) setStep(s => s + 1)
              else setDismissed(true)
            }}
          >
            {step < steps.length - 1 ? 'Next →' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  )
}
