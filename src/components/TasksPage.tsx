import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Briefcase, Plus, Search, Edit3, Circle, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react'
import type { Task } from '../types'

const initialForm = (): Omit<Task, 'id'> => ({
  slug: '', name: '', description: '', projectId: '', assignee: '',
  status: 'todo', completionCriteria: [], startedAt: '', dueAt: '',
})

export default function TasksPage() {
  const { tasks, projects, agents, addTask, updateTask } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm())

  const filtered = tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openNew = () => { setEditId(null); setForm(initialForm()); setModalOpen(true) }
  const openEdit = (t: Task) => { setEditId(t.id); setForm({ slug: t.slug, name: t.name, description: t.description, projectId: t.projectId, assignee: t.assignee, status: t.status, completionCriteria: t.completionCriteria, startedAt: t.startedAt, dueAt: t.dueAt }); setModalOpen(true) }
  const save = () => {
    if (editId) updateTask(editId, form)
    else addTask(form)
    setModalOpen(false)
  }

  const ownerName = (slug: string) => agents.find(a => a.slug === slug)?.name || slug
  const projectName = (id: string) => projects.find(p => p.id === id)?.name || id

  const statusCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Tasks</h2>
          <p className="section-desc">{tasks.length} total · {statusCounts.in_progress} in progress · {statusCounts.completed} completed</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Task</button>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'todo', 'in_progress', 'completed', 'blocked'].map(s => (
            <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilterStatus(s)}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
              <span className="badge badge-gray" style={{ fontSize: 10, marginLeft: 4 }}>{statusCounts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="table-search" style={{ marginBottom: 24, maxWidth: 'none' }}>
        <Search size={16} style={{ color: 'var(--text-muted)' }} />
        <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><Briefcase size={32} /><p>No tasks found</p></div>
        ) : filtered.map(t => {
          const statusIcon = () => {
            switch(t.status) {
              case 'completed': return <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
              case 'in_progress': return <Clock size={20} style={{ color: 'var(--info)' }} />
              case 'blocked': return <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />
              default: return <Circle size={20} style={{ color: 'var(--text-muted)' }} />
            }
          }
          return (
            <div key={t.id} className="card card-hover" style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
              <div style={{ marginTop: 2 }}>{statusIcon()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{t.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(t)}><Edit3 size={14} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>Assignee: <strong>{ownerName(t.assignee)}</strong></span>
                  <span>Project: <strong>{projectName(t.projectId)}</strong></span>
                  <span>Due: {t.dueAt}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Task' : 'New Task'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group"><label className="form-label">Task Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Assignee</label>
                    <select className="form-select" value={form.assignee} onChange={e => setForm({...form, assignee: e.target.value})}>
                      <option value="">Select...</option>
                      {agents.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label className="form-label">Project</label>
                  <select className="form-select" value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})}>
                    <option value="">Select...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Start Date</label><input className="form-input" type="date" value={form.startedAt} onChange={e => setForm({...form, startedAt: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Due Date</label><input className="form-input" type="date" value={form.dueAt} onChange={e => setForm({...form, dueAt: e.target.value})} /></div>
                </div>
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
