// ─── Agency Entity Types ──────────────────────────────────────────────

export interface Agent {
  id: string
  slug: string
  name: string
  title: string
  reportsTo: string | null
  skills: string[]
  status: 'active' | 'idle' | 'busy'
  utilization: number // percentage
  lastActive: string // ISO date
}

export interface Skill {
  id: string
  name: string
  description: string
  usedBy: string[] // agent slugs
  category: 'creative' | 'operations' | 'accounts' | 'strategy' | 'finance'
}

export interface Project {
  id: string
  slug: string
  name: string
  description: string
  owner: string // agent slug
  status: 'in_progress' | 'completed' | 'at_risk' | 'blocked'
  successCondition: string
  deliverables: string[]
  startedAt: string
  etd: string // estimated delivery
}

export interface Task {
  id: string
  slug: string
  name: string
  description: string
  projectId: string
  assignee: string // agent slug
  status: 'todo' | 'in_progress' | 'completed' | 'blocked'
  completionCriteria: string[]
  startedAt: string
  dueAt: string
}

export interface Client {
  id: string
  name: string
  industry: string
  retainerTier: 'Foundation' | 'Growth' | 'Scale'
  mrr: number
  status: 'active' | 'onboarding' | 'at_risk' | 'churned'
  health: 'green' | 'yellow' | 'red'
  since: string
  lastQBR: string
  nextRenewal: string
}

export interface ClientTask {
  id: string
  clientId: string
  name: string
  dueDate: string
  status: 'pending' | 'completed' | 'overdue'
  assignee: string
  phase: 'plan' | 'run' | 'report' | 'qbr'
}

export interface RevenueEntry {
  month: string
  mrr: number
  retainers: number
  projects: number
}

export interface PipelineDeal {
  id: string
  company: string
  contact: string
  tier: 'Foundation' | 'Growth' | 'Scale'
  estimatedMRR: number
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  stageOrder: number
  probability: number
}

export interface KPIEntry {
  metric: string
  current: number
  target: number
  previous: number
  unit: string
}

export interface WeeklyNote {
  id: string
  week: string
  content: string
  createdAt: string
  author: string
}

export interface CreativeAsset {
  id: string
  clientId: string
  type: 'social' | 'display' | 'video' | 'email' | 'print' | 'web' | 'other'
  name: string
  description: string
  status: 'brief' | 'in_progress' | 'qa' | 'client_review' | 'approved' | 'revisions' | 'delivered'
  assignee: string
  dueDate: string
  createdAt: string
  version: number
}

export interface QcChecklist {
  id: string
  assetType: 'design' | 'copy' | 'video' | 'email' | 'social' | 'general'
  items: { name: string; passed: boolean; notes: string }[]
  passed: boolean
  reviewedBy: string
  reviewedAt: string
}

export interface Campaign {
  id: string
  clientId: string
  name: string
  platform: 'meta' | 'google' | 'linkedin' | 'email' | 'organic'
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  startDate: string
  endDate: string
  notes: string
}

export interface SeoKeyword {
  id: string
  clientId: string
  keyword: string
  volume: number
  difficulty: number
  position: number
  previousPosition: number
  url: string
  lastChecked: string
}

export interface EmailCampaign {
  id: string
  clientId: string
  name: string
  type: 'newsletter' | 'drip' | 'promo' | 'reengagement' | 'lifecycle'
  status: 'draft' | 'active' | 'paused' | 'completed'
  recipients: number
  sent: number
  opens: number
  clicks: number
  bounces: number
  createdAt: string
  scheduledFor: string
}

export interface ContactList {
  id: string
  clientId: string
  name: string
  description: string
  contacts: ContactEntry[]
  tags: string[]
  createdAt: string
}

export interface ContactEntry {
  id: string
  email: string
  name: string
  company: string
  phone: string
  tags: string[]
  source: 'manual' | 'import' | 'webform' | 'lead'
  subscribed: boolean
  subscribedAt: string
  unsubscribedAt: string
  lastOpened: string
  lastClicked: string
  totalOpens: number
  totalClicks: number
  createdAt: string
}

