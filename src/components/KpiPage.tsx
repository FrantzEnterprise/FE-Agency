import { useAppStore } from '../store/useAppStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

export default function KpiPage() {
  const { kpis, updateKPI } = useAppStore()

  const chartData = kpis.map(k => ({
    name: k.metric.split(' ').slice(0, 3).join(' '),
    current: k.current,
    target: k.target,
  }))

  const mrrKpi = kpis.find(k => k.metric === 'Monthly Recurring Revenue')
  const targetMRR = mrrKpi?.target || 30000
  const progress = mrrKpi ? Math.round(mrrKpi.current / mrrKpi.target * 100) : 0

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Key Performance Indicators</h2>
          <p className="section-desc">{kpis.length} metrics tracking agency health and growth</p>
        </div>
      </div>

      {/* MRR Progress */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>$30K MRR North Star</h3>
          <span style={{ fontSize: 13, fontWeight: 700, color: progress >= 100 ? 'var(--success)' : 'var(--text-primary)' }}>
            {progress}% of goal
          </span>
        </div>
        <div className="progress-bar" style={{ height: 12 }}>
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%`, background: progress >= 100 ? 'var(--success)' : 'var(--brand-500)', borderRadius: 6 }} />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {kpis.map(k => {
          const pctChange = k.previous > 0 ? Math.round((k.current - k.previous) / k.previous * 100) : 0
          const isUp = pctChange >= 0
          const isOnTarget = k.target > 0 ? k.current >= k.target : true
          return (
            <div key={k.metric} className="card card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 4 }}>{k.metric}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {k.unit === 'USD' ? `$${k.current.toLocaleString()}` : k.current}{k.unit === '%' ? '%' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`stat-change ${isUp ? 'up' : 'down'}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />} {Math.abs(pctChange)}%
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>vs last month</div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Target: {k.unit === 'USD' ? `$${k.target.toLocaleString()}` : k.target}{k.unit === '%' ? '%' : ''}</span>
                <span className={`badge ${isOnTarget ? 'badge-green' : 'badge-amber'}`}>{isOnTarget ? 'On Track' : 'Behind'}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bar Chart */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Current vs Target</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} angle={-25} textAnchor="end" height={80} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
            <Bar dataKey="current" name="Current" fill="#6366f1" radius={[4,4,0,0]} />
            <Bar dataKey="target" name="Target" fill="#22c55e" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
