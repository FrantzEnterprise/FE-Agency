import { useAppStore } from '../store/useAppStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Line } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle, Activity, Clock } from 'lucide-react'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

export default function Dashboard() {
  const store = useAppStore()
  const { clients, revenueHistory, kpis, pipeline, tasks, clientTasks } = store

  const activeClients = clients.filter(c => c.status === 'active' || c.status === 'at_risk')
  const mrr = clients.reduce((sum, c) => sum + c.mrr, 0)
  const pipelineValue = pipeline.reduce((sum, d) => sum + d.estimatedMRR, 0)
  const atRisk = clients.filter(c => c.status === 'at_risk').length
  const overdue = clientTasks.filter(t => t.status === 'overdue').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const greenClients = clients.filter(c => c.health === 'green').length
  const yellowClients = clients.filter(c => c.health === 'yellow').length
  const redClients = clients.filter(c => c.health === 'red').length

  const healthData = [
    { name: 'Green', value: greenClients },
    { name: 'Yellow', value: yellowClients },
    { name: 'Red', value: redClients },
  ].filter(d => d.value > 0)

  const stageOrder = { discovery: 1, proposal: 2, negotiation: 3 }
  const sortedPipeline = [...pipeline].sort((a, b) => (stageOrder[a.stage as keyof typeof stageOrder] || 0) - (stageOrder[b.stage as keyof typeof stageOrder] || 0))

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Dashboard</h2>
          <p className="section-desc">Agency performance at a glance — Plan → Run → Report</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card card-hover">
          <div className="stat-label">Monthly Recurring Revenue</div>
          <div className="stat-value">${mrr.toLocaleString()}</div>
          <div className="stat-change up">↑ 10% vs last month</div>
        </div>
        <div className="stat-card card-hover">
          <div className="stat-label">Active Clients</div>
          <div className="stat-value">{activeClients.length}</div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>of 8 target</div>
        </div>
        <div className="stat-card card-hover">
          <div className="stat-label">Pipeline Value</div>
          <div className="stat-value">${pipelineValue.toLocaleString()}</div>
          <div className="stat-change up">↑ {pipeline.filter(d => d.stage === 'negotiation').length} in negotiation</div>
        </div>
        <div className="stat-card card-hover">
          <div className="stat-label">MRR Target</div>
          <div className="stat-value">$30K</div>
          <div className="stat-change up">{Math.round(mrr / 30000 * 100)}% of goal</div>
        </div>
      </div>

      {/* Second Stats Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderLeft: `4px solid var(--success)` }}>
          <div className="stat-label">Healthy Clients</div>
          <div className="stat-value">{greenClients}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: `4px solid var(--warning)` }}>
          <div className="stat-label">At Risk</div>
          <div className="stat-value">{atRisk}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: `4px solid ${overdue > 0 ? 'var(--danger)' : 'var(--info)'}` }}>
          <div className="stat-label">Overdue Tasks</div>
          <div className="stat-value">{overdue}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: `4px solid var(--info)` }}>
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{inProgressTasks}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                }}
              />
              <Bar dataKey="mrr" name="Total MRR" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="retainers" name="Retainers" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Client Health</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 250 }}>
            {healthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={healthData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {healthData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><p>No client health data</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline + KPIs */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Active Pipeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedPipeline.slice(0, 5).map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{d.company}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.tier} · {d.contact}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>${d.estimatedMRR}/mo</div>
                  <span className={`badge ${d.stage === 'negotiation' ? 'badge-green' : d.stage === 'proposal' ? 'badge-blue' : 'badge-gray'}`}>
                    {d.stage} · {d.probability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Key Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {kpis.slice(0, 6).map(k => {
              const pctChange = k.previous > 0 ? Math.round((k.current - k.previous) / k.previous * 100) : 0
              const isUp = pctChange >= 0
              return (
                <div key={k.metric} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>{k.metric}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                        {k.unit === 'USD' ? `$${k.current.toLocaleString()}` : k.current}{k.unit === '%' ? '%' : ''}
                      </span>
                      <span className={`stat-change ${isUp ? 'up' : 'down'}`}>
                        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {Math.abs(pctChange)}%
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Target</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {k.unit === 'USD' ? `$${k.target.toLocaleString()}` : k.target}{k.unit === '%' ? '%' : ''}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