export interface Autoresponder {
  id: string
  clientId: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  trigger: AutoresponderTrigger
  steps: AutoresponderStep[]
  stats: AutoresponderStats
  createdAt: string
  updatedAt: string
}

export type AutoresponderTriggerType =
  | 'subscribed'
  | 'tag_added'
  | 'link_clicked'
  | 'form_submitted'
  | 'purchase_made'
  | 'date_reached'
  | 'manual'

export interface AutoresponderTrigger {
  type: AutoresponderTriggerType
  value: string
  description: string
}

export interface AutoresponderStep {
  id: string
  order: number
  delayDays: number
  delayHours: number
  action: 'send_email' | 'add_tag' | 'remove_tag' | 'move_to_list' | 'conditional_split'
  emailTemplateId: string
  subject: string
  body: string
  conditions?: AutoresponderCondition[]
}

export interface AutoresponderCondition {
  field: 'opened' | 'clicked' | 'tag' | 'custom'
  operator: 'is' | 'is_not' | 'greater_than' | 'less_than' | 'contains'
  value: string
}

export interface AutoresponderStats {
  totalTriggered: number
  activeInSequence: number
  completedSequence: number
  unsubscribed: number
  totalSent: number
  totalOpens: number
  totalClicks: number
  totalBounces: number
  conversionRate: number
}

export interface EmailTemplate {
  id: string
  clientId: string
  name: string
  subject: string
  previewText: string
  body: string
  category: 'promotional' | 'educational' | 'transactional' | 'reengagement' | 'lifecycle'
  lastUsed: string
  createdAt: string
}


export interface ContactList {
  id: string
  clientId: string
  name: string
  description: string
  contacts: ContactEntry[]
  tags: string[]
  createdAt: string
}

export interface ContactEntry {
  id: string
  email: string
  name: string
  company: string
  phone: string
  tags: string[]
  source: "manual" | "import" | "webform" | "lead"
  subscribed: boolean
  subscribedAt: string
  unsubscribedAt: string
  lastOpened: string
  lastClicked: string
  totalOpens: number
  totalClicks: number
  createdAt: string
}

export interface Autoresponder {
  id: string
  clientId: string
  name: string
  description: string
  status: "draft" | "active" | "paused" | "completed"
  trigger: AutoresponderTrigger
  steps: AutoresponderStep[]
  stats: AutoresponderStats
  createdAt: string
  updatedAt: string
}

export type AutoresponderTriggerType =
  | "subscribed"
  | "tag_added"
  | "link_clicked"
  | "form_submitted"
  | "purchase_made"
  | "date_reached"
  | "manual"


export interface SocialPost {
  id: string
  clientId: string
  platform: 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'tiktok'
  content: string
  mediaUrl: string
  status: 'draft' | 'scheduled' | 'posted' | 'failed'
  scheduledFor: string
  postedAt: string
  likes: number
  comments: number
  shares: number
  impressions: number
}

export interface ContentPiece {
  id: string
  clientId: string
  type: 'blog' | 'video' | 'infographic' | 'whitepaper' | 'case_study' | 'social_asset'
  title: string
  status: 'brief' | 'script' | 'production' | 'editing' | 'review' | 'published'
  assignee: string
  dueDate: string
  publishedAt: string
  url: string
}

export interface PitchDeal {
  id: string
  company: string
  contact: string
  contactRole: string
  targetTier: 'Foundation' | 'Growth' | 'Scale'
  estimatedMRR: number
  stage: 'research' | 'contacted' | 'discovery_scheduled' | 'discovery_done' | 'proposal_sent' | 'negotiating' | 'closed_won' | 'closed_lost'
  stageOrder: number
  notes: string
  nextStep: string
  createdAt: string
}

export interface DiscoveryCall {
  id: string
  company: string
  contact: string
  scheduledAt: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  qualificationScore: number
  needsIdentified: string[]
  budgetRange: string
  timeline: string
  decisionMaker: boolean
  notes: string
}

