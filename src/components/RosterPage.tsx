import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Search, Edit3, UserCheck } from 'lucide-react'
import type { Agent } from '../types'

const statusLabel: Record<string, string> = { active: 'Active', idle: 'Idle', busy: 'Busy' }

export default function RosterPage() {
  const { agents, updateAgent } = useAppStore()
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.slug.toLowerCase().includes(search.toLowerCase())
  )

  const reportsToName = (slug: string | null) => {
    if (!slug) return 'Founder'
    const a = agents.find(ag => ag.slug === slug)
    return a ? a.name : slug
  }

  const active = agents.filter(a => a.status === 'active' || a.status === 'busy').length
  const avgUtil = Math.round(agents.reduce((s, a) => s + a.utilization, 0) / agents.length)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Agency Roster</h2>
          <p className="section-desc">{agents.length} agents · {active} active · {avgUtil}% avg utilization</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-label">Total Agents</div><div className="stat-value">{agents.length}</div></div>
        <div className="stat-card"><div className="stat-label">Active Now</div><div className="stat-value">{active}</div></div>
        <div className="stat-card"><div className="stat-label">Idle</div><div className="stat-value">{agents.filter(a => a.status === 'idle').length}</div></div>
        <div className="stat-card"><div className="stat-label">Avg Utilization</div><div className="stat-value">{avgUtil}%</div></div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input placeholder="Search roster..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Agent</th><th>Title</th><th>Reports To</th><th>Status</th><th>Utilization</th><th>Skills</th><th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state"><UserCheck size={32} /><p>No agents found</p></div></td></tr>
            ) : filtered.map(a => (
              <tr key={a.id} onClick={() => setExpanded(expanded === a.id ? null : a.id)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>
                      {a.slug.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{a.slug}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{a.title}</td>
                <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{reportsToName(a.reportsTo)}</td>
                <td>
                  <span className={`badge ${a.status === 'active' ? 'badge-green' : a.status === 'busy' ? 'badge-blue' : 'badge-gray'}`}>
                    <span className={`status-dot ${a.status === 'active' ? 'green' : a.status === 'busy' ? 'yellow' : 'gray'}`} />
                    {statusLabel[a.status]}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ width: 60 }}><div className="progress-fill" style={{ width: `${a.utilization}%`, background: a.utilization > 80 ? 'var(--danger)' : a.utilization > 50 ? 'var(--warning)' : 'var(--success)' }} /></div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{a.utilization}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {a.skills.slice(0, 2).map(s => <span key={s} className="badge badge-blue" style={{ fontSize: 10 }}>{s.replace(/-/g, ' ')}</span>)}
                    {a.skills.length > 2 && <span className="badge badge-gray" style={{ fontSize: 10 }}>+{a.skills.length - 2}</span>}
                  </div>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded Org Detail */}
      {expanded && (() => {
        const a = agents.find(ag => ag.id === expanded)
        if (!a) return null
        const reports = agents.filter(ag => ag.reportsTo === a.slug)
        return (
          <div className="card" style={{ marginTop: 16, animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{a.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{a.title} · Reports to {reportsToName(a.reportsTo)}</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => updateAgent(a.id, { status: a.status === 'active' ? 'idle' : 'active' } as any)}>
                Toggle Status
              </button>
            </div>
            <div style={{ display: 'flex', gap: 40, marginTop: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Skills</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {a.skills.length > 0 ? a.skills.map(s => <span key={s} className="badge badge-blue">{s.replace(/-/g, ' ')}</span>) : <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>None assigned</span>}
                </div>
              </div>
              {reports.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Reports</div>
                  <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                    {reports.map(r => (
                      <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700 }}>{r.slug.slice(0,2).toUpperCase()}</div>
                        <span style={{ fontSize: 13 }}>{r.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>— {r.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
