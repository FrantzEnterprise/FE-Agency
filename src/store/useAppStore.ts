import { create } from 'zustand'
import { AGENT_DEFINITIONS, SKILL_DEFINITIONS, PROJECT_DEFINITIONS, TASK_DEFINITIONS } from '../types'
import type { Agent, Skill, Project, Task, Client, ClientTask, RevenueEntry, PipelineDeal, KPIEntry, WeeklyNote } from '../types'

// ─── Helpers ────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9)
const today = () => new Date().toISOString().slice(0, 10)
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10) }
const daysFromNow = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }

// ─── State ──────────────────────────────────────────────────────────────

export interface AppState {
  dark: boolean
  activeModule: string
  agents: Agent[]
  skills: Skill[]
  projects: Project[]
  tasks: Task[]
  clients: Client[]
  clientTasks: ClientTask[]
  revenueHistory: RevenueEntry[]
  pipeline: PipelineDeal[]
  kpis: KPIEntry[]
  weeklyNotes: WeeklyNote[]
  loading: boolean

  toggleDark: () => void
  setActiveModule: (m: string) => void

  addAgent: (a: Omit<Agent, 'id'>) => void
  updateAgent: (id: string, data: Partial<Agent>) => void

  addProject: (p: Omit<Project, 'id'>) => void
  updateProject: (id: string, data: Partial<Project>) => void

  addTask: (t: Omit<Task, 'id'>) => void
  updateTask: (id: string, data: Partial<Task>) => void

  addClient: (c: Omit<Client, 'id'>) => void
  updateClient: (id: string, data: Partial<Client>) => void

  addClientTask: (ct: Omit<ClientTask, 'id'>) => void
  updateClientTask: (id: string, data: Partial<ClientTask>) => void

  addPipelineDeal: (d: Omit<PipelineDeal, 'id'>) => void
  updatePipelineDeal: (id: string, data: Partial<PipelineDeal>) => void

  addWeeklyNote: (n: Omit<WeeklyNote, 'id'>) => void
  updateKPI: (metric: string, data: Partial<KPIEntry>) => void

  exportData: () => string
  importData: (json: string) => void
  resetData: () => void
}

// ─── Sample Data ────────────────────────────────────────────────────────

const sampleClients: Client[] = [
  { id: uid(), name: 'BrightPath Dental', industry: 'Healthcare', retainerTier: 'Growth', mrr: 4500, status: 'active', health: 'green', since: daysAgo(120), lastQBR: daysAgo(30), nextRenewal: daysFromNow(60) },
  { id: uid(), name: 'Summit Roofing Co', industry: 'Home Services', retainerTier: 'Foundation', mrr: 2500, status: 'active', health: 'yellow', since: daysAgo(60), lastQBR: daysAgo(15), nextRenewal: daysFromNow(90) },
  { id: uid(), name: 'Verdant Landscapes', industry: 'Home Services', retainerTier: 'Scale', mrr: 8000, status: 'onboarding', health: 'green', since: daysAgo(10), lastQBR: daysAgo(0), nextRenewal: daysFromNow(350) },
  { id: uid(), name: 'Coastal Realty Group', industry: 'Real Estate', retainerTier: 'Growth', mrr: 5000, status: 'at_risk', health: 'red', since: daysAgo(180), lastQBR: daysAgo(60), nextRenewal: daysFromNow(15) },
  { id: uid(), name: 'Precision Auto Works', industry: 'Automotive', retainerTier: 'Foundation', mrr: 2000, status: 'active', health: 'green', since: daysAgo(90), lastQBR: daysAgo(45), nextRenewal: daysFromNow(45) },
]

const sampleRevenue: RevenueEntry[] = [
  { month: 'Jan', mrr: 14000, retainers: 12000, projects: 2000 },
  { month: 'Feb', mrr: 16000, retainers: 14000, projects: 2000 },
  { month: 'Mar', mrr: 18000, retainers: 16000, projects: 2000 },
  { month: 'Apr', mrr: 20000, retainers: 18500, projects: 1500 },
  { month: 'May', mrr: 22000, retainers: 20000, projects: 2000 },
  { month: 'Jun', mrr: 22000, retainers: 22000, projects: 0 },
]