export interface MarketIntel {
  id: string
  clientId: string
  type: 'industry' | 'competitor' | 'keyword' | 'trend' | 'benchmark'
  title: string
  summary: string
  source: string
  date: string
  relevance: 'high' | 'medium' | 'low'
}

export interface ScopeChange {
  id: string
  clientId: string
  description: string
  impact: 'minor' | 'moderate' | 'major'
  status: 'detected' | 'triaged' | 'amendment_drafted' | 'amendment_sent' | 'resolved'
  detectedAt: string
  resolvedAt: string
  mrrImpact: number
  notes: string
}

export interface AiGenerationJob {
  id: string
  contentType: 'text' | 'image' | 'video'
  prompt: string
  result: string
  status: 'pending' | 'generating' | 'complete' | 'failed'
  error: string
  createdAt: string
  completedAt: string
  model: string
  metadata: Record<string, string>
}

export interface SocialQueueItem {
  id: string
  clientId: string
  content: string
  mediaUrl: string
  platform: 'linkedin' | 'google_business' | 'yelp' | 'amazon' | 'reddit' | 'facebook' | 'instagram' | 'twitter' | 'tiktok'
  status: 'draft' | 'queued' | 'posted' | 'failed'
  scheduledAt: string
  postedAt: string
  platformPostId: string
  error: string
}

export interface ApiConfig {
  baseUrl: string
  apiKey: string
  textModel: string
  imageModel: string
  videoModel: string
}

export interface Integration {
  id: string
  name: string
  platform: string
  category: 'ai' | 'social' | 'email' | 'analytics' | 'crm' | 'ads' | 'storage' | 'other'
  apiKey: string
  apiUrl: string
  enabled: boolean
  config: Record<string, string>
  connectedAt: string
  lastVerified: string
  status: 'connected' | 'disconnected' | 'error'
  icon: string
}

export interface AgencySettings {
  agencyName: string
  agencyTagline: string
  defaultTimezone: string
  currency: string
  dateFormat: string
  weekStartDay: number
  enableDarkByDefault: boolean
  enableAutoBackup: boolean
  backupIntervalHours: number
}

export interface PortalInvite {
  id: string
  clientId: string
  token: string
  email: string
  contactName: string
  status: 'pending' | 'active' | 'expired'
  createdAt: string
  lastAccessedAt: string
  expiresAt: string
}

export interface ClientApproval {
  id: string
  clientId: string
  type: 'content_draft' | 'social_post' | 'creative_asset' | 'campaign' | 'report' | 'proposal'
  title: string
  description: string
  status: 'pending' | 'approved' | 'revisions' | 'rejected'
  submittedAt: string
  respondedAt: string
  responseNotes: string
  relatedId: string
  submittedBy: string
}

export interface ClientMessage {
  id: string
  clientId: string
  authorId: string
  authorName: string
  authorRole: 'agency' | 'client'
  content: string
  attachments: string[]
  createdAt: string
  readAt: string
  threadId: string
}

// ─── Agent Configuration from blueprint ───────────────────────────────

