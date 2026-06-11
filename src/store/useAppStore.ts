import { create } from 'zustand'

// Persistence keys shared with persistence.ts
const PERSIST_KEY = 'frantz…data'
function clearPersistedData() { try { localStorage.removeItem(PERSIST_KEY) } catch {} }
import { AGENT_DEFINITIONS, SKILL_DEFINITIONS, PROJECT_DEFINITIONS, TASK_DEFINITIONS } from '../types'
import type { Agent, Skill, Project, Task, Client, ClientTask, RevenueEntry, PipelineDeal, KPIEntry, WeeklyNote, CreativeAsset, Campaign, SeoKeyword, EmailCampaign, SocialPost, ContentPiece, PitchDeal, DiscoveryCall, MarketIntel, ScopeChange, AiGenerationJob, SocialQueueItem, ApiConfig, Integration, AgencySettings, PortalInvite, ClientApproval, ClientMessage, ContactList, ContactEntry, Autoresponder, AutoresponderStep, AutoresponderCondition, AutoresponderTrigger, AutoresponderTriggerType, AutoresponderStats, EmailTemplate, Website, WebsiteTemplate, Invoice, Payment, StripeConfig } from '../types'
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

const sampleAssets: CreativeAsset[] = [
  { id: uid(), clientId: sampleClients[0].id, type: 'social', name: 'BrightPath Q3 Post Series', description: '6 social graphics', status: 'client_review', assignee: 'brand-designer', dueDate: daysFromNow(2), createdAt: daysAgo(10), version: 3 },
  { id: uid(), clientId: sampleClients[0].id, type: 'video', name: 'BrightPath Testimonial', description: '60s patient video', status: 'editing', assignee: 'video-editor', dueDate: daysFromNow(10), createdAt: daysAgo(5), version: 1 },
  { id: uid(), clientId: sampleClients[1].id, type: 'email', name: 'Summit Spring Promo', description: 'Roof inspection email', status: 'qa', assignee: 'copywriter', dueDate: daysFromNow(4), createdAt: daysAgo(7), version: 2 },
  { id: uid(), clientId: sampleClients[1].id, type: 'social', name: 'Summit Social Q3', description: 'Weekly social posts', status: 'brief', assignee: 'creative-director', dueDate: daysFromNow(14), createdAt: daysAgo(1), version: 1 },
  { id: uid(), clientId: sampleClients[3].id, type: 'display', name: 'Coastal Luxury Banners', description: '3 display sizes', status: 'revisions', assignee: 'brand-designer', dueDate: daysAgo(3), createdAt: daysAgo(14), version: 4 },
  { id: uid(), clientId: sampleClients[4].id, type: 'social', name: 'Precision Auto Social', description: 'Monthly social calendar', status: 'approved', assignee: 'brand-designer', dueDate: daysAgo(5), createdAt: daysAgo(21), version: 2 },
]

const sampleCampaigns: Campaign[] = [
  { id: uid(), clientId: sampleClients[0].id, name: 'BrightPath Q3 Awareness', platform: 'meta', status: 'active', budget: 5000, spent: 3200, impressions: 145000, clicks: 4200, conversions: 185, startDate: daysAgo(30), endDate: daysFromNow(60), notes: 'Local zip targeting, ages 35-55' },
  { id: uid(), clientId: sampleClients[1].id, name: 'Summit Roofing Search', platform: 'google', status: 'active', budget: 3000, spent: 2100, impressions: 82000, clicks: 1900, conversions: 45, startDate: daysAgo(45), endDate: daysFromNow(45), notes: 'Seasonal roofing keywords' },
  { id: uid(), clientId: sampleClients[2].id, name: 'Verdant Lawn Care LinkedIn', platform: 'linkedin', status: 'draft', budget: 2000, spent: 0, impressions: 0, clicks: 0, conversions: 0, startDate: daysFromNow(7), endDate: daysFromNow(90), notes: 'B2B targeting commercial properties' },
  { id: uid(), clientId: sampleClients[3].id, name: 'Coastal Realty Retargeting', platform: 'meta', status: 'paused', budget: 4000, spent: 2800, impressions: 98000, clicks: 2100, conversions: 32, startDate: daysAgo(60), endDate: daysFromNow(30), notes: 'Retargeting leads from open houses' },
]

