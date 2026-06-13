import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { ChevronDown, ChevronRight, BookOpen, MessageCircle, HelpCircle, FileText, List, Users, TrendingUp, FileBarChart, Globe, Link, Rocket, Megaphone, DollarSign, Briefcase, HelpCircle as HelpIcon, UserCheck } from 'lucide-react'

const sections = [
  {
    id: 'getting-started',
    title: '🚀 Getting Started',
    icon: <Rocket size={18} />,
    steps: [
      {
        title: 'Welcome to FE Agency',
        detail: 'FE Agency is your all-in-one operations platform. Manage clients, projects, invoices, content, marketing, websites, and reporting — all in one place. All data is saved automatically in your browser — no server needed.',
      },
      {
        title: 'First: Add a Client',
        detail: 'Go to OPERATIONS → Clients. Click "Add Client" and fill in name, industry, retainer tier (Foundation $1.5K, Growth $3.5K, or Scale $6.5K), and MRR (monthly recurring revenue). Once added, you can assign projects, create invoices, and run reports.',
      },
      {
        title: 'Then: Set Up Your Pipeline',
        detail: 'Go to BUSINESS DEVELOPMENT → Sales Funnel to see how your services are organized. Then open Pitch Engine to track deals through stages: Discovery → Proposal → Negotiation → Decision → Closed Won/Lost.',
      },
      {
        title: 'Create Your First Invoice',
        detail: 'OPERATIONS → Invoicing. Click "+ New Invoice", select a client, add line items with descriptions and amounts, set a due date. Once saved, you can mark it as Sent, Paid, or Overdue.',
      },
    ],
  },
  {
    id: 'clients',
    title: '👥 Working with Clients',
    icon: <Users size={18} />,
    steps: [
      {
        title: 'Client Dashboard',
        detail: 'OPERATIONS → Clients shows every client with their MRR, health status (Healthy/At Risk/Critical), and retainer tier. Click any client to view their detailed page. The health status updates automatically based on engagement and payment history.',
      },
      {
        title: 'Account Health & Churn Prevention',
        detail: 'RETAINER TOOLS → Account Health shows satisfaction scores and retention risk. Churn Prevention (CLIENT LIFECYCLE) gives you playbooks for at-risk clients. Check these weekly to spot issues early.',
      },
      {
        title: 'Client Portal (Client-Facing)',
        detail: 'WEBSITES & PORTALS → Client Portal. Share a portal code with your client so they can see their Dashboard, Messages, Invoices, Approvals, and Deliverables. Demo codes built in: demo-brightpath-2026, demo-summit-2026.',
      },
      {
        title: 'Generate Client Reports',
        detail: 'RETAINER TOOLS → Client Reports. Select a client, review KPIs and charts, then click Export/Print to save a professional PDF report with bar charts, campaign data, and SEO keyword tables.',
      },
      {
        title: 'QBR (Quarterly Business Reviews)',
        detail: 'CLIENT LIFECYCLE → QBR Templates. Use the structured template to prepare performance summaries, goal tracking, and recommendations for your quarterly check-ins.',
      },
    ],
  },
  {
    id: 'marketing',
    title: '📣 Marketing & Content',
    icon: <Megaphone size={18} />,
    steps: [
      {
        title: 'AI Content Studio',
        detail: 'CREATION → AI Content Studio. Click "AI Writer" → choose settings (topic, tone, audience) → generate a draft → review → schedule. Switch between Pipeline (Kanban), Calendar, and Detail views. Supports: Blog, LinkedIn, Twitter/X, Instagram, Facebook, Email.',
      },
      {
        title: 'Email & Lifecycle Campaigns',
        detail: 'SERVICES → Email/Lifecycle. Create campaigns from scratch, send test emails, then launch to your list. Set up autoresponders for welcome sequences, lead magnets, and re-engagement flows. Save templates for reuse.',
      },
      {
        title: 'Social Media Publishing',
        detail: 'SERVICES → Social Media to schedule posts. CREATION → Social Publisher for bulk scheduling. Write posts, attach media, set publish dates. Track engagement metrics over time.',
      },
      {
        title: 'Paid Media (Ads)',
        detail: 'SERVICES → Paid Media. Manage Google Ads, LinkedIn, and Meta campaigns. Track budget, spend, CTR, CPC, and conversions. Use A/B testing to optimize creative. Export performance reports.',
      },
      {
        title: 'SEO Toolkit',
        detail: 'SERVICES → SEO. Track keyword rankings with monthly volume and difficulty scores. Build content clusters around pillar topics. Monitor backlinks, domain authority, and technical site health.',
      },
      {
        title: 'Market Researcher',
        detail: 'SERVICES (BUSINESS DEVELOPMENT) → Market Researcher. Run competitor analysis, define audience personas, spot trends, and prioritize opportunities by impact and effort.',
      },
    ],
  },
  {
    id: 'financials',
    title: '💰 Financials & Invoicing',
    icon: <DollarSign size={18} />,
    steps: [
      {
        title: 'Create & Manage Invoices',
        detail: 'OPERATIONS → Invoicing. Click "+ New Invoice", select client, add line items (description, quantity, rate), set date and due date. Status: Draft → Sent → Paid → Overdue. Three sample invoices are pre-loaded to show the format.',
      },
      {
        title: 'Connect Stripe for Payments',
        detail: 'In the Invoicing module, click "Stripe Settings". Enter your Stripe Publishable Key and Secret Key from your Stripe dashboard. Clients can then pay invoices online through the Client Portal.',
      },
      {
        title: 'Revenue Dashboard & KPIs',
        detail: 'OPERATIONS → Revenue for charts and monthly trends. OPERATIONS → KPIs for client acquisition rates, growth, margins, and project completion. Both update automatically as you add invoices and clients.',
      },
      {
        title: 'Pricing & Proposals',
        detail: 'RETAINER TOOLS → Pricing & Proposals. Three tiers: Foundation ($1.5K/mo), Growth ($3.5K/mo), Scale ($6.5K/mo). Each shows deliverables included. Proposal Builder lets you select a tier + add-ons and download a summary.',
      },
      {
        title: 'SOW Builder',
        detail: 'RETAINER TOOLS → SOW Builder. Define project scope, timeline, budget, and payment terms. Download as a text file to share with the client for approval.',
      },
    ],
  },
  {
    id: 'delivery',
    title: '🎨 Delivery & Operations',
    icon: <Briefcase size={18} />,
    steps: [
      {
        title: 'Projects & Tasks',
        detail: 'OPERATIONS → Projects for client project management (Planning, Active, On Hold, Completed). OPERATIONS → Tasks for individual work items (To Do, In Progress, Done) with assignees, due dates, and priorities.',
      },
      {
        title: 'Creative Studio',
        detail: 'SERVICES → Creative Studio. Store brand assets (logos, colors, fonts), design templates, video scripts, and content briefs all in one place. Organized per client.',
      },
      {
        title: 'Brand Voice Guide',
        detail: 'CLIENT LIFECYCLE → Brand Voice. Document style guides, tone documentation, messaging frameworks, and voice examples for each client. Keeps all content on-brand.',
      },
      {
        title: 'Scope Creep Tracker',
        detail: 'BUSINESS DEVELOPMENT → Scope Creep. Log every out-of-scope request with description, client, and additional cost. Track status: Open → Approved → Billed → Closed. Never miss billing for extra work again.',
      },
      {
        title: 'QA Pipeline',
        detail: 'SERVICES → QA Pipeline. Review and approve deliverables before sending to clients. Track revisions and sign-offs.',
      },
    ],
  },
  {
    id: 'websites',
    title: '🌐 Websites & Portals',
    icon: <Globe size={18} />,
    steps: [
      {
        title: 'Website Builder',
        detail: 'WEBSITES & PORTALS → Website Builder. Choose from 5 templates (Local Service Pro, Coach & Guru, Digital Agency, Lead Gen Machine, Simple Storefront). Split-screen editor with live preview. Toggle desktop/mobile view. AI content panel writes copy for you. Click Publish to make it live.',
      },
      {
        title: 'Client Portal',
        detail: 'WEBSITES & PORTALS → Client Portal. Gives clients a branded dashboard. 5 tabs: Dashboard, Messages, Invoices, Approvals, Deliverables. Portal access via unique code. Back-to-agency button returns you to the main app.',
      },
    ],
  },
  {
    id: 'agency',
    title: '🏢 Agency Management',
    icon: <UserCheck size={18} />,
    steps: [
      {
        title: 'Team Roster',
        detail: 'AGENCY → Roster. Add team members with name, role, email, phone, specialties. Track workload, assign to projects, and view billable hours.',
      },
      {
        title: 'Skills Inventory',
        detail: 'AGENCY → Skills. Track team skills, certifications, training history, and proficiency levels. Helps with project assignment and hiring decisions.',
      },
      {
        title: 'Org Chart',
        detail: 'AGENCY → Org Structure. Visual hierarchy of your agency with reporting structure. Click roles to see team member details.',
      },
      {
        title: 'Settings & Data Management',
        detail: 'SYSTEM → Settings. Configure agency name, tagline, timezone, currency, date format, dark mode. Export/Import all data as JSON for backup. Reset to start fresh.',
      },
    ],
  },
  {
    id: 'navigation',
    title: '🧭 Navigation Tips',
    icon: <HelpCircle size={18} />,
    steps: [
      {
        title: 'Sidebar Categories',
        detail: 'The left sidebar is organized into categories: OPERATIONS, RETAINER TOOLS, CLIENT LIFECYCLE, AGENCY, SERVICES, BUSINESS DEVELOPMENT, CREATION, WEBSITES & PORTALS, SYSTEM. Click any item to open that module.',
      },
      {
        title: 'Back Button',
        detail: 'A ← Back button appears in the top bar after you navigate away from a page. You can also use your browser\'s back button — the app tracks your navigation history.',
      },
      {
        title: 'Cmd+K (Command Palette)',
        detail: 'Press Cmd+K (Mac) or Ctrl+K (Windows) to open the global command palette. Search across all modules, clients, agents, projects, tasks, and campaigns. Select a result to navigate directly to it.',
      },
      {
        title: 'Export / Import Data',
        detail: 'Every page has an Export button in the top-right corner. Download all agency data as a JSON backup. Use Import to restore from a file. Data is also auto-saved to localStorage every time you make a change.',
      },
      {
        title: 'Dark Mode',
        detail: 'Toggle dark mode in Settings or from the Dashboard. Changes apply immediately and are saved automatically.',
      },
      {
        title: 'Mobile View',
        detail: 'On phones, the sidebar collapses into a hamburger menu (☰) in the top-left. Tap it to open the sidebar with a backdrop overlay. Tap the X or the overlay to close.',
      },
    ],
  },
]

