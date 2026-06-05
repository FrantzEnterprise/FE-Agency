import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Search, BookOpen } from 'lucide-react'

const categoryColors: Record<string, string> = {
  strategy: 'badge-purple',
  creative: 'badge-sky',
  operations: 'badge-emerald',
  accounts: 'badge-amber',
  finance: 'badge-blue',
}

export default function SkillsPage() {
  const { skills, agents } = useAppStore()
  const [search, setSearch] = useState('')

  const filtered = skills.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Agency Skills</h2>
          <p className="section-desc">{skills.length} skill modules powering agency delivery</p>
        </div>
      </div>

      <div className="table-search" style={{ marginBottom: 24, maxWidth: 'none' }}>
        <Search size={16} style={{ color: 'var(--text-muted)' }} />
        <input placeholder="Search skills..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><BookOpen size={32} /><p>No skills found</p></div>
        ) : filtered.map(s => (
          <div key={s.id} className="card card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{s.name.replace(/-/g, ' ')}</h3>
                  <span className={`badge ${categoryColors[s.category] || 'badge-gray'}`}>{s.category}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.description}</p>
              </div>
            </div>
            {s.usedBy.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Used by:</span>
                {s.usedBy.map(slug => {
                  const agent = agents.find(a => a.slug === slug)
                  return agent ? (
                    <span key={slug} className="badge badge-gray" style={{ fontSize: 11 }}>
                      {agent.name}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
