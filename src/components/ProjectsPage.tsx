import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Target, Plus, Search, Edit3, X } from 'lucide-react'
import type { Project } from '../types'

const initialForm = (): Omit<Project, 'id'> => ({
  slug: '', name: '', description: '', owner: '', status: 'in_progress',
  successCondition: '', deliverables: [], startedAt: '', etd: '',
})

export default function ProjectsPage() {
  const { projects, tasks, agents, addProject, updateProject } = useAppStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm())

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => { setEditId(null); setForm(initialForm()); setModalOpen(true) }
  const openEdit = (p: Project) => { setEditId(p.id); setForm({ slug: p.slug, name: p.name, description: p.description, owner: p.owner, status: p.status, successCondition: p.successCondition, deliverables: p.deliverables, startedAt: p.startedAt, etd: p.etd }); setModalOpen(true) }
  const save = () => {
    if (editId) updateProject(editId, form)
    else addProject(form)
    setModalOpen(false)
  }

  const ownerName = (slug: string) => agents.find(a => a.slug === slug)?.name || slug

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Projects</h2>
          <p className="section-desc">{projects.length} active projects · {tasks.length} tasks</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> New Project</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><Target size={32} /><p>No projects found</p></div>
        ) : filtered.map(p => {
          const projectTasks = tasks.filter(t => t.projectId === p.id)
          const completed = projectTasks.filter(t => t.status === 'completed').length
          const progress = projectTasks.length > 0 ? Math.round(completed / projectTasks.length * 100) : 0

          return (
            <div key={p.id} className="card card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</h3>
                    <span className={`badge ${p.status === 'completed' ? 'badge-green' : p.status === 'at_risk' ? 'badge-red' : p.status === 'blocked' ? 'badge-amber' : 'badge-blue'}`}>{p.status.replace('_', ' ')}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{p.description}</p>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Owner: <strong>{ownerName(p.owner)}</strong> · {projectTasks.length} tasks ({completed} done)
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(p)}><Edit3 size={14} /></button>
                </div>
              </div>
              {projectTasks.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%`, background: progress === 100 ? 'var(--success)' : 'var(--brand-500)' }} /></div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{progress}% complete</div>
                </div>
              )}
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                <strong>✓ Success:</strong> {p.successCondition.slice(0, 120)}...
              </div>
            </div>
          )
        })}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Project' : 'New Project'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Slug</label><input className="form-input" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} /></div>
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Owner</label>
                    <select className="form-select" value={form.owner} onChange={e => setForm({...form, owner: e.target.value})}>
                      <option value="">Select...</option>
                      {agents.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="at_risk">At Risk</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label className="form-label">Success Condition</label><textarea className="form-textarea" value={form.successCondition} onChange={e => setForm({...form, successCondition: e.target.value})} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editId ? 'Save' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
