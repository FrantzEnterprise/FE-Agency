import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function SkillsPage() {
  const { skills, agents, addSkill, updateSkill } = useAppStore()
  const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || 'Agency'

  const [search, setSearch] = useState('')
  const [agentFilter, setAgentFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'marketing', level: 'intermediate', agentId: '', description: '' })

  const filtered = useMemo(() => {
    let items = [...skills]
    if (agentFilter !== 'all') items = items.filter(s => s.agentId === agentFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    }
    return items
  }, [skills, agentFilter, search])

  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const s of skills) c[s.category] = (c[s.category] || 0) + 1
    return c
  }, [skills])

  const CATEGORIES = useMemo(() => [...new Set(skills.map(s => s.category))], [skills])

  const handleAdd = () => {
    if (!form.name || !form.agentId) return
    addSkill({
      name: form.name,
      category: form.category,
      level: form.level as any,
      agentId: form.agentId,
      description: form.description || '',
    })
    setForm({ name: '', category: 'marketing', level: 'intermediate', agentId: '', description: '' })
    setShowAdd(false)
  }

  const levelColor = (lvl: string) => lvl === 'expert' ? 'var(--success-500)' : lvl === 'intermediate' ? 'var(--warning-500)' : 'var(--text-muted)'

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Team Skills & Competencies</h2>
          <p className="section-desc">Track agent skills, proficiencies, and coverage gaps across the agency.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)} style={{ whiteSpace: 'nowrap' }}>
          {showAdd ? '✕ Cancel' : '+ Add Skill'}
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input placeholder="Skill name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
              {['marketing', 'design', 'development', 'content', 'strategy', 'management', 'analytics', 'sales', 'support'].map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <select value={form.agentId} onChange={e => setForm(p => ({ ...p, agentId: e.target.value }))} style={inputStyle}>
              <option value="">Select agent *</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}
            </select>
            <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} style={inputStyle}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <input placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, marginTop: 10, width: '100%' }} />
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={handleAdd} disabled={!form.name || !form.agentId}>Save Skill</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: '8px 14px', fontSize: 12 }}>📊 <strong>{skills.length}</strong> skills</div>
        <div className="card" style={{ padding: '8px 14px', fontSize: 12 }}>🧑‍💻 <strong>{agents.length}</strong> agents</div>
        {CATEGORIES.map(c => (
          <div key={c} className="card" style={{ padding: '8px 14px', fontSize: 12 }}>
            {c.charAt(0).toUpperCase() + c.slice(1)}: <strong>{categoryCounts[c] || 0}</strong>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} style={{ ...inputStyle, width: 180 }}>
          <option value="all">All Agents</option>
          {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <input placeholder="Search skills…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 220, marginLeft: 'auto' }} />
      </div>

      {/* Skill Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
        {filtered.map(skill => (
          <div key={skill.id} className="card" style={{ padding: 14, borderTop: `3px solid ${levelColor(skill.level)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{skill.name}</div>
                <span className="tag" style={{ fontSize: 10, background: 'var(--bg-tertiary)', color: 'var(--text-muted)', marginTop: 2 }}>{skill.category}</span>
              </div>
              <span className="tag" style={{ background: `${levelColor(skill.level)}20`, color: levelColor(skill.level), fontSize: 10 }}>
                {skill.level.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{getAgentName(skill.agentId)}</div>
            {skill.description && (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>{skill.description}</div>
            )}
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: skill.level === 'expert' ? '100%' : skill.level === 'intermediate' ? '60%' : '30%',
                  background: levelColor(skill.level), borderRadius: 2 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
          No skills found. {skills.length === 0 ? 'Add your first skill above.' : 'Try different filters.'}
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12,
}
