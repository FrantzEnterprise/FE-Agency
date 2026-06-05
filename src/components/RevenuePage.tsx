import { useAppStore } from '../store/useAppStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { DollarSign, TrendingUp } from 'lucide-react'

export default function RevenuePage() {
  const { revenueHistory, clients } = useAppStore()

  const totalMRR = clients.reduce((s, c) => s + c.mrr, 0)
  const avgMRR = clients.length > 0 ? Math.round(totalMRR / clients.length) : 0
  const growth = revenueHistory.length >= 2
    ? Math.round((revenueHistory[revenueHistory.length - 1].mrr - revenueHistory[revenueHistory.length - 2].mrr) / revenueHistory[revenueHistory.length - 2].mrr * 100)
    : 0

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Revenue & Financials</h2>
          <p className="section-desc">Retainer revenue · MRR growth · pipeline coverage</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-label">Current MRR</div><div className="stat-value">${totalMRR.toLocaleString()}</div><div className="stat-change up">↑ {growth}%</div></div>
        <div className="stat-card"><div className="stat-label">Avg Retainer</div><div className="stat-value">${avgMRR.toLocaleString()}</div><div className="stat-change" style={{ color: 'var(--text-muted)' }}>per client</div></div>
        <div className="stat-card"><div className="stat-label">Clients</div><div className="stat-value">{clients.length}</div></div>
        <div className="stat-card"><div className="stat-label">ARR (Projected)</div><div className="stat-value">${(totalMRR * 12).toLocaleString()}</div></div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Monthly Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Legend />
              <Bar dataKey="retainers" name="Retainers" fill="#22c55e" radius={[4,4,0,0]} />
              <Bar dataKey="projects" name="Projects" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>MRR Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Line type="monotone" dataKey="mrr" name="Total MRR" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Revenue Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <span style={{ fontSize: 13, fontWeight: 600 }}>Revenue by Client</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Client</th><th>Tier</th><th>MRR</th><th>ARR</th><th>Since</th><th>Health</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td><span style={{ fontWeight: 600 }}>{c.name}</span></td>
                <td><span className={`badge ${c.retainerTier === 'Scale' ? 'badge-purple' : c.retainerTier === 'Growth' ? 'badge-blue' : 'badge-gray'}`}>{c.retainerTier}</span></td>
                <td><span style={{ fontWeight: 700 }}>${c.mrr.toLocaleString()}</span></td>
                <td><span style={{ fontWeight: 600 }}>${(c.mrr * 12).toLocaleString()}</span></td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.since}</td>
                <td><span className={`badge badge-${c.health}`}><span className={`status-dot ${c.health}`} />{c.health === 'green' ? 'Healthy' : c.health === 'yellow' ? 'Warning' : 'Critical'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