const sampleSeoKeywords: SeoKeyword[] = [
  { id: uid(), clientId: sampleClients[0].id, keyword: 'dentist near me', volume: 14500, difficulty: 72, position: 8, previousPosition: 11, url: '/locations', lastChecked: daysAgo(1) },
  { id: uid(), clientId: sampleClients[0].id, keyword: 'cosmetic dentistry', volume: 8200, difficulty: 68, position: 12, previousPosition: 14, url: '/cosmetic', lastChecked: daysAgo(1) },
  { id: uid(), clientId: sampleClients[1].id, keyword: 'roof repair cost', volume: 6200, difficulty: 55, position: 5, previousPosition: 6, url: '/roof-repair', lastChecked: daysAgo(2) },
  { id: uid(), clientId: sampleClients[1].id, keyword: 'roof replacement', volume: 9800, difficulty: 62, position: 9, previousPosition: 9, url: '/replacement', lastChecked: daysAgo(2) },
]

const sampleEmailCampaigns: EmailCampaign[] = [
  { id: uid(), clientId: sampleClients[0].id, name: 'Monthly Newsletter June', type: 'newsletter', status: 'completed', recipients: 3400, sent: 3350, opens: 1250, clicks: 410, bounces: 50, createdAt: daysAgo(14), scheduledFor: daysAgo(10) },
  { id: uid(), clientId: sampleClients[0].id, name: 'New Patient Welcome Drip', type: 'lifecycle', status: 'active', recipients: 120, sent: 85, opens: 68, clicks: 42, bounces: 2, createdAt: daysAgo(7), scheduledFor: '' },
  { id: uid(), clientId: sampleClients[3].id, name: 'Luxury Listing Alert', type: 'promo', status: 'draft', recipients: 0, sent: 0, opens: 0, clicks: 0, bounces: 0, createdAt: daysAgo(1), scheduledFor: daysFromNow(5) },
  { id: uid(), clientId: sampleClients[4].id, name: 'Service Reminder Sequence', type: 'lifecycle', status: 'active', recipients: 450, sent: 380, opens: 210, clicks: 130, bounces: 8, createdAt: daysAgo(30), scheduledFor: '' },
]

const sampleSocialPosts: SocialPost[] = [
  { id: uid(), clientId: sampleClients[0].id, platform: 'facebook', content: 'Did you know? Regular dental check-ups can prevent serious health issues. Book your appointment today!', mediaUrl: '', status: 'posted', scheduledFor: daysAgo(3), postedAt: daysAgo(3), likes: 42, comments: 8, shares: 12, impressions: 3400 },
  { id: uid(), clientId: sampleClients[0].id, platform: 'instagram', content: 'Summer smile special! ✨ 20% off whitening for new patients. Link in bio.', mediaUrl: '', status: 'scheduled', scheduledFor: daysFromNow(1), postedAt: '', likes: 0, comments: 0, shares: 0, impressions: 0 },
  { id: uid(), clientId: sampleClients[1].id, platform: 'linkedin', content: 'Protect your investment. Annual roof inspections catch small issues before they become expensive repairs.', mediaUrl: '', status: 'posted', scheduledFor: daysAgo(5), postedAt: daysAgo(5), likes: 28, comments: 5, shares: 9, impressions: 2100 },
  { id: uid(), clientId: sampleClients[1].id, platform: 'facebook', content: 'Spring is here! Get your roof inspection before the summer storms roll in. Free estimates.', mediaUrl: '', status: 'scheduled', scheduledFor: daysFromNow(3), postedAt: '', likes: 0, comments: 0, shares: 0, impressions: 0 },
  { id: uid(), clientId: sampleClients[4].id, platform: 'facebook', content: 'Tire rotation special this month! Keep your vehicle running smoothly with Precision Auto.', mediaUrl: '', status: 'posted', scheduledFor: daysAgo(1), postedAt: daysAgo(1), likes: 15, comments: 3, shares: 5, impressions: 1200 },
]

