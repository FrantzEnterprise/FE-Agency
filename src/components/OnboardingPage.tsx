import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const ONBOARDING_STEPS = [
  { phase: 'week1', day: 1,  name: 'Kickoff call', desc: 'Intro call with client stakeholders. Set expectations, gather access, schedule audits.' },
  { phase: 'week1', day: 1,  name: 'Send welcome package', desc: 'Brand voice questionnaire, analytics access request, asset inventory template.' },
  { phase: 'week1', day: 3,  name: 'Platform audits', desc: 'Audit existing ad accounts, analytics, social profiles, website, email setup.' },
  { phase: 'week1', day: 5,  name: 'Brand voice capture', desc: 'Review completed questionnaire, conduct tone interview, document brand guidelines.' },
  { phase: 'week1', day: 7,  name: 'Analytics baseline', desc: 'Set up tracking, tag manager, conversion goals. Document current KPIs.' },
  { phase: 'week2', day: 8,  name: 'Competitive analysis', desc: 'Benchmark against top 3 competitors. Document positioning and gaps.' },
  { phase: 'week2', day: 10, name: 'Content audit', desc: 'Review existing assets. Tag and organize by channel, format, and performance.' },
  { phase: 'week2', day: 12, name: 'Strategy brief', desc: 'Draft initial strategy: goals, channels, content themes, success metrics.' },
  { phase: 'week2', day: 14, name: 'Cycle 1 plan sign-off', desc: 'Present onboarding deliverable pack. Get sign-off on strategy. Begin first run cycle.' },
]

export default function OnboardingPage() {
  const { clients, clientTasks, addClientTask, updateClientTask } = useAppStore()
  const [selectedClient, setSelectedClient] = useState('')
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const client = clients.find(c => c.id === selectedClient)
  const tasks = clientTasks.filter(t => t.clientId === selectedClient && t.phase === 'plan')
  const isOnboarding = client?.status === 'onboarding'

  const handleToggle = (stepName: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepName)) next.delete(stepName)
      else next.add(stepName)
      return next
    })
    // Create/find the client task
    const existing = tasks.find(t => t.name === stepName)
    if (existing) {
      updateClientTask(existing.id, { status: completedSteps.has(stepName) ? 'pending' : 'completed' })
    } else if (client) {
      addClientTask({
        clientId: client.id,
        name: stepName,
        dueDate: new Date().toISOString().slice(0, 10),
        status: 'pending',
        assignee: 'account-manager',
        phase: 'plan',
      })
    }
  }

  const week1 = ONBOARDING_STEPS.filter(s => s.phase === 'week1')
  const week2 = ONBOARDING_STEPS.filter(s => s.phase === 'week2')
  const completedCount = completedSteps.size

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Client Onboarding Sequence</h2>
          <p className="section-desc">14-day onboarding sequence: audits, brand voice, analytics baseline, kickoff.</p>
        </div>
      </div>

      <div className="card">
        <div className="form-field" style={{ maxWidth: 400 }}>
          <label>Client</label>
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
            <option value="">— Select client —</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.status}){c.status === 'onboarding' ? ' ⭐' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {client && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            <div className="card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Progress</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-500)' }}>{completedCount}/14</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Status</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: isOnboarding ? 'var(--warning-500)' : 'var(--success-500)' }}>{isOnboarding ? 'Onboarding' : client.status}</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Tier</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-500)' }}>{client.retainerTier}</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>MRR</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success-500)' }}>${client.mrr.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-tertiary)', marginBottom: 20, overflow: 'hidden' }}>
            <div style={{
              width: `${(completedCount / 14) * 100}%`, height: '100%',
              borderRadius: 4,
              background: 'linear-gradient(90deg, var(--brand-500), var(--accent-500))',
              transition: 'width 0.5s',
            }} />
          </div>

          {/* Week 1 */}
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Week 1 — Foundations</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Day 1–7: Kickoff, audits, brand capture, analytics baseline</p>
            {week1.map(step => (
              <label key={step.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '1px solid var(--border)',
                cursor: 'pointer', opacity: completedSteps.has(step.name) ? 0.6 : 1,
              }}>
                <input
                  type="checkbox"
                  checked={completedSteps.has(step.name)}
                  onChange={() => handleToggle(step.name)}
                  style={{ width: 16, height: 16, accentColor: 'var(--brand-500)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, textDecoration: completedSteps.has(step.name) ? 'line-through' : 'none' }}>
                    {step.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Day {step.day} — {step.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {/* Week 2 */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Week 2 — Deliver</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Day 8–14: Competitive analysis, content audit, strategy brief, sign-off</p>
            {week2.map(step => (
              <label key={step.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '1px solid var(--border)',
                cursor: 'pointer', opacity: completedSteps.has(step.name) ? 0.6 : 1,
              }}>
                <input
                  type="checkbox"
                  checked={completedSteps.has(step.name)}
                  onChange={() => handleToggle(step.name)}
                  style={{ width: 16, height: 16, accentColor: 'var(--brand-500)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, textDecoration: completedSteps.has(step.name) ? 'line-through' : 'none' }}>
                    {step.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Day {step.day} — {step.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {completedCount === ONBOARDING_STEPS.length && (
            <div className="card" style={{ marginTop: 16, borderLeft: '4px solid var(--success-500)', background: 'var(--success-500)10' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success-500)', marginBottom: 4 }}>✅ Onboarding Complete</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                All 14 steps completed. {client.name} is ready for Cycle 1. Start the first Plan → Run → Report cycle.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
