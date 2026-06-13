import { create } from 'zustand'

// Persistence keys shared with persistence.ts
const PERSIST_KEY = 'frantz…data'
function clearPersistedData() { try { localStorage.removeItem(PERSIST_KEY) } catch {} }
import { AGENT_DEFINITIONS, SKILL_DEFINITIONS, PROJECT_DEFINITIONS, TASK_DEFINITIONS } from '../types'
import type { FunnelStageData, Agent, Skill, Project, Task, Client, ClientTask, RevenueEntry, PipelineDeal, KPIEntry, WeeklyNote, CreativeAsset, Campaign, SeoKeyword, EmailCampaign, SocialPost, ContentPiece, PitchDeal, DiscoveryCall, MarketIntel, ScopeChange, AiGenerationJob, SocialQueueItem, ApiConfig, Integration, AgencySettings, PortalInvite, ClientApproval, ClientMessage, ContactList, ContactEntry, Autoresponder, AutoresponderStep, AutoresponderCondition, AutoresponderTrigger, AutoresponderTriggerType, AutoresponderStats, EmailTemplate, Website, WebsiteTemplate, Invoice, Payment, StripeConfig } from '../types'
import type { Toast, ToastType } from '../types/toast'
import { createToast } from '../types/toast'

// ─── Helpers ────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9)
const today = () => new Date().toISOString().slice(0, 10)
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10) }
const daysFromNow = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }

// ─── State ──────────────────────────────────────────────────────────────