export const AGENT_DEFINITIONS: Omit<Agent, 'id' | 'status' | 'utilization' | 'lastActive'>[] = [
  { slug: 'ceo', name: 'CEO', title: 'CEO', reportsTo: null, skills: ['retainer-pitch-authoring', 'discovery-call-playbook', 'monthly-strategy-review', 'scope-creep-recovery'] },
  { slug: 'director-of-operations', name: 'Director of Operations', title: 'Director of Operations', reportsTo: 'ceo', skills: ['client-onboarding-sequence', 'creative-qa-pipeline', 'scope-of-work-builder'] },
  { slug: 'head-of-accounts', name: 'Head of Accounts', title: 'Head of Accounts', reportsTo: 'ceo', skills: ['account-health-scoring', 'churn-prevention-playbook', 'quarterly-business-review-templates'] },
  { slug: 'creative-director', name: 'Creative Director', title: 'Creative Director', reportsTo: 'ceo', skills: ['creative-qa-pipeline', 'brand-voice-capture', 'monthly-strategy-review'] },
  { slug: 'strategist', name: 'Strategist', title: 'Strategist', reportsTo: 'ceo', skills: ['monthly-strategy-review', 'brand-voice-capture', 'quarterly-business-review-templates', 'discovery-call-playbook'] },
  { slug: 'account-manager', name: 'Account Manager', title: 'Account Manager', reportsTo: 'head-of-accounts', skills: ['account-health-scoring', 'churn-prevention-playbook'] },
  { slug: 'project-manager', name: 'Project Manager', title: 'Project Manager', reportsTo: 'head-of-accounts', skills: ['scope-of-work-builder', 'scope-creep-recovery'] },
  { slug: 'analyst', name: 'Analyst', title: 'Analyst', reportsTo: 'director-of-operations', skills: ['client-reporting-pack'] },
  { slug: 'bookkeeper', name: 'Bookkeeper', title: 'Bookkeeper', reportsTo: 'director-of-operations', skills: [] },
  { slug: 'reporting-engineer', name: 'Reporting Engineer', title: 'Reporting Engineer', reportsTo: 'director-of-operations', skills: ['client-reporting-pack'] },
  { slug: 'brand-designer', name: 'Brand Designer', title: 'Brand Designer', reportsTo: 'creative-director', skills: ['brand-voice-capture'] },
  { slug: 'copywriter', name: 'Copywriter', title: 'Copywriter', reportsTo: 'creative-director', skills: ['brand-voice-capture'] },
  { slug: 'video-editor', name: 'Video Editor', title: 'Video Editor', reportsTo: 'creative-director', skills: [] },
  { slug: 'market-researcher', name: 'Market Researcher', title: 'Market Researcher', reportsTo: 'strategist', skills: [] },
  { slug: 'paid-media-lead', name: 'Paid Media Lead', title: 'Paid Media Lead', reportsTo: 'ceo', skills: ['ad-account-audit'] },
  { slug: 'seo-lead', name: 'SEO Lead', title: 'SEO Lead', reportsTo: 'ceo', skills: [] },
  { slug: 'lifecycle-email-lead', name: 'Lifecycle/Email Lead', title: 'Lifecycle/Email Lead', reportsTo: 'ceo', skills: [] },
  { slug: 'social-lead', name: 'Social Lead', title: 'Social Lead', reportsTo: 'ceo', skills: [] },
  { slug: 'finance-controller', name: 'Finance Controller', title: 'Finance Controller', reportsTo: 'ceo', skills: ['pricing-and-proposal-templates'] },
]

export const SKILL_DEFINITIONS: { name: string; description: string; category: Skill['category'] }[] = [
  { name: 'account-health-scoring', description: 'Weekly health scoring across retainer accounts — green/yellow/red with recovery triggers', category: 'accounts' },
  { name: 'ad-account-audit', description: 'Audit paid media accounts: structure, creative fatigue, pacing, attribution', category: 'strategy' },
  { name: 'brand-voice-capture', description: 'Capture and document client brand voice, tone, and visual guidelines', category: 'creative' },
  { name: 'churn-prevention-playbook', description: 'Red-status recovery plans, renewal scripts, and account rescue sequences', category: 'accounts' },
  { name: 'client-onboarding-sequence', description: '14-day onboarding sequence: audits, brand voice, analytics baseline, kickoff', category: 'operations' },
  { name: 'client-reporting-pack', description: 'Monthly report template: results vs objectives, KPIs, channel performance', category: 'operations' },
  { name: 'creative-qa-pipeline', description: 'QA pipeline for design, copy, and video — brand fidelity, scope check, client readiness', category: 'creative' },
  { name: 'discovery-call-playbook', description: 'Discovery call structure, qualification thresholds, and next-step templates', category: 'strategy' },
  { name: 'monthly-strategy-review', description: 'Plan-week deliverable: business goals → multi-channel plan → creative brief', category: 'strategy' },
  { name: 'pricing-and-proposal-templates', description: 'Foundation/Growth/Scale retainer tiers, proposal templates, SOW builder', category: 'finance' },
  { name: 'quarterly-business-review-templates', description: 'QBR format: results-vs-objectives, renewal posture, upsell opportunities', category: 'accounts' },
  { name: 'retainer-pitch-authoring', description: 'Retainer pitch deck structure for Foundation/Growth/Scale tiers', category: 'strategy' },
  { name: 'scope-creep-recovery', description: 'Scope-creep detection, triage, and SOW amendment workflow', category: 'operations' },
  { name: 'scope-of-work-builder', description: 'SOW builder: deliverables, timeline, pricing, terms, counter-sign workflow', category: 'operations' },
]

