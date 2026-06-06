import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const RECOVERY_STEPS = [
  { phase: 'immediate', label: '24h', name: 'Internal triage', desc: 'Gather account team. Identify root cause: scope creep, missed deliverables, communication breakdown, or pricing dissatisfaction.' },
  { phase: 'immediate', label: '48h', name: 'Executive outreach', desc: 'CEO or Head of Accounts sends personal note to client. Acknowledge issue. Schedule rescue call.' },
  { phase: 'immediate', label: '72h', name: 'Rescue call', desc: 'Listen-first call. Document all grievances. Do NOT pitch solutions during this call. Commit to a written recovery plan within 48 hours.' },
  { phase: 'plan', label: 'Week 1', name: 'Draft recovery plan', desc: 'Concrete milestones, adjusted scope if needed, timeline for each fix, responsible owner per item.' },
  { phase: 'plan', label: 'Week 1', name: 'Client reviews plan', desc: 'Send recovery plan for client review. Get written approval before executing.' },
  { phase: 'execute', label: 'Week 2', name: 'Execute recovery milestones', desc: 'Deliver on first 3 milestones. Over-communicate progress: daily updates for the first week.' },
  { phase: 'execute', label: 'Week 2', name: 'Mid-point check', desc: 'Account Manager checks in: is sentiment improving? Any new issues? Adjust plan as needed.' },
  { phase: 'stabilize', label: 'Week 3', name: 'Stabilization', desc: 'Return to normal cadence. First post-recovery monthly report should show improved health score.' },
  { phase: 'stabilize', label: 'Week 4', name: 'Renewal conversation', desc: 'If client is green again, initiate renewal discussion. Offer loyalty discount or added value as goodwill.' },
]

export default function ChurnPreventionPage() {
  const { clients, updateClient } = useAppStore()
  const [selectedClient, setSelectedClient] = useState('')
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const client = clients.find(c => c.id === selectedClient)
  const isRed = client?.health === 'red'
  const isYellow = client?.health === 'yellow'

  const handleToggle = (name: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const immediate = RECOVERY_STEPS.filter(s => s.phase === 'immediate')
  const plan = RECOVERY_STEPS.filter(s => s.phase === 'plan')
  const execute = RECOVERY_STEPS.filter(s => s.phase === 'execute')
  const stabilize = RECOVERY_STEPS.filter(s => s.phase === 'stabilize')

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Churn Prevention Playbook</h2>
          <p className="section-desc">Red-status recovery plans, renewal scripts, and account rescue sequences.</p>
        </div>
      </div>

      <div className="card">
        <div className="form-field" style={{ maxWidth: 400 }}>
          <label>Client</label>
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
            <option value="">— Select client —</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.health.toUpperCase()} · ${c.mrr.toLocaleString()}/mo
                {c.health === 'red' ? ' ⚠️' : c.health === 'yellow' ? ' ⚡' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {client && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div className="card" style={{ borderLeft: `4px solid var(--danger-500)`, textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Health</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: client.health === 'green' ? 'var(--success-500)' : client.health === 'yellow' ? 'var(--warning-500)' : 'var(--danger-500)' }}>
              {client.health.toUpperCase()}
            </div>
          </div>
          <div className="card" style={{ borderLeft: `4px solid var(--warning-500)`, textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Renewal</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{client.nextRenewal}</div>
          </div>
        </div>
      )}

      {client && isRed && (
        <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid var(--danger-500)', background: 'var(--danger-500)08' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger-500)', marginBottom: 4 }}>⚠️ Critical — Act Now</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {client.name} is at risk. Follow the recovery sequence below. Start with immediate triage.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 8, fontSize: 12 }} onClick={() => updateClient(client.id, { status: 'active' })}>
            Mark as Recovered
          </button>
        </div>
      )}

      {client && isYellow && (
        <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid var(--warning-500)', background: 'var(--warning-500)08' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--warning-500)', marginBottom: 4 }}>⚡ Needs Attention</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {client.name} is trending down. Run a check-in call before it escalates to red. Review scope and delivery velocity.
          </p>
        </div>
      )}

      {client && (
        <>
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Immediate (First 72 Hours)</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Time-critical actions to stabilize the account</p>
            {immediate.map(step => (
              <label key={step.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '1px solid var(--border)',
                cursor: 'pointer', opacity: completedSteps.has(step.name) ? 0.6 : 1,
              }}>
                <input type="checkbox" checked={completedSteps.has(step.name)} onChange={() => handleToggle(step.name)}
                  style={{ width: 16, height: 16, accentColor: 'var(--danger-500)' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--danger-500)', background: 'var(--danger-500)15', padding: '2px 6px', borderRadius: 4 }}>{step.label}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, textDecoration: completedSteps.has(step.name) ? 'line-through' : 'none' }}>{step.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Plan & Execute</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Week 1–2: Draft, approve, and execute the recovery plan</p>
            {[...plan, ...execute].map(step => (
              <label key={step.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '1px solid var(--border)',
                cursor: 'pointer', opacity: completedSteps.has(step.name) ? 0.6 : 1,
              }}>
                <input type="checkbox" checked={completedSteps.has(step.name)} onChange={() => handleToggle(step.name)}
                  style={{ width: 16, height: 16, accentColor: 'var(--warning-500)' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--warning-500)', background: 'var(--warning-500)15', padding: '2px 6px', borderRadius: 4 }}>{step.label}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, textDecoration: completedSteps.has(step.name) ? 'line-through' : 'none' }}>{step.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Stabilize & Renew</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Week 3–4: Return to normal cadence, initiate renewal</p>
            {stabilize.map(step => (
              <label key={step.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: '1px solid var(--border)',
                cursor: 'pointer', opacity: completedSteps.has(step.name) ? 0.6 : 1,
              }}>
                <input type="checkbox" checked={completedSteps.has(step.name)} onChange={() => handleToggle(step.name)}
                  style={{ width: 16, height: 16, accentColor: 'var(--success-500)' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--success-500)', background: 'var(--success-500)15', padding: '2px 6px', borderRadius: 4 }}>{step.label}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, textDecoration: completedSteps.has(step.name) ? 'line-through' : 'none' }}>{step.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </>
      )}

      {!client && (
        <div className="card">
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
            Select a client to view or run the churn prevention playbook.
          </p>
        </div>
      )}
    </div>
  )
}
