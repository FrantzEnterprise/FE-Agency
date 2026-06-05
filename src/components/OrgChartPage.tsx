import { useAppStore } from '../store/useAppStore'
import { GitBranch, User, Users } from 'lucide-react'

export default function OrgChartPage() {
  const { agents } = useAppStore()

  const ceo = agents.find(a => a.slug === 'ceo')
  const directReports = agents.filter(a => a.reportsTo === 'ceo' && a.slug !== 'ceo')
  const getReports = (slug: string) => agents.filter(a => a.reportsTo === slug)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Org Structure</h2>
          <p className="section-desc">Frantz Enterprise — {agents.length} agents · CEO → 8 department heads → specialist roster</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {/* CEO Node */}
        {ceo && (
          <div className="card" style={{ textAlign: 'center', width: 280, border: '2px solid var(--brand-500)', position: 'relative' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 8px' }}>
              <User size={24} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{ceo.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ceo.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Reports to: Founder</div>
          </div>
        )}

        {/* Connector line */}
        <div style={{ width: 2, height: 32, background: 'var(--brand-500)' }} />

        {/* Direct Reports Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, width: '100%' }}>
          {directReports.map(lead => {
            const reports = getReports(lead.slug)
            return (
              <div key={lead.id} className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 8px', fontSize: 14, fontWeight: 700 }}>
                  {lead.slug.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{lead.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{lead.title}</div>
                {reports.length > 0 && (
                  <>
                    <div style={{ width: '100%', height: 1, background: 'var(--border)', margin: '8px 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {reports.map(r => (
                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)', padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: 6 }}>
                          <Users size={12} />
                          <span style={{ fontWeight: 600 }}>{r.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>— {r.title}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📍 Org Structure</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
          <div><strong>CEO</strong> → Creative Director, Director of Ops, Head of Accounts, Strategist, Paid Media, SEO, Lifecycle/Email, Social, Finance Controller</div>
          <div><strong>Creative Director</strong> → Brand Designer, Copywriter, Video Editor</div>
          <div><strong>Director of Operations</strong> → Analyst, Bookkeeper, Reporting Engineer</div>
          <div><strong>Head of Accounts</strong> → Account Manager, Project Manager</div>
          <div><strong>Strategist</strong> → Market Researcher</div>
        </div>
      </div>
    </div>
  )
}
