import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

function BarChart({ data, height = 120, barColor = 'var(--brand-500)', labelKey, valueKey, valuePrefix = '' }: {
  data: any[]; height?: number; barColor?: string; labelKey: string; valueKey: string; valuePrefix?: string;
}) {
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: 4, height, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
          <div title={`${d[labelKey]}: ${valuePrefix}${d[valueKey].toLocaleString()}`}
            style={{ width: '100%', maxWidth: 40, height: `${Math.max((d[valueKey] / max) * 100, 4)}%`,
              background: barColor, borderRadius: '3px 3px 0 0', transition: 'height 0.3s', minHeight: 4 }} />
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 50, textAlign: 'center' }}>
            {d[labelKey]}
          </div>
        </div>
      ))}
    </div>
  )
}

function HorizontalBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.3s' }} />
      </div>
    </div>
  )
}

export default function ClientReportingPage() {
  const { clients, revenueHistory, clientTasks, campaigns, projects, tasks, kpis, seoKeywords } = useAppStore()
  const [selectedClient, setSelectedClient] = useState('')
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7))

  const client = clients.find(c => c.id === selectedClient)
  const clientKpis = kpis.filter(k => k.clientId === selectedClient)

  const tasksForClient = useMemo(() => clientTasks.filter(t => t.clientId === selectedClient), [clientTasks, selectedClient])
  const completedTasks = tasksForClient.filter(t => t.status === 'completed')
  const pendingTasks = tasksForClient.filter(t => t.status === 'pending')
  const overdueTasks = tasksForClient.filter(t => t.status === 'overdue')
  const completionRate = tasksForClient.length ? Math.round((completedTasks.length / tasksForClient.length) * 100) : 0

  // Revenue history (agency-wide, last 12 months)
  const monthlyRevenue = useMemo(() => {
    return revenueHistory.slice(-12).map(r => ({ label: r.month, value: r.mrr }))
  }, [revenueHistory])

  // Campaigns for this client
  const clientCampaigns = campaigns.filter(c => c.clientId === selectedClient)

  // SEO keywords for this client
  const clientSeo = seoKeywords.filter(s => s.clientId === selectedClient)
  const avgPosition = clientSeo.length ? (clientSeo.reduce((s, k) => s + k.currentPosition, 0) / clientSeo.length).toFixed(1) : '—'
  const improvedCount = clientSeo.filter(s => s.change > 0).length
  const declinedCount = clientSeo.filter(s => s.change < 0).length

  // Top keywords by position
  const topKeywords = useMemo(() => [...clientSeo].sort((a, b) => a.currentPosition - b.currentPosition).slice(0, 10), [clientSeo])

  const reportTitle = client ? `Monthly Report — ${client.name}` : 'Client Report'

  const handlePrint = () => {
    if (!client) return
    window.print()
  }

  if (!client) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Client Reporting Pack</h2>
            <p className="section-desc">Printable monthly reports with charts, KPIs, revenue trends, and SEO performance.</p>
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div className="form-field">
            <label>Select Client</label>
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} style={selectStyle}>
              <option value="">— Select a client to generate report —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} (${c.mrr.toLocaleString()}/mo · {c.health.toUpperCase()})</option>)}
            </select>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }} className="no-print">
      {/* ── Toolbar ── */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Client Reporting Pack</h2>
          <p className="section-desc">Printable monthly reports with charts, KPIs, revenue trends, and SEO performance.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'end', flexWrap: 'wrap' }}>
          <div className="form-field" style={{ flex: 1, minWidth: 200 }}>
            <label>Client</label>
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} style={selectStyle}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-field" style={{ flex: 1, minWidth: 160 }}>
            <label>Report Month</label>
            <input type="month" value={reportMonth} onChange={e => setReportMonth(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* ═══ PRINTABLE REPORT ═══ */}
      <div className="report-print-area">

        {/* Report Header */}
        <div className="report-header" style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Monthly Client Report</h1>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{client.name} · {reportMonth}</div>
        </div>

        {/* ── Summary Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Monthly Investment', value: `$${client.mrr.toLocaleString()}`, color: 'var(--brand-500)' },
            { label: 'Plan', value: client.retainerTier, color: 'var(--accent-500)' },
            { label: 'Health', value: client.health.toUpperCase(), color: client.health === 'green' ? 'var(--success-500)' : client.health === 'yellow' ? 'var(--warning-500)' : 'var(--danger-500)' },
            { label: 'Task Completion', value: `${completionRate}%`, color: completionRate >= 80 ? 'var(--success-500)' : completionRate >= 50 ? 'var(--warning-500)' : 'var(--danger-500)' },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ── Revenue Chart ── */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Revenue History (Monthly)</h3>
          {monthlyRevenue.length > 0 ? (
            <BarChart data={monthlyRevenue} height={140} labelKey="label" valueKey="value" valuePrefix="$" barColor="var(--brand-500)" />
          ) : (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: 16, textAlign: 'center' }}>No revenue history recorded yet.</div>
          )}
        </div>

        {/* ── Tasks & KPI Side-by-side ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          {/* Tasks */}
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Cycle Tasks</h3>
            <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
              <div><span style={{ fontWeight: 700, color: 'var(--success-500)' }}>{completedTasks.length}</span> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>done</span></div>
              <div><span style={{ fontWeight: 700, color: 'var(--warning-500)' }}>{pendingTasks.length}</span> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>pending</span></div>
              <div><span style={{ fontWeight: 700, color: 'var(--danger-500)' }}>{overdueTasks.length}</span> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>overdue</span></div>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: `${completionRate}%`, height: '100%', borderRadius: 3, background: 'var(--success-500)' }} />
            </div>
            {tasksForClient.filter(t => t.status !== 'completed').slice(0, 5).map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{t.name}</span>
                <span style={{ color: t.status === 'overdue' ? 'var(--danger-500)' : 'var(--text-muted)' }}>
                  {t.status === 'overdue' ? '⚠ Overdue' : `Due: ${new Date(t.dueDate).toLocaleDateString()}`}
                </span>
              </div>
            ))}
          </div>

          {/* KPIs */}
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Key Performance Indicators</h3>
            {clientKpis.length > 0 ? (
              clientKpis.slice(0, 6).map(kpi => {
                const max = Math.max(kpi.current, kpi.target, 1)
                return (
                  <div key={kpi.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                      <span>{kpi.metric}</span>
                      <span style={{ fontWeight: 600 }}>{kpi.current}{kpi.unit} / {kpi.target}{kpi.unit}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%`, height: '100%', borderRadius: 3,
                        background: kpi.current >= kpi.target ? 'var(--success-500)' : kpi.current >= kpi.target * 0.7 ? 'var(--warning-500)' : 'var(--danger-500)' }} />
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: 12, textAlign: 'center' }}>No KPIs set for this client.</div>
            )}
          </div>
        </div>

        {/* ── Campaign Performance ── */}
        {clientCampaigns.length > 0 && (
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Campaign Performance</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Platform</th>
                    <th>Budget</th>
                    <th>Spent</th>
                    <th>Impressions</th>
                    <th>Clicks</th>
                    <th>Conv.</th>
                    <th>CTR</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clientCampaigns.map(cam => (
                    <tr key={cam.id}>
                      <td style={{ fontWeight: 600 }}>{cam.name}</td>
                      <td>{cam.platform}</td>
                      <td>${cam.budget.toLocaleString()}</td>
                      <td>${cam.spent.toLocaleString()}</td>
                      <td>{cam.impressions.toLocaleString()}</td>
                      <td>{cam.clicks.toLocaleString()}</td>
                      <td>{cam.conversions}</td>
                      <td>{cam.impressions > 0 ? ((cam.clicks / cam.impressions) * 100).toFixed(1) : '0'}%</td>
                      <td>{cam.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SEO / Keywords ── */}
        {topKeywords.length > 0 && (
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Search Performance</h3>
              <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                <span>Avg Position: <strong>{avgPosition}</strong></span>
                <span style={{ color: 'var(--success-500)' }}>▲ {improvedCount}</span>
                <span style={{ color: 'var(--danger-500)' }}>▼ {declinedCount}</span>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Keyword</th>
                    <th>Position</th>
                    <th>Volume</th>
                    <th>Change</th>
                    <th>Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {topKeywords.map(kw => (
                    <tr key={kw.id}>
                      <td style={{ fontWeight: 600 }}>{kw.keyword}</td>
                      <td>{kw.currentPosition}</td>
                      <td>{kw.searchVolume.toLocaleString()}</td>
                      <td style={{ color: kw.change > 0 ? 'var(--success-500)' : kw.change < 0 ? 'var(--danger-500)' : 'var(--text-muted)' }}>
                        {kw.change > 0 ? '▲' : kw.change < 0 ? '▼' : '—'} {Math.abs(kw.change)}
                      </td>
                      <td>{kw.difficulty}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Client Summary ── */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Account Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <div><strong>Client Since:</strong> {client.since}</div>
            <div><strong>Plan:</strong> {client.retainerTier}</div>
            <div><strong>Monthly:</strong> ${client.mrr.toLocaleString()}</div>
            <div><strong>Annualized:</strong> ${(client.mrr * 12).toLocaleString()}</div>
            <div><strong>Last QBR:</strong> {client.lastQBR}</div>
            <div><strong>Next Renewal:</strong> {client.nextRenewal}</div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', padding: 16, borderTop: '1px solid var(--border)' }}>
          Generated {new Date().toLocaleDateString()} · Frantz Enterprise Agency · Confidential
        </div>
      </div>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, width: '100%',
}
const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, width: '100%',
}