const sampleContentPieces: ContentPiece[] = [
  { id: uid(), clientId: sampleClients[0].id, type: 'blog_post', title: '10 Signs You Need a Dental Check-Up', status: 'published', assignee: 'copywriter', dueDate: daysAgo(7), publishedAt: daysAgo(5), url: '/blog/dental-checkup-signs', outline: 'Intro, Sign 1-10, Conclusion', body: 'Lorem ipsum...', seoKeywords: ['dental checkup', 'dentist near me'], wordCount: 1200, tone: 'educational', targetAudience: 'Adults 25-55', scheduledAt: '', socialPost: 'Wondering if its time for a dental checkup. Here are 10 signs you should not ignore. 🦷', generatedWithAi: true },
    { id: uid(), clientId: sampleClients[0].id, type: 'video', title: 'Dental Implant Procedure Walkthrough', status: 'editing', assignee: 'video-editor', dueDate: daysFromNow(7), publishedAt: '', url: '', outline: '', body: '', seoKeywords: ['dental implants', 'implant procedure'], wordCount: 0, tone: 'educational', targetAudience: 'Adults 40-65', scheduledAt: daysFromNow(10), socialPost: 'See exactly how dental implants work from start to finish. 🎬', generatedWithAi: false },
    { id: uid(), clientId: sampleClients[1].id, type: 'blog_post', title: 'How to Choose a Roofing Contractor', status: 'published', assignee: 'copywriter', dueDate: daysAgo(14), publishedAt: daysAgo(12), url: '/blog/choose-roofing-contractor', outline: '', body: '', seoKeywords: ['roofing contractor', 'roof repair'], wordCount: 1500, tone: 'professional', targetAudience: 'Homeowners 35-65', scheduledAt: '', socialPost: 'Dont hire a roofer without reading this guide first. 🏠', generatedWithAi: true },
    { id: uid(), clientId: sampleClients[1].id, type: 'infographic', title: 'Roof Materials Comparison Guide', status: 'production', assignee: 'brand-designer', dueDate: daysFromNow(14), publishedAt: '', url: '', outline: '', body: '', seoKeywords: ['roof materials', 'shingles vs metal'], wordCount: 0, tone: 'educational', targetAudience: 'Homeowners', scheduledAt: '', socialPost: 'Which roof material is right for you. Here is the breakdown. 📊', generatedWithAi: false },
    { id: uid(), clientId: sampleClients[4].id, type: 'case_study', title: 'Fleet Maintenance Cost Reduction Case Study', status: 'brief', assignee: 'strategist', dueDate: daysFromNow(21), publishedAt: '', url: '', outline: 'Executive Summary, Challenge, Solution, Results', body: 'Draft needed...', seoKeywords: ['fleet maintenance', 'cost reduction'], wordCount: 0, tone: 'professional', targetAudience: 'Fleet managers', scheduledAt: '', socialPost: 'How one fleet saved 32% on maintenance costs. 🚛', generatedWithAi: false },
    { id: uid(), clientId: sampleClients[3].id, type: 'social_asset', title: 'Luxury Home Buyer Guide Carousel', status: 'production', assignee: 'brand-designer', dueDate: daysFromNow(5), publishedAt: '', url: '', outline: '', body: '', seoKeywords: ['luxury real estate', 'home buying guide'], wordCount: 0, tone: 'persuasive', targetAudience: 'High-net-worth buyers', scheduledAt: daysFromNow(6), socialPost: 'Thinking about buying a luxury home. Here is what you need to know. 🏡✨', generatedWithAi: false },
    { id: uid(), clientId: sampleClients[2].id, type: 'podcast', title: 'Real Estate Market Trends 2026', status: 'brief', assignee: 'brian', dueDate: daysFromNow(10), publishedAt: '', url: '', outline: 'Intro, Market overview, Regional trends, Q&A', body: '', seoKeywords: ['real estate trends', '2026 housing market'], wordCount: 0, tone: 'conversational', targetAudience: 'Real estate professionals', scheduledAt: '', socialPost: 'Tune in to our latest podcast on 2026 real estate trends! 🎙️', generatedWithAi: false },
    { id: uid(), clientId: sampleClients[0].id, type: 'landing_page', title: 'BrightPath Dental Free Consultation', status: 'review', assignee: 'copywriter', dueDate: daysFromNow(3), publishedAt: '', url: '', outline: 'Hero, Benefits, Testimonials, CTA', body: 'Book your free consultation today...', seoKeywords: ['free dental consultation', 'BrightPath Dental'], wordCount: 400, tone: 'persuasive', targetAudience: 'New dental patients', scheduledAt: '', socialPost: 'New patients: get a free consultation at BrightPath Dental! 🦷', generatedWithAi: true },
]
const samplePortalInvites: PortalInvite[] = [
  { id: uid(), clientId: sampleClients[0].id, token: 'demo-brightpath-2026', email: 'sarah@brightpathdental.com', contactName: 'Sarah Chen', status: 'active', createdAt: daysAgo(30), lastAccessedAt: daysAgo(2), expiresAt: daysFromNow(335) },
  { id: uid(), clientId: sampleClients[1].id, token: 'demo-summit-2026', email: 'mike@summitroofing.com', contactName: 'Mike Torres', status: 'active', createdAt: daysAgo(14), lastAccessedAt: daysAgo(1), expiresAt: daysFromNow(351) },
  { id: uid(), clientId: sampleClients[3].id, token: 'demo-coastal-2026', contactName: 'James Wilson', status: 'pending', createdAt: daysAgo(7), lastAccessedAt: '', expiresAt: daysFromNow(358) },
]