const quickStart = [
  {
    step: '1️⃣ Add Your First Client',
    path: 'clients',
    icon: <Users size={16} />,
  },
  {
    step: '2️⃣ Track a Deal in Pitch Engine',
    path: 'pitch-engine',
    icon: <TrendingUp size={16} />,
  },
  {
    step: '3️⃣ Create Your First Invoice',
    path: 'invoicing',
    icon: <FileText size={16} />,
  },
  {
    step: '4️⃣ Generate a Client Report',
    path: 'reporting',
    icon: <FileBarChart size={16} />,
  },
  {
    step: '5️⃣ Build a Website',
    path: 'website-builder',
    icon: <Globe size={16} />,
  },
  {
    step: '6️⃣ Invite Client to Portal',
    path: 'client-portal',
    icon: <Link size={16} />,
  },
]



export default function HelpPage() {
  const setActiveModule = useAppStore(s => s.setActiveModule)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <HelpCircle size={28} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Help & Guide
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Everything you need to get started and master FE Agency
        </p>
      </div>

      {/* Quick Start Guide */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <Rocket size={20} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Quick Start
          </h2>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 10,
        }}>
          {quickStart.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveModule(item.path)
                localStorage.setItem('activeModule', item.path)
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.step}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Detailed Sections */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <List size={20} style={{ color: 'var(--accent)' }} />
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          Detailed Instructions
        </h2>
      </div>

      {sections.map(section => (
        <div key={section.id} style={{ marginBottom: 10 }}>
          {/* Section Header */}
          <button
            onClick={() => setExpanded(expanded === section.id ? null : section.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '14px 18px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontSize: 15,
              fontWeight: 600,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
          >
            <span>{section.icon}</span>
            <span style={{ flex: 1 }}>{section.title}</span>
            {expanded === section.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {/* Steps */}
          {expanded === section.id && (
            <div style={{
              marginTop: 6, padding: '4px 0',
              borderLeft: '2px solid var(--accent)',
              marginLeft: 20, paddingLeft: 16,
            }}>
              {section.steps.map((step, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'var(--accent)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                      {step.title}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, paddingLeft: 28 }}>
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <div style={{
        marginTop: 40, padding: '20px 24px',
        background: 'var(--bg-tertiary)', borderRadius: 12,
        border: '1px solid var(--border)', textAlign: 'center',
      }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          💡 <strong style={{ color: 'var(--text-primary)' }}>Pro Tip:</strong> Press{' '}
          <code style={{
            background: 'var(--bg-secondary)', padding: '2px 8px',
            borderRadius: 4, fontSize: 12,
            border: '1px solid var(--border)',
          }}>
            Cmd+K
          </code>{' '}
          or{' '}
          <code style={{
            background: 'var(--bg-secondary)', padding: '2px 8px',
            borderRadius: 4, fontSize: 12,
            border: '1px solid var(--border)',
          }}>
            Ctrl+K
          </code>{' '}
          to search across all modules, clients, and data instantly.
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '10px 0 0 0' }}>
          All data auto-saves to your browser. Export regularly for backup. Need more help? Contact support.
        </p>
      </div>
    </div>
  )
}