export const PROJECT_DEFINITIONS: Omit<Project, 'id' | 'startedAt' | 'etd' | 'status'>[] = [
  {
    slug: 'client-1-onboarding-first-cycle',
    name: 'Client #1 Onboarding and First Retainer Cycle',
    description: 'Onboard the first retainer client and deliver the first Plan → Run → Report cycle end-to-end within 30 days.',
    owner: 'account-manager',
    successCondition: 'Client #1 has a counter-signed SOW, completed onboarding (audits, brand voice, analytics baseline), and a delivered Cycle 1 report with a recap call held.',
    deliverables: ['Draft and counter-sign SOW for Client #1', 'Run 14-day onboarding sequence for Client #1', 'Ship Cycle 1 monthly report to Client #1'],
  },
  {
    slug: 'retainer-pitch-engine-first-3-deals',
    name: 'Retainer Pitch Engine and First 3 Outbound Deals',
    description: 'Build a repeatable retainer pitch deck and advance 3 qualified outbound retainer conversations to proposal stage.',
    owner: 'ceo',
    successCondition: 'Retainer pitch deck (Foundation/Growth/Scale) is live, outbound sequence v1 sending, 3 qualified prospects at proposal stage.',
    deliverables: ['Build ICP document and target list of 50 SMB prospects', 'Draft retainer pitch deck (Foundation/Growth/Scale)'],
  },
]

export const TASK_DEFINITIONS: Omit<Task, 'id' | 'startedAt' | 'dueAt' | 'status'>[] = [
  { slug: 'build-icp-and-target-list', name: 'Build ICP document and target list of 50 SMB prospects', description: 'Define ICP and research 50 prospects with named decision-makers.', projectId: 'retainer-pitch-engine-first-3-deals', assignee: 'strategist', completionCriteria: ['ICP document filed', '50 prospects with named contacts', 'CEO approved'] },
  { slug: 'draft-retainer-pitch-deck', name: 'Draft retainer pitch deck (Foundation / Growth / Scale)', description: 'Create the pitch deck for all three retainer tiers.', projectId: 'retainer-pitch-engine-first-3-deals', assignee: 'ceo', completionCriteria: ['3 tiers defined', 'Pricing confirmed', 'Design approved'] },
  { slug: 'draft-sow-client-1', name: 'Draft and counter-sign SOW for Client #1', description: 'Draft, review, and counter-sign the first client SOW.', projectId: 'client-1-onboarding-first-cycle', assignee: 'account-manager', completionCriteria: ['SOW drafted', 'Client reviewed', 'Counter-signed'] },
  { slug: 'run-onboarding-sequence-client-1', name: 'Run 14-day onboarding sequence for Client #1', description: 'Execute the full onboarding sequence.', projectId: 'client-1-onboarding-first-cycle', assignee: 'account-manager', completionCriteria: ['Audits complete', 'Brand voice captured', 'Analytics baseline set', 'Kickoff call held'] },
  { slug: 'ship-cycle-1-report-client-1', name: 'Ship Cycle 1 monthly report to Client #1', description: 'Deliver the first monthly report with recap call.', projectId: 'client-1-onboarding-first-cycle', assignee: 'reporting-engineer', completionCriteria: ['Report delivered', 'Recap call held'] },
]

export type { Toast, ToastType } from './toast'
export type { Website, WebsiteSection, WebsiteTemplate, WebsitePage } from './website'
export type { Invoice, InvoiceLineItem, InvoiceStatus, Payment, StripeConfig, nextInvoiceNumber, calculateInvoiceTotals, buildSampleInvoices, buildSamplePayments } from './invoicing'