const samplePitchDeals: PitchDeal[] = [
  { id: uid(), company: 'BayView Medical Group', contact: 'Dr. James Wong', contactRole: 'CEO', targetTier: 'Scale', estimatedMRR: 7500, stage: 'negotiating', stageOrder: 6, notes: 'Very interested in full-service. Budget approved.', nextStep: 'Send final SOW with pricing', createdAt: daysAgo(21) },
  { id: uid(), company: 'Metro Insurance Brokers', contact: 'Lisa Adams', contactRole: 'VP Marketing', targetTier: 'Growth', estimatedMRR: 5500, stage: 'discovery_done', stageOrder: 4, notes: 'Discovery completed. Identified content + paid media needs.', nextStep: 'Draft proposal by Friday', createdAt: daysAgo(14) },
  { id: uid(), company: 'NovaTech Solutions', contact: 'Sarah Chen', contactRole: 'CMO', targetTier: 'Growth', estimatedMRR: 5000, stage: 'proposal_sent', stageOrder: 5, notes: 'Proposal sent. Competitive situation.', nextStep: 'Follow up Thursday', createdAt: daysAgo(10) },
  { id: uid(), company: 'Elite Fitness Clubs', contact: 'Mark Torres', contactRole: 'Owner', targetTier: 'Scale', estimatedMRR: 8000, stage: 'discovery_scheduled', stageOrder: 3, notes: 'Discovery call scheduled for next Tuesday.', nextStep: 'Prep discovery deck', createdAt: daysAgo(5) },
  { id: uid(), company: 'Greenleaf Organics', contact: 'David Park', contactRole: 'Director', targetTier: 'Foundation', estimatedMRR: 2500, stage: 'contacted', stageOrder: 2, notes: 'Initial email sent. No reply yet.', nextStep: 'Send follow-up email', createdAt: daysAgo(3) },
  { id: uid(), company: 'Heritage Bank Local', contact: 'Jennifer Walsh', contactRole: 'SVP Marketing', targetTier: 'Growth', estimatedMRR: 4500, stage: 'research', stageOrder: 1, notes: 'Added to target list from industry research.', nextStep: 'Research and find contact info', createdAt: daysAgo(1) },
]

