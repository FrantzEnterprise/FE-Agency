import { create } from 'zustand'
import { AGENT_DEFINITIONS, SKILL_DEFINITIONS, PROJECT_DEFINITIONS, TASK_DEFINITIONS } from '../types'
import type { Agent, Skill, Project, Task, Client, ClientTask, RevenueEntry, PipelineDeal, KPIEntry, WeeklyNote, CreativeAsset, Campaign, SeoKeyword, EmailCampaign, SocialPost, ContentPiece, PitchDeal, DiscoveryCall, MarketIntel, ScopeChange, AiGenerationJob, SocialQueueItem, ApiConfig, Integration, AgencySettings } from '../types'

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
  { id: uid(), clientId: sampleClients[0].id, type: 'blog', title: '10 Signs You Need a Dental Check-Up', status: 'published', assignee: 'copywriter', dueDate: daysAgo(7), publishedAt: daysAgo(5), url: '/blog/dental-checkup-signs' },
  { id: uid(), clientId: sampleClients[0].id, type: 'video', title: 'Dental Implant Procedure Walkthrough', status: 'editing', assignee: 'video-editor', dueDate: daysFromNow(7), publishedAt: '', url: '' },
  { id: uid(), clientId: sampleClients[1].id, type: 'blog', title: 'How to Choose a Roofing Contractor', status: 'published', assignee: 'copywriter', dueDate: daysAgo(14), publishedAt: daysAgo(12), url: '/blog/choose-roofing-contractor' },
  { id: uid(), clientId: sampleClients[1].id, type: 'infographic', title: 'Roof Materials Comparison Guide', status: 'production', assignee: 'brand-designer', dueDate: daysFromNow(14), publishedAt: '', url: '' },
  { id: uid(), clientId: sampleClients[4].id, type: 'case_study', title: 'Fleet Maintenance Cost Reduction Case Study', status: 'brief', assignee: 'strategist', dueDate: daysFromNow(21), publishedAt: '', url: '' },
  { id: uid(), clientId: sampleClients[3].id, type: 'social_asset', title: 'Luxury Home Buyer Guide Carousel', status: 'production', assignee: 'brand-designer', dueDate: daysFromNow(5), publishedAt: '', url: '' },
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

const sampleScopeChanges: ScopeChange[] = [
  { id: uid(), clientId: sampleClients[0].id, description: 'Unplanned video testimonial shoot added mid-cycle, no SOW amendment', impact: 'minor', status: 'detected', detectedAt: daysAgo(1), resolvedAt: '', mrrImpact: 0, notes: 'Account manager approved verbally. Needs formal amendment.' },
  { id: uid(), clientId: sampleClients[3].id, description: 'Additional 4 social posts per week requested without scope discussion', impact: 'minor', status: 'triaged', detectedAt: daysAgo(3), resolvedAt: '', mrrImpact: 500, notes: 'Triaged. Estimated 2h/week extra. Amendment drafted.' },
  { id: uid(), clientId: sampleClients[1].id, description: 'Requesting weekly reporting package instead of monthly (3x reporting effort)', impact: 'moderate', status: 'amendment_drafted', detectedAt: daysAgo(7), resolvedAt: '', mrrImpact: 750, notes: 'Amendment ready for client review. +$750/mo for expanded reporting.' },
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
  updateContentPiece: (id, data) => set(s => ({ contentPieces: s.contentPieces.map(c => c.id === id ? { ...c, ...data } : c) })),
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

  exportData: () => {
    const { agents, skills, projects, tasks, clients, clientTasks, revenueHistory, pipeline, kpis, weeklyNotes, creativeAssets, campaigns, seoKeywords, emailCampaigns, socialPosts, contentPieces, pitchDeals, discoveryCalls, marketIntel, scopeChanges, aiJobs, socialQueue, apiConfig, integrations, settings } = get()
    return JSON.stringify({ agents, skills, projects, tasks, clients, clientTasks, revenueHistory, pipeline, kpis, weeklyNotes, creativeAssets, campaigns, seoKeywords, emailCampaigns, socialPosts, contentPieces, pitchDeals, discoveryCalls, marketIntel, scopeChanges, aiJobs, socialQueue, apiConfig, integrations, settings, exportedAt: new Date().toISOString() }, null, 2)
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
  }),
}))