export interface AppState {
  dark: boolean
  activeModule: string
  navHistory: string[]
  agents: Agent[]
  skills: Skill[]
  projects: Project[]
  tasks: Task[]
  clients: Client[]
  clientTasks: ClientTask[]
  revenueHistory: RevenueEntry[]
  pipeline: PipelineDeal[]
  kpis: KPIEntry[]
  funnelStage: string // currently expanded stage
  funnelStages: FunnelStageData[]
  weeklyNotes: WeeklyNote[]
  creativeAssets: CreativeAsset[]
  campaigns: Campaign[]
  seoKeywords: SeoKeyword[]
  emailCampaigns: EmailCampaign[]
  socialPosts: SocialPost[]
  contentPieces: ContentPiece[]
  pitchDeals: PitchDeal[]
  discoveryCalls: DiscoveryCall[]
  marketIntel: MarketIntel[]
  scopeChanges: ScopeChange[]
  aiJobs: AiGenerationJob[]
  socialQueue: SocialQueueItem[]
  apiConfig: ApiConfig
  integrations: Integration[]
  settings: AgencySettings
  portalInvites: PortalInvite[]
  clientApprovals: ClientApproval[]
  clientMessages: ClientMessage[]
  portalViewClientId: string | null
  loading: boolean
  contactLists: ContactList[]
  autoresponders: Autoresponder[]
  emailTemplates: EmailTemplate[]
  websites: Website[]
  websiteTemplates: WebsiteTemplate[]
  invoices: Invoice[]
  payments: Payment[]
  stripeConfig: StripeConfig
  toasts: Toast[]

  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateInvoice: (id: string, data: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  addPayment: (p: Omit<Payment, 'id' | 'createdAt'>) => void
  updateStripeConfig: (config: Partial<StripeConfig>) => void

  addToast: (type: ToastType, title: string, message?: string) => void
  removeToast: (id: string) => void
  toggleDark: () => void
  setActiveModule: (m: string) => void
  setFunnelStage: (id: string | null) => void
  updateFunnelStage: (id: string, data: Partial<FunnelStageData>) => void
  updateFunnelFeature: (stageId: string, featureIdx: number, data: { name?: string; desc?: string }) => void
  goBack: () => void

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
  addCreativeAsset: (a: Omit<CreativeAsset, 'id' | 'createdAt' | 'version'>) => void
  updateCreativeAsset: (id: string, data: Partial<CreativeAsset>) => void
  addCampaign: (c: Omit<Campaign, 'id'>) => void
  updateCampaign: (id: string, data: Partial<Campaign>) => void
  addSeoKeyword: (k: Omit<SeoKeyword, 'id'>) => void
  updateSeoKeyword: (id: string, data: Partial<SeoKeyword>) => void
  addEmailCampaign: (e: Omit<EmailCampaign, 'id'>) => void
  updateEmailCampaign: (id: string, data: Partial<EmailCampaign>) => void
  addSocialPost: (p: Omit<SocialPost, 'id' | 'postedAt' | 'likes' | 'comments' | 'shares' | 'impressions'>) => void
  updateSocialPost: (id: string, data: Partial<SocialPost>) => void
  addContentPiece: (c: Omit<ContentPiece, 'id'>) => void
  updateContentPiece: (id: string, data: Partial<ContentPiece>) => void
  addPitchDeal: (d: Omit<PitchDeal, 'id' | 'createdAt'>) => void
  updatePitchDeal: (id: string, data: Partial<PitchDeal>) => void
  addDiscoveryCall: (d: Omit<DiscoveryCall, 'id'>) => void
  updateDiscoveryCall: (id: string, data: Partial<DiscoveryCall>) => void
  addMarketIntel: (m: Omit<MarketIntel, 'id'>) => void
  updateMarketIntel: (id: string, data: Partial<MarketIntel>) => void
  addScopeChange: (s: Omit<ScopeChange, 'id' | 'detectedAt'>) => void
  updateScopeChange: (id: string, data: Partial<ScopeChange>) => void
  addAiJob: (j: Omit<AiGenerationJob, 'id' | 'createdAt' | 'completedAt' | 'status'>) => void
  updateAiJob: (id: string, data: Partial<AiGenerationJob>) => void
  addSocialQueueItem: (q: Omit<SocialQueueItem, 'id'>) => void
  updateSocialQueueItem: (id: string, data: Partial<SocialQueueItem>) => void
  updateApiConfig: (c: Partial<ApiConfig>) => void
  addIntegration: (i: Omit<Integration, 'id' | 'connectedAt' | 'lastVerified'>) => void
  updateIntegration: (id: string, data: Partial<Integration>) => void
  removeIntegration: (id: string) => void
  updateSettings: (s: Partial<AgencySettings>) => void
  addPortalInvite: (i: Omit<PortalInvite, 'id' | 'createdAt'>) => void
  updatePortalInvite: (id: string, data: Partial<PortalInvite>) => void
  addClientApproval: (a: Omit<ClientApproval, 'id' | 'submittedAt'>) => void
  updateClientApproval: (id: string, data: Partial<ClientApproval>) => void
  addClientMessage: (m: Omit<ClientMessage, 'id' | 'createdAt'>) => void
  updateClientMessage: (id: string, data: Partial<ClientMessage>) => void
  setPortalViewClientId: (id: string | null) => void

  addWebsite: (w: Omit<Website, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateWebsite: (id: string, data: Partial<Website>) => void
  publishWebsite: (id: string) => void
  removeWebsite: (id: string) => void

  addContactList: (c: Omit<ContactList, 'id' | 'createdAt'>) => void
  updateContactList: (id: string, data: Partial<ContactList>) => void
  addContactToList: (listId: string, contact: Omit<ContactEntry, 'id' | 'createdAt' | 'lastOpened' | 'lastClicked' | 'totalOpens' | 'totalClicks'>) => void
  removeContactFromList: (listId: string, contactId: string) => void
  updateContact: (listId: string, contactId: string, data: Partial<ContactEntry>) => void
  addAutoresponder: (a: Omit<Autoresponder, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAutoresponder: (id: string, data: Partial<Autoresponder>) => void
  addAutoresponderStep: (autoresponderId: string, step: Omit<AutoresponderStep, 'id'>) => void
  removeAutoresponderStep: (autoresponderId: string, stepId: string) => void
  updateAutoresponderStep: (autoresponderId: string, stepId: string, data: Partial<AutoresponderStep>) => void
  addEmailTemplate: (t: Omit<EmailTemplate, 'id' | 'createdAt'>) => void
  updateEmailTemplate: (id: string, data: Partial<EmailTemplate>) => void

  exportData: () => string
  importData: (json: string) => void
  resetData: () => void
}

// ─── Toast state (not persisted) ─────────────────────────────────────────

export function useToast() {
  const store = useAppStore.getState()
  return {
    toasts: store.toasts,
    success: (title: string, message?: string) => store.addToast('success', title, message),
    error: (title: string, message?: string) => store.addToast('error', title, message),
    warning: (title: string, message?: string) => store.addToast('warning', title, message),
    info: (title: string, message?: string) => store.addToast('info', title, message),
    dismiss: (id: string) => store.removeToast(id),
  }
}

// ─── Sample Data ────────────────────────────────────────────────────────

const sampleClients: any[] = []

const sampleRevenue: any[] = []

const samplePipeline: any[] = []

const sampleKPIs: any[] = []

const sampleClientTasks: any[] = []

const sampleAssets: any[] = []

const sampleCampaigns: any[] = []

const sampleSeoKeywords: any[] = []

const sampleEmailCampaigns: any[] = []

const sampleSocialPosts: any[] = []

const sampleContentPieces: any[] = []
const samplePortalInvites: any[] = []



const samplePitchDeals: any[] = []

const sampleDiscoveryCalls: any[] = []

const sampleMarketIntel: any[] = []

import { SITE_TEMPLATES } from '../types/website'


const sampleScopeChanges: any[] = []

const sampleContactLists: any[] = []

const sampleAutoresponders: any[] = []

const sampleEmailTemplates: any[] = []

// ─── Build from blueprint ──────────────────────────────────────────────

const buildAgents = (): Agent[] => []

const buildSkills = (): Skill[] => []

const buildProjects = (): Project[] => []

const buildTasks = (): Task[] => []

// ─── Store ──────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  dark: true,
  activeModule: 'dashboard',
  navHistory: [],
  agents: buildAgents(),
  skills: buildSkills(),
  projects: buildProjects(),
  tasks: buildTasks(),
  clients: sampleClients,
  clientTasks: sampleClientTasks,
  revenueHistory: sampleRevenue,
  pipeline: samplePipeline,
  kpis: sampleKPIs,
  creativeAssets: sampleAssets,
  campaigns: sampleCampaigns,
  seoKeywords: sampleSeoKeywords,
  emailCampaigns: sampleEmailCampaigns,
  socialPosts: sampleSocialPosts,
  contentPieces: sampleContentPieces,
  pitchDeals: samplePitchDeals,
  discoveryCalls: sampleDiscoveryCalls,
  marketIntel: sampleMarketIntel,
  scopeChanges: sampleScopeChanges,
  aiJobs: [],
  socialQueue: [],
  apiConfig: { baseUrl: '', apiKey: '', textModel: 'gpt-4', imageModel: 'dall-e-3', videoModel: 'runway-gen-3' },
  integrations: [],
  settings: { agencyName: 'Frantz Enterprise', agencyTagline: 'Full-Service Digital Agency', defaultTimezone: 'US/Central', currency: 'USD', dateFormat: 'MMMM D, YYYY', weekStartDay: 1, enableDarkByDefault: true, enableAutoBackup: false, backupIntervalHours: 24 },
  portalInvites: samplePortalInvites,
  clientApprovals: [],
  clientMessages: [],
  portalViewClientId: null,
  websites: [],
  websiteTemplates: SITE_TEMPLATES,
  invoices: [],
  payments: [],
  stripeConfig: { publishableKey: '', secretKey: '', webhookSecret: '', connected: false, connectedEmail: '' },
  weeklyNotes: [],
  loading: false,
  toasts: [],
  contactLists: sampleContactLists,
  autoresponders: sampleAutoresponders,
  emailTemplates: sampleEmailTemplates,

  addToast: (type, title, message) => set(s => ({
    toasts: [...s.toasts, createToast(type, title, message)],
  })),
  removeToast: (id) => set(s => ({
    toasts: s.toasts.filter(t => t.id !== id),
  })),
  toggleDark: () => set(s => ({ dark: !s.dark })),
  setActiveModule: (m) => set(s => ({ 
    activeModule: m, 
    navHistory: s.navHistory.length > 0 && s.navHistory[s.navHistory.length - 1] === s.activeModule 
      ? s.navHistory 
      : [...s.navHistory, s.activeModule] 
  })),
  goBack: () => set(s => {
    if (s.navHistory.length === 0) return {}
    const prev = s.navHistory[s.navHistory.length - 1]
    return { activeModule: prev, navHistory: s.navHistory.slice(0, -1) }
  }),

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

  addCreativeAsset: (a) => set(s => ({ creativeAssets: [...s.creativeAssets, { id: uid(), createdAt: new Date().toISOString(), version: 1, ...a }] })),
  updateCreativeAsset: (id, data) => set(s => ({ creativeAssets: s.creativeAssets.map(a => a.id === id ? { ...a, ...data } : a) })),
  addCampaign: (c) => set(s => ({ campaigns: [...s.campaigns, { id: uid(), ...c }] })),
  updateCampaign: (id, data) => set(s => ({ campaigns: s.campaigns.map(c => c.id === id ? { ...c, ...data } : c) })),
  addSeoKeyword: (k) => set(s => ({ seoKeywords: [...s.seoKeywords, { id: uid(), ...k }] })),
  updateSeoKeyword: (id, data) => set(s => ({ seoKeywords: s.seoKeywords.map(k => k.id === id ? { ...k, ...data } : k) })),
  addEmailCampaign: (e) => set(s => ({ emailCampaigns: [...s.emailCampaigns, { id: uid(), ...e }] })),
  updateEmailCampaign: (id, data) => set(s => ({ emailCampaigns: s.emailCampaigns.map(e => e.id === id ? { ...e, ...data } : e) })),
  addSocialPost: (p) => set(s => ({ socialPosts: [...s.socialPosts, { id: uid(), postedAt: '', likes: 0, comments: 0, shares: 0, impressions: 0, ...p }] })),
  updateSocialPost: (id, data) => set(s => ({ socialPosts: s.socialPosts.map(p => p.id === id ? { ...p, ...data } : p) })),
  addContentPiece: (c) => set(s => ({ contentPieces: [...s.contentPieces, { id: uid(), ...c }] })),
  updateContentPiece: (id, data) => set(s => ({ contentPieces: s.contentPieces.map(p => p.id === id ? { ...p, ...data } : p) })),
  deleteContentPiece: (id) => set(s => ({ contentPieces: s.contentPieces.filter(p => p.id !== id) })),
  addPitchDeal: (d) => set(s => ({ pitchDeals: [...s.pitchDeals, { id: uid(), createdAt: new Date().toISOString(), ...d }] })),
  updatePitchDeal: (id, data) => set(s => ({ pitchDeals: s.pitchDeals.map(d => d.id === id ? { ...d, ...data } : d) })),
  addDiscoveryCall: (d) => set(s => ({ discoveryCalls: [...s.discoveryCalls, { id: uid(), ...d }] })),
  updateDiscoveryCall: (id, data) => set(s => ({ discoveryCalls: s.discoveryCalls.map(d => d.id === id ? { ...d, ...data } : d) })),
  addMarketIntel: (m) => set(s => ({ marketIntel: [...s.marketIntel, { id: uid(), ...m }] })),
  updateMarketIntel: (id, data) => set(s => ({ marketIntel: s.marketIntel.map(m => m.id === id ? { ...m, ...data } : m) })),
  addScopeChange: (s) => set(s => ({ scopeChanges: [...s.scopeChanges, { id: uid(), detectedAt: new Date().toISOString().slice(0, 10), ...s }] })),
  updateScopeChange: (id, data) => set(s => ({ scopeChanges: s.scopeChanges.map(s => s.id === id ? { ...s, ...data } : s) })),
  addAiJob: (j) => set(s => ({ aiJobs: [...s.aiJobs, { id: uid(), status: 'pending', createdAt: new Date().toISOString().slice(0, 10), completedAt: '', ...j }] })),
  updateAiJob: (id, data) => set(s => ({ aiJobs: s.aiJobs.map(j => j.id === id ? { ...j, ...data } : j) })),
  addSocialQueueItem: (q) => set(s => ({ socialQueue: [...s.socialQueue, { id: uid(), ...q }] })),
  updateSocialQueueItem: (id, data) => set(s => ({ socialQueue: s.socialQueue.map(q => q.id === id ? { ...q, ...data } : q) })),
  updateApiConfig: (c) => set(s => ({ apiConfig: { ...s.apiConfig, ...c } })),
  addIntegration: (i) => set(s => ({ integrations: [...s.integrations, { id: uid(), connectedAt: new Date().toISOString(), lastVerified: '', ...i }] })),
  updateIntegration: (id, data) => set(s => ({ integrations: s.integrations.map(i => i.id === id ? { ...i, ...data } : i) })),
  removeIntegration: (id) => set(s => ({ integrations: s.integrations.filter(i => i.id !== id) })),
  updateSettings: (s) => set(s => ({ settings: { ...s.settings, ...s } })),
  addPortalInvite: (i) => set(s => ({ portalInvites: [...s.portalInvites, { id: uid(), createdAt: new Date().toISOString(), ...i }] })),
  updatePortalInvite: (id, data) => set(s => ({ portalInvites: s.portalInvites.map(i => i.id === id ? { ...i, ...data } : i) })),
  addClientApproval: (a) => set(s => ({ clientApprovals: [...s.clientApprovals, { id: uid(), submittedAt: new Date().toISOString(), ...a }] })),
  updateClientApproval: (id, data) => set(s => ({ clientApprovals: s.clientApprovals.map(a => a.id === id ? { ...a, ...data } : a) })),
  addClientMessage: (m) => set(s => ({ clientMessages: [...s.clientMessages, { id: uid(), createdAt: new Date().toISOString(), ...m }] })),
  updateClientMessage: (id, data) => set(s => ({ clientMessages: s.clientMessages.map(m => m.id === id ? { ...m, ...data } : m) })),
  setPortalViewClientId: (id) => set({ portalViewClientId: id }),

  addWebsite: (w) => set(s => ({ websites: [...s.websites, { id: uid(), createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10), ...w }] })),
  updateWebsite: (id, data) => set(s => ({ websites: s.websites.map(w => w.id === id ? { ...w, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : w) })),
  publishWebsite: (id) => set(s => ({ websites: s.websites.map(w => w.id === id ? { ...w, published: !w.published, lastPublishedAt: !w.published ? new Date().toISOString().slice(0, 10) : w.lastPublishedAt, updatedAt: new Date().toISOString().slice(0, 10) } : w) })),
  removeWebsite: (id) => set(s => ({ websites: s.websites.filter(w => w.id !== id) })),

  addInvoice: (inv) => set(s => ({ invoices: [...s.invoices, { id: uid(), createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10), ...inv }] })),
  updateInvoice: (id, data) => set(s => ({ invoices: s.invoices.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : i) })),
  deleteInvoice: (id) => set(s => ({ invoices: s.invoices.filter(i => i.id !== id) })),
  addPayment: (p) => set(s => ({ payments: [...s.payments, { id: uid(), createdAt: new Date().toISOString().slice(0, 10), ...p }] })),
  updateStripeConfig: (config) => set(s => ({ stripeConfig: { ...s.stripeConfig, ...config } })),