const sampleDiscoveryCalls: DiscoveryCall[] = [
  { id: uid(), company: 'BayView Medical Group', contact: 'Dr. James Wong', scheduledAt: daysAgo(7), duration: 45, status: 'completed', qualificationScore: 85, needsIdentified: ['Brand positioning', 'Patient acquisition', 'Content strategy'], budgetRange: '$7k-10k/mo', timeline: 'Next 30 days', decisionMaker: true, notes: 'Strong fit for Scale tier. Decision maker engaged.' },
  { id: uid(), company: 'Metro Insurance Brokers', contact: 'Lisa Adams', scheduledAt: daysAgo(10), duration: 40, status: 'completed', qualificationScore: 70, needsIdentified: ['Content pipeline', 'Paid media management', 'Social media'], budgetRange: '$4k-6k/mo', timeline: 'Next 45 days', decisionMaker: false, notes: 'Needs to loop in VP. Good engagement.' },
  { id: uid(), company: 'Elite Fitness Clubs', contact: 'Mark Torres', scheduledAt: daysFromNow(4), duration: 30, status: 'scheduled', qualificationScore: 0, needsIdentified: [], budgetRange: '', timeline: '', decisionMaker: false, notes: 'Discovery call scheduled.' },
]

const sampleMarketIntel: MarketIntel[] = [
  { id: uid(), clientId: sampleClients[0].id, type: 'competitor', title: 'Aspen Dental - Ad Spend Analysis', summary: 'Aspen Dental increasing local search spend ~30% QoQ in metro areas.', source: 'SEMrush', date: daysAgo(2), relevance: 'high' },
  { id: uid(), clientId: sampleClients[0].id, type: 'keyword', title: 'Dental Implant Search Trends', summary: '"dental implants" search up 18% YoY. Local intent keywords growing.', source: 'Google Trends', date: daysAgo(3), relevance: 'high' },
  { id: uid(), clientId: sampleClients[1].id, type: 'industry', title: 'Roofing Industry Seasonality Report', summary: 'Q2-Q3 peak season. Competitor ad spend spikes April-June.', source: 'IBISWorld', date: daysAgo(5), relevance: 'high' },
  { id: uid(), clientId: sampleClients[3].id, type: 'benchmark', title: 'Real Estate Marketing Benchmarks', summary: 'Avg. real estate agency spends 8-12% of revenue on marketing.', source: 'NAEA', date: daysAgo(7), relevance: 'medium' },
]

import { SITE_TEMPLATES, buildSampleSites } from '../types/website'
import { buildSampleInvoices, buildSamplePayments } from '../types/invoicing'

const sampleScopeChanges: ScopeChange[] = [
  { id: uid(), clientId: sampleClients[0].id, description: 'Unplanned video testimonial shoot added mid-cycle, no SOW amendment', impact: 'minor', status: 'detected', detectedAt: daysAgo(1), resolvedAt: '', mrrImpact: 0, notes: 'Account manager approved verbally. Needs formal amendment.' },
  { id: uid(), clientId: sampleClients[3].id, description: 'Additional 4 social posts per week requested without scope discussion', impact: 'minor', status: 'triaged', detectedAt: daysAgo(3), resolvedAt: '', mrrImpact: 500, notes: 'Triaged. Estimated 2h/week extra. Amendment drafted.' },
  { id: uid(), clientId: sampleClients[1].id, description: 'Requesting weekly reporting package instead of monthly (3x reporting effort)', impact: 'moderate', status: 'amendment_drafted', detectedAt: daysAgo(7), resolvedAt: '', mrrImpact: 750, notes: 'Amendment ready for client review. +$750/mo for expanded reporting.' },
]