const samplePipeline: PipelineDeal[] = [
  { id: uid(), company: 'NovaTech Solutions', contact: 'Sarah Chen', tier: 'Growth', estimatedMRR: 5000, stage: 'proposal', stageOrder: 2, probability: 40 },
  { id: uid(), company: 'Elite Fitness Clubs', contact: 'Mark Torres', tier: 'Scale', estimatedMRR: 8000, stage: 'discovery', stageOrder: 1, probability: 20 },
  { id: uid(), company: 'Heritage Bank Local', contact: 'Jennifer Walsh', tier: 'Growth', estimatedMRR: 4500, stage: 'negotiation', stageOrder: 3, probability: 65 },
  { id: uid(), company: 'Greenleaf Organics', contact: 'David Park', tier: 'Foundation', estimatedMRR: 2500, stage: 'proposal', stageOrder: 2, probability: 50 },
  { id: uid(), company: 'Metro Insurance Brokers', contact: 'Lisa Adams', tier: 'Growth', estimatedMRR: 5500, stage: 'discovery', stageOrder: 1, probability: 25 },
  { id: uid(), company: 'BayView Medical Group', contact: 'Dr. James Wong', tier: 'Scale', estimatedMRR: 7500, stage: 'negotiation', stageOrder: 3, probability: 70 },
]

const sampleKPIs: KPIEntry[] = [
  { metric: 'Monthly Recurring Revenue', current: 22000, target: 30000, previous: 20000, unit: 'USD' },
  { metric: 'Retainer Clients', current: 5, target: 8, previous: 4, unit: 'clients' },
  { metric: 'Gross Retention', current: 88, target: 85, previous: 85, unit: '%' },
  { metric: 'Avg Retainer Value', current: 4400, target: 5000, previous: 4250, unit: 'USD' },
  { metric: 'Pipeline Coverage', current: 33000, target: 60000, previous: 24000, unit: 'USD' },
  { metric: 'Deal Close Rate', current: 42, target: 50, previous: 38, unit: '%' },
  { metric: 'Client Health (Green)', current: 60, target: 80, previous: 50, unit: '%' },
  { metric: 'Tasks On Time', current: 72, target: 90, previous: 68, unit: '%' },
]

const sampleClientTasks: ClientTask[] = [
  { id: uid(), clientId: sampleClients[0].id, name: 'Monthly strategy review', dueDate: daysFromNow(3), status: 'pending', assignee: 'strategist', phase: 'plan' },
  { id: uid(), clientId: sampleClients[0].id, name: 'Creative deliverables review', dueDate: daysFromNow(7), status: 'pending', assignee: 'creative-director', phase: 'run' },
  { id: uid(), clientId: sampleClients[1].id, name: 'QBR prep', dueDate: daysFromNow(10), status: 'pending', assignee: 'head-of-accounts', phase: 'qbr' },
  { id: uid(), clientId: sampleClients[1].id, name: 'Monthly report delivery', dueDate: daysAgo(2), status: 'overdue', assignee: 'reporting-engineer', phase: 'report' },
  { id: uid(), clientId: sampleClients[3].id, name: 'Churn recovery plan', dueDate: daysAgo(1), status: 'overdue', assignee: 'head-of-accounts', phase: 'qbr' },
  { id: uid(), clientId: sampleClients[3].id, name: 'Client feedback session', dueDate: daysFromNow(5), status: 'pending', assignee: 'account-manager', phase: 'run' },
  { id: uid(), clientId: sampleClients[2].id, name: 'Complete brand voice capture', dueDate: daysFromNow(5), status: 'pending', assignee: 'brand-designer', phase: 'plan' },
  { id: uid(), clientId: sampleClients[2].id, name: 'Analytics baseline setup', dueDate: daysFromNow(7), status: 'pending', assignee: 'analyst', phase: 'plan' },
]

// ─── Build from blueprint ──────────────────────────────────────────────

const buildAgents = (): Agent[] =>
  AGENT_DEFINITIONS.map((def, i) => ({
    id: uid(),
    ...def,
    status: 'idle' as const,
    utilization: Math.floor(Math.random() * 40) + 20,
    lastActive: daysAgo(Math.floor(Math.random() * 3)),
  }))

const buildSkills = (): Skill[] =>
  SKILL_DEFINITIONS.map(s => ({
    id: uid(),
    ...s,
    usedBy: AGENT_DEFINITIONS.filter(a => a.skills.includes(s.name)).map(a => a.slug),
  }))