  addContactList: (c) => set(s => ({ contactLists: [...s.contactLists, { id: uid(), createdAt: new Date().toISOString().slice(0, 10), ...c }] })),
  updateContactList: (id, data) => set(s => ({ contactLists: s.contactLists.map(c => c.id === id ? { ...c, ...data } : c) })),
  addContactToList: (listId, contact) => set(s => ({
    contactLists: s.contactLists.map(c => c.id === listId ? { ...c, contacts: [...c.contacts, { id: uid(), createdAt: new Date().toISOString().slice(0, 10), lastOpened: '', lastClicked: '', totalOpens: 0, totalClicks: 0, ...contact }] } : c)
  })),
  removeContactFromList: (listId, contactId) => set(s => ({
    contactLists: s.contactLists.map(c => c.id === listId ? { ...c, contacts: c.contacts.filter(c => c.id !== contactId) } : c)
  })),
  updateContact: (listId, contactId, data) => set(s => ({
    contactLists: s.contactLists.map(c => c.id === listId ? { ...c, contacts: c.contacts.map(c => c.id === contactId ? { ...c, ...data } : c) } : c)
  })),
  addAutoresponder: (a) => set(s => ({ autoresponders: [...s.autoresponders, { id: uid(), createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10), ...a }] })),
  updateAutoresponder: (id, data) => set(s => ({ autoresponders: s.autoresponders.map(a => a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : a) })),
  addAutoresponderStep: (autoresponderId, step) => set(s => ({
    autoresponders: s.autoresponders.map(a => a.id === autoresponderId ? { ...a, steps: [...a.steps, { id: uid(), ...step }] } : a)
  })),
  removeAutoresponderStep: (autoresponderId, stepId) => set(s => ({
    autoresponders: s.autoresponders.map(a => a.id === autoresponderId ? { ...a, steps: a.steps.filter(s => s.id !== stepId) } : a)
  })),
  updateAutoresponderStep: (autoresponderId, stepId, data) => set(s => ({
    autoresponders: s.autoresponders.map(a => a.id === autoresponderId ? { ...a, steps: a.steps.map(s => s.id === stepId ? { ...s, ...data } : s) } : a)
  })),
  addEmailTemplate: (t) => set(s => ({ emailTemplates: [...s.emailTemplates, { id: uid(), createdAt: new Date().toISOString().slice(0, 10), ...t }] })),
  updateEmailTemplate: (id, data) => set(s => ({ emailTemplates: s.emailTemplates.map(t => t.id === id ? { ...t, ...data } : t) })),

  exportData: () => {
    const { agents, skills, projects, tasks, clients, clientTasks, revenueHistory, pipeline, kpis, weeklyNotes, creativeAssets, campaigns, seoKeywords, emailCampaigns, socialPosts, contentPieces, pitchDeals, discoveryCalls, marketIntel, scopeChanges, aiJobs, socialQueue, apiConfig, integrations, settings, portalInvites, clientApprovals, clientMessages, contactLists, autoresponders, emailTemplates, websites, websiteTemplates, invoices, payments, stripeConfig } = get()
    return JSON.stringify({ agents, skills, projects, tasks, clients, clientTasks, revenueHistory, pipeline, kpis, weeklyNotes, creativeAssets, campaigns, seoKeywords, emailCampaigns, socialPosts, contentPieces, pitchDeals, discoveryCalls, marketIntel, scopeChanges, aiJobs, socialQueue, apiConfig, integrations, settings, portalInvites, clientApprovals, clientMessages, contactLists, autoresponders, emailTemplates, websites, websiteTemplates, invoices, payments, stripeConfig, exportedAt: new Date().toISOString() }, null, 2)
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
        creativeAssets: data.creativeAssets || [],
        campaigns: data.campaigns || [],
        seoKeywords: data.seoKeywords || [],
        emailCampaigns: data.emailCampaigns || [],
        contactLists: data.contactLists || [],
        autoresponders: data.autoresponders || [],
        emailTemplates: data.emailTemplates || [],
        socialPosts: data.socialPosts || [],
        contentPieces: data.contentPieces || [],
        pitchDeals: data.pitchDeals || [],
        discoveryCalls: data.discoveryCalls || [],
        marketIntel: data.marketIntel || [],
        scopeChanges: data.scopeChanges || [],
        aiJobs: data.aiJobs || [],
        socialQueue: data.socialQueue || [],
        apiConfig: data.apiConfig || { baseUrl: '', apiKey: '', textModel: 'gpt-4', imageModel: 'dall-e-3', videoModel: 'runway-gen-3' },
        integrations: data.integrations || [],
        settings: data.settings || { agencyName: 'Frantz Enterprise', agencyTagline: 'Full-Service Digital Agency', defaultTimezone: 'US/Central', currency: 'USD', dateFormat: 'MMMM D, YYYY', weekStartDay: 1, enableDarkByDefault: true, enableAutoBackup: false, backupIntervalHours: 24 },
        portalInvites: data.portalInvites || [],
        clientApprovals: data.clientApprovals || [],
        clientMessages: data.clientMessages || [],
        websites: data.websites || [],
        websiteTemplates: data.websiteTemplates || SITE_TEMPLATES,
        invoices: data.invoices || [],
        payments: data.payments || [],
        stripeConfig: data.stripeConfig || { publishableKey: '', secretKey: '', webhookSecret: '', connected: false, connectedEmail: '' },
      })
      get().addToast('success', 'Data imported', `${data.clients?.length || 0} clients, ${data.agents?.length || 0} agents loaded`)
    } catch {
      get().addToast('error', 'Import failed', 'Invalid JSON file')
    }
  },

  resetData: () => {
    clearPersistedData()
    set({
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
      creativeAssets: sampleAssets,
      campaigns: sampleCampaigns,
      seoKeywords: sampleSeoKeywords,
      emailCampaigns: sampleEmailCampaigns,
      contactLists: sampleContactLists,
      autoresponders: sampleAutoresponders,
      emailTemplates: sampleEmailTemplates,
      socialPosts: sampleSocialPosts,
      contentPieces: sampleContentPieces,
      pitchDeals: samplePitchDeals,
      discoveryCalls: sampleDiscoveryCalls,
      marketIntel: sampleMarketIntel,
      scopeChanges: sampleScopeChanges,
      websites: [],
      websiteTemplates: SITE_TEMPLATES,
      invoices: [],
      payments: [],
      stripeConfig: { publishableKey: '', secretKey: '', webhookSecret: '', connected: false, connectedEmail: '' },
      aiJobs: [],
      socialQueue: [],
      apiConfig: { baseUrl: '', apiKey: '', textModel: 'gpt-4', imageModel: 'dall-e-3', videoModel: 'runway-gen-3' },
      integrations: [],
      settings: { agencyName: 'Frantz Enterprise', agencyTagline: 'Full-Service Digital Agency', defaultTimezone: 'US/Central', currency: 'USD', dateFormat: 'MMMM D, YYYY', weekStartDay: 1, enableDarkByDefault: true, enableAutoBackup: false, backupIntervalHours: 24 },
      portalInvites: samplePortalInvites,
      clientApprovals: [],
      clientMessages: [],
      portalViewClientId: null,
    })
    get().addToast('info', 'Data reset', 'Data cleared — starting fresh')
  },
}))