const sampleContactLists: ContactList[] = [
  { id: uid(), clientId: sampleClients[0].id, name: 'BrightPath Patient Newsletter', description: 'All active dental patients for monthly newsletter campaign', contacts: [
    { id: uid(), email: 'john.doe@email.com', name: 'John Doe', company: '', phone: '555-0101', tags: ['patient', 'established'], source: 'manual', subscribed: true, subscribedAt: daysAgo(120), unsubscribedAt: '', lastOpened: daysAgo(3), lastClicked: daysAgo(7), totalOpens: 24, totalClicks: 8, createdAt: daysAgo(120) },
    { id: uid(), email: 'jane.smith@email.com', name: 'Jane Smith', company: '', phone: '555-0102', tags: ['patient', 'new'], source: 'webform', subscribed: true, subscribedAt: daysAgo(30), unsubscribedAt: '', lastOpened: daysAgo(1), lastClicked: daysAgo(2), totalOpens: 6, totalClicks: 3, createdAt: daysAgo(30) },
    { id: uid(), email: 'bob.wilson@email.com', name: 'Bob Wilson', company: '', phone: '555-0103', tags: ['patient', 'vip'], source: 'manual', subscribed: true, subscribedAt: daysAgo(365), unsubscribedAt: '', lastOpened: daysAgo(0), lastClicked: daysAgo(1), totalOpens: 56, totalClicks: 22, createdAt: daysAgo(365) },
    { id: uid(), email: 'alice.brown@email.com', name: 'Alice Brown', company: '', phone: '555-0104', tags: ['lead', 'consultation'], source: 'webform', subscribed: true, subscribedAt: daysAgo(14), unsubscribedAt: '', lastOpened: daysAgo(0), lastClicked: '', totalOpens: 3, totalClicks: 0, createdAt: daysAgo(14) },
  ], tags: ['patient', 'newsletter', 'active'], createdAt: daysAgo(120) },
  { id: uid(), clientId: sampleClients[1].id, name: 'Summit Roofing Prospects', description: 'Lead list from roofing estimate requests and website forms', contacts: [
    { id: uid(), email: 'mike.johnson@email.com', name: 'Mike Johnson', company: 'Johnson Properties', phone: '555-0201', tags: ['commercial', 'estimate'], source: 'webform', subscribed: true, subscribedAt: daysAgo(45), unsubscribedAt: '', lastOpened: daysAgo(2), lastClicked: daysAgo(5), totalOpens: 8, totalClicks: 3, createdAt: daysAgo(45) },
    { id: uid(), email: 'sarah.davis@email.com', name: 'Sarah Davis', company: '', phone: '555-0202', tags: ['residential', 'roof-repair'], source: 'lead', subscribed: true, subscribedAt: daysAgo(21), unsubscribedAt: '', lastOpened: daysAgo(1), lastClicked: '', totalOpens: 4, totalClicks: 0, createdAt: daysAgo(21) },
  ], tags: ['roofing', 'prospects', 'residential', 'commercial'], createdAt: daysAgo(60) },
  { id: uid(), clientId: sampleClients[3].id, name: 'Coastal Realty Buyer Leads', description: 'Qualified buyer leads for luxury property listings', contacts: [
    { id: uid(), email: 'david.miller@email.com', name: 'David Miller', company: 'Miller Financial', phone: '555-0301', tags: ['buyer', 'luxury', 'active'], source: 'lead', subscribed: true, subscribedAt: daysAgo(60), unsubscribedAt: '', lastOpened: daysAgo(0), lastClicked: daysAgo(0), totalOpens: 18, totalClicks: 7, createdAt: daysAgo(60) },
  ], tags: ['real-estate', 'buyers', 'luxury'], createdAt: daysAgo(90) },
]

