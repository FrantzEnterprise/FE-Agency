import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function ClientReportingPage() {
  const { clients, revenue, clientTasks } = useAppStore()
  const [selectedClient, setSelectedClient] = useState('')
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7))

  const client = clients.find(c => c.id === selectedClient)
  const tasks = clientTasks.filter(t => t.clientId === selectedClient)
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const overdueTasks = tasks.filter(t => t.status === 'overdue')
  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completionRate = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Client Reporting Pack</h2>
          <p className="section-desc">Monthly report template: results vs objectives, KPIs, channel performance.</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 14, alignItems: 'end', flexWrap: 'wrap' }}>
          <div className="form-field" style={{ flex: 1, minWidth: 200 }}>
            <label>Client</label>
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
              <option value="">— Select client —</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field" style={{ flex: 1, minWidth: 160 }}>
            <label>Report Month</label>
            <input type="month" value={reportMonth} onChange={e => setReportMonth(e.target.value)} />
          </div>
        </div>
      </div>

      {client && (
        <>
          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'MRR', value: `$${client.mrr.toLocaleString()}`, color: 'var(--brand-500)' },
              { label: 'Tier', value: client.retainerTier, color: 'var(--accent-500)' },
              { label: 'Health', value: client.health.toUpperCase(), color: client.health === 'green' ? 'var(--success-500)' : client.health === 'yellow' ? 'var(--warning-500)' : 'var(--danger-500)' },
              { label: 'Task Completion', value: `${completionRate}%`, color: completionRate >= 80 ? 'var(--success-500)' : completionRate >= 50 ? 'var(--warning-500)' : 'var(--danger-500)' },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Task breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Cycle Tasks</h3>
              <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                <div><span style={{ fontWeight: 700, color: 'var(--success-500)' }}>{completedTasks.length}</span> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>done</span></div>
                <div><span style={{ fontWeight: 700, color: 'var(--warning-500)' }}>{pendingTasks.length}</span> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>pending</span></div>
                <div><span style={{ fontWeight: 700, color: 'var(--danger-500)' }}>{overdueTasks.length}</span> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>overdue</span></div>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: `${completionRate}%`, height: '100%', borderRadius: 3, background: 'var(--success-500)', transition: 'width 0.3s' }} />
              </div>

              {tasks.filter(t => t.status !== 'completed').length > 0 && (
                <div style={{ marginTop: 10 }}>
                  {tasks.filter(t => t.status !== 'completed').slice(0, 4).map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                      <span>{t.name}</span>
                      <span style={{ color: t.status === 'overdue' ? 'var(--danger-500)' : 'var(--text-muted)' }}>
                        {t.status === 'overdue' ? '⚠ Overdue' : t.status === 'pending' ? `Due: ${new Date(t.dueDate).toLocaleDateString()}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Revenue Context</h3>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2 }}>
                <div><strong>Monthly:</strong> ${client.mrr.toLocaleString()}</div>
                <div><strong>Annualized:</strong> ${(client.mrr * 12).toLocaleString()}</div>
                <div><strong>Since:</strong> {client.since}</div>
                <div><strong>Last QBR:</strong> {client.lastQBR}</div>
                <div><strong>Next Renewal:</strong> {client.nextRenewal}</div>
              </div>
            </div>
          </div>

          {/* Report preview */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Monthly Report Preview — {reportMonth}</h3>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2 }}>
              <p><strong>Client:</strong> {client.name}</p>
              <p><strong>Report Period:</strong> {reportMonth}</p>
              <p><strong>Account Health:</strong> <span style={{ color: client.health === 'green' ? 'var(--success-500)' : client.health === 'yellow' ? 'var(--warning-500)' : 'var(--danger-500)', fontWeight: 700 }}>{client.health.toUpperCase()}</span></p>
              <p><strong>Tasks Completed:</strong> {completedTasks.length}/{tasks.length} ({completionRate}%)</p>
              <p><strong>Open Items:</strong> {pendingTasks.length + overdueTasks.length}</p>
              <p><strong>Monthly Investment:</strong> ${client.mrr.toLocaleString()}</p>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />
              <p style={{ color: 'var(--text-muted)' }}>Full report with channel performance, KPI tracking, and next cycle plan to be attached as supplement.</p>
            </div>
            <button className="btn" style={{ marginTop: 12 }} onClick={() => {
              const text = `MONTHLY REPORT — ${client.name}
Period: ${reportMonth}
Health: ${client.health.toUpperCase()}
Tasks: ${completedTasks.length}/${tasks.length} (${completionRate}%)
MRR: $${client.mrr.toLocaleString()}
Open Items: ${pendingTasks.length + overdueTasks.length}
Next Steps: Recap call to be scheduled.`
              navigator.clipboard.writeText(text)
            }}>
              Copy Report Summary
            </button>
          </div>
        </>
      )}
    </div>
  )
}