const buildProjects = (): Project[] =>
  PROJECT_DEFINITIONS.map((p, i) => ({
    id: p.slug,
    ...p,
    status: (i === 0 ? 'in_progress' : 'in_progress') as Project['status'],
    startedAt: daysAgo(5),
    etd: daysFromNow(25),
  }))

const buildTasks = (): Task[] =>
  TASK_DEFINITIONS.map((t, i) => ({
    id: uid(),
    ...t,
    status: (i < 2 ? 'in_progress' : 'todo') as Task['status'],
    startedAt: daysAgo(i < 2 ? 3 : 0),
    dueAt: daysFromNow(20 - i * 3),
  }))

// ─── Store ──────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  dark: true,
  activeModule: 'dashboard',
  agents: buildAgents(),
  skills: buildSkills(),
  projects: buildProjects(),
  tasks: buildTasks(),
  clients: sampleClients,
  clientTasks: sampleClientTasks,
  revenueHistory: sampleRevenue,
  pipeline: samplePipeline,
  kpis: sampleKPIs,
  weeklyNotes: [],
  loading: false,

  toggleDark: () => set(s => ({ dark: !s.dark })),
  setActiveModule: (m) => set({ activeModule: m }),

  addAgent: (a) => set(s => ({ agents: [...s.agents, { id: uid(), ...a }] })),
  updateAgent: (id, data) => set(s => ({ agents: s.agents.map(a => a.id === id ? { ...a, ...data } : a) })),

  addProject: (p) => set(s => ({ projects: [...s.projects, { id: uid(), ...p }] })),
  updateProject: (id, data) => set(s => ({ projects: s.projects.map(p => p.id === id ? { ...p, ...data } : p) })),

  addTask: (t) => set(s => ({ tasks: [...s.tasks, { id: uid(), ...t }] })),
  updateTask: (id, data) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...data } : t) })),

  addClient: (c) => set(s => ({ clients: [...s.clients, { id: uid(), ...c }] })),
  updateClient: (id, data) => set(s => ({ clients: s.clients.map(c => c.id === id ? { ...c, ...data } : c) })),

  addClientTask: (ct) => set(s => ({ clientTasks: [...s.clientTasks, { id: uid(), ...ct }] })),
  updateClientTask: (id, data) => set(s => ({ clientTasks: s.clientTasks.map(ct => ct.id === id ? { ...ct, ...data } : ct) })),

  addPipelineDeal: (d) => set(s => ({ pipeline: [...s.pipeline, { id: uid(), ...d }] })),
  updatePipelineDeal: (id, data) => set(s => ({ pipeline: s.pipeline.map(d => d.id === id ? { ...d, ...data } : d) })),

  addWeeklyNote: (n) => set(s => ({ weeklyNotes: [...s.weeklyNotes, { id: uid(), ...n }] })),
  updateKPI: (metric, data) => set(s => ({ kpis: s.kpis.map(k => k.metric === metric ? { ...k, ...data } : k) })),

  exportData: () => {
    const { agents, skills, projects, tasks, clients, clientTasks, revenueHistory, pipeline, kpis, weeklyNotes } = get()
    return JSON.stringify({ agents, skills, projects, tasks, clients, clientTasks, revenueHistory, pipeline, kpis, weeklyNotes, exportedAt: new Date().toISOString() }, null, 2)
  },

  importData: (json) => {
    try {
      const data = JSON.parse(json)
      set({
        agents: data.agents || [],
        skills: data.skills || [],
        projects: data.projects || [],
        tasks: data.tasks || [],
        clients: data.clients || [],
        clientTasks: data.clientTasks || [],
        revenueHistory: data.revenueHistory || [],
        pipeline: data.pipeline || [],
        kpis: data.kpis || [],
        weeklyNotes: data.weeklyNotes || [],
      })
    } catch { alert('Invalid import data') }
  },

  resetData: () => set({
    agents: buildAgents(),
    skills: buildSkills(),
    projects: buildProjects(),
    tasks: buildTasks(),
    clients: sampleClients,
    clientTasks: sampleClientTasks,
    revenueHistory: sampleRevenue,
    pipeline: samplePipeline,
    kpis: sampleKPIs,
    weeklyNotes: [],
  }),
}))