const sampleAutoresponders: Autoresponder[] = [
  {
    id: uid(), clientId: sampleClients[0].id, name: 'New Patient Welcome Sequence', description: '5-email onboarding drip for new dental patients', status: 'active',
    trigger: { type: 'subscribed', value: '', description: 'When a new contact subscribes to the BrightPath newsletter list' },
    steps: [
      { id: uid(), order: 1, delayDays: 0, delayHours: 0, action: 'send_email', emailTemplateId: '', subject: 'Welcome to BrightPath Dental! 🦷', body: '<h2>Welcome to the BrightPath family!</h2><p>We\'re thrilled to have you on board. Here\'s what you can expect from us:</p><ul><li>Monthly dental health tips</li><li>Exclusive patient offers</li><li>New service announcements</li></ul><p><a href="#">Book your next appointment</a></p>', conditions: [] },
      { id: uid(), order: 2, delayDays: 3, delayHours: 0, action: 'send_email', emailTemplateId: '', subject: '5 Tips for a Brighter Smile', body: '<h2>5 Tips for a Brighter Smile</h2><p>Our top dentist-recommended tips for maintaining healthy teeth between visits...</p><p><a href="#">Read the full guide</a></p>', conditions: [{ field: 'opened', operator: 'is', value: 'true' }] },
      { id: uid(), order: 3, delayDays: 7, delayHours: 0, action: 'send_email', emailTemplateId: '', subject: 'Your First Visit Guide', body: '<h2>What to Expect at Your First Visit</h2><p>Getting nervous? Don\'t be! Here\'s a step-by-step guide to your first appointment...</p>', conditions: [] },
      { id: uid(), order: 4, delayDays: 14, delayHours: 0, action: 'send_email', emailTemplateId: '', subject: 'Patient Rewards Program', body: '<h2>You Could Save $100+ Per Year</h2><p>Did you know about our patient rewards program? Earn points for every visit...</p>', conditions: [{ field: 'clicked', operator: 'is', value: 'true' }] },
      { id: uid(), order: 5, delayDays: 30, delayHours: 0, action: 'send_email', emailTemplateId: '', subject: 'We Miss You!', body: '<p>It\'s been a while since we last connected. Here\'s a special offer just for you...</p>', conditions: [] },
    ],
    stats: { totalTriggered: 340, activeInSequence: 68, completedSequence: 245, unsubscribed: 12, totalSent: 1250, totalOpens: 890, totalClicks: 445, totalBounces: 18, conversionRate: 34.5 },
    createdAt: daysAgo(90), updatedAt: daysAgo(5),
  },
  {
    id: uid(), clientId: sampleClients[1].id, name: 'Roofing Estimate Follow-Up', description: '3-email sequence after someone requests a roofing estimate', status: 'active',
    trigger: { type: 'form_submitted', value: 'estimate_request', description: 'When a contact submits a roofing estimate request form' },
    steps: [
      { id: uid(), order: 1, delayDays: 0, delayHours: 1, action: 'send_email', emailTemplateId: '', subject: 'Thanks for Your Roofing Request!', body: '<h2>We\'ll Be in Touch Shortly</h2><p>Thank you for reaching out! A Summit Roofing specialist will contact you within 24 hours to schedule your free estimate.</p><p>In the meantime, check out our <a href="#">recent projects gallery</a>.</p>', conditions: [] },
      { id: uid(), order: 2, delayDays: 3, delayHours: 0, action: 'send_email', emailTemplateId: '', subject: 'Thinking About Roof Materials?', body: '<h2>Choosing the Right Roof</h2><p>Here\'s our guide to asphalt shingles vs metal roofing vs tile...</p>', conditions: [] },
      { id: uid(), order: 3, delayDays: 14, delayHours: 0, action: 'send_email', emailTemplateId: '', subject: 'Still Considering a New Roof?', body: '<p>Just checking in! Summer is our busiest season. Lock in your spring pricing today.</p>', conditions: [{ field: 'clicked', operator: 'is_not', value: 'true' }] },
    ],
    stats: { totalTriggered: 180, activeInSequence: 42, completedSequence: 110, unsubscribed: 5, totalSent: 420, totalOpens: 290, totalClicks: 155, totalBounces: 8, conversionRate: 22.8 },
    createdAt: daysAgo(60), updatedAt: daysAgo(3),
  },
  {
    id: uid(), clientId: sampleClients[4].id, name: 'Service Reminder Campaign', description: 'Annual service reminders for Precision Auto Works customers', status: 'active',
    trigger: { type: 'date_reached', value: 'last_service + 11 months', description: '11 months after last service date' },
    steps: [
      { id: uid(), order: 1, delayDays: 0, delayHours: 0, action: 'send_email', emailTemplateId: '', subject: 'Time for Your Service Check!', body: '<h2>It\'s Almost Been a Year!</h2><p>Your Precision Auto Works service reminder — schedule your annual maintenance check today.</p><p><a href="#">Book Now</a></p>', conditions: [] },
      { id: uid(), order: 2, delayDays: 14, delayHours: 0, action: 'send_email', emailTemplateId: '', subject: 'Last Chance — Service Special', body: '<p>This month only: 10% off all scheduled maintenance services. Don\'t let your warranty lapse!</p>', conditions: [{ field: 'opened', operator: 'is_not', value: 'true' }] },
    ],
    stats: { totalTriggered: 620, activeInSequence: 0, completedSequence: 580, unsubscribed: 22, totalSent: 1860, totalOpens: 1340, totalClicks: 680, totalBounces: 30, conversionRate: 42.1 },
    createdAt: daysAgo(180), updatedAt: daysAgo(10),
  },
]

const sampleEmailTemplates: EmailTemplate[] = [
  { id: uid(), clientId: sampleClients[0].id, name: 'Monthly Newsletter Template', subject: '{{client_name}} Monthly Update: {{month}}', previewText: 'Your monthly update from the team', body: '<h2>{{title}}</h2><p>{{body_content}}</p><p><a href="{{cta_url}}">{{cta_text}}</a></p>', category: 'educational', lastUsed: daysAgo(14), createdAt: daysAgo(120) },
  { id: uid(), clientId: sampleClients[0].id, name: 'Appointment Reminder', subject: 'Reminder: Your Appointment at {{client_name}}', previewText: 'You have an appointment coming up', body: '<p>Hi {{first_name}},</p><p>This is a friendly reminder about your upcoming appointment at {{client_name}} on {{appointment_date}}.</p><p><a href="{{reschedule_url}}">Reschedule if needed</a></p>', category: 'transactional', lastUsed: daysAgo(1), createdAt: daysAgo(180) },
  { id: uid(), clientId: sampleClients[1].id, name: 'Estimate Follow-Up', subject: 'Your Roofing Estimate from Summit Roofing', previewText: 'Details about your recent roofing estimate', body: '<h2>Your Estimate Summary</h2><p>Hi {{first_name}},</p><p>As requested, here\'s a summary of your roofing estimate...</p>', category: 'transactional', lastUsed: daysAgo(3), createdAt: daysAgo(60) },
  { id: uid(), clientId: sampleClients[3].id, name: 'New Listing Alert', subject: 'Just Listed: {{property_address}}', previewText: 'A new property just hit the market', body: '<h2>New Listing!</h2><p>We\'re excited to present {{property_description}}.</p><p><a href="{{listing_url}}">View Property Details</a></p>', category: 'promotional', lastUsed: daysAgo(7), createdAt: daysAgo(90) },
  { id: uid(), clientId: sampleClients[4].id, name: 'Service Due Reminder', subject: 'Your Vehicle is Due for Service', previewText: 'Schedule your service appointment today', body: '<h2>Service Reminder</h2><p>Hi {{first_name}},</p><p>Your {{vehicle_make_model}} is due for {{service_type}}.</p>', category: 'lifecycle', lastUsed: daysAgo(5), createdAt: daysAgo(180) },
  { id: uid(), clientId: '', name: 'Re-engagement Email', subject: 'We Miss You at {{client_name}}', previewText: 'Come back for a special offer', body: '<h2>It\'s Been a While...</h2><p>We noticed you haven\'t visited lately. Here\'s a special offer just for you.</p>', category: 'reengagement', lastUsed: daysAgo(30), createdAt: daysAgo(200) },
  { id: uid(), clientId: '', name: 'Thank You Page Follow-Up', subject: 'Thanks for Your Interest!', previewText: 'Here\'s what happens next', body: '<h2>Thank You!</h2><p>We received your request and will be in touch shortly.</p>', category: 'transactional', lastUsed: daysAgo(2), createdAt: daysAgo(150) },
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
  websites: buildSampleSites(),
  websiteTemplates: SITE_TEMPLATES,
  invoices: buildSampleInvoices(),
  payments: buildSamplePayments(),
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
  setActiveModule: (m) => set(s => ({ activeModule: m, navHistory: [...s.navHistory, s.activeModule] })),
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
      websites: buildSampleSites(),
      websiteTemplates: SITE_TEMPLATES,
      invoices: buildSampleInvoices(),
      payments: buildSamplePayments(),
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
    get().addToast('info', 'Data reset', 'Sample data reloaded')
  },
}))
