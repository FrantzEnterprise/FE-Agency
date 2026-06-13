import { useEffect, useState, Component, ReactNode } from 'react'
import { useAppStore } from './store/useAppStore'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ClientsPage from './components/ClientsPage'
import PipelinePage from './components/PipelinePage'
import ProjectsPage from './components/ProjectsPage'
import TasksPage from './components/TasksPage'
import KpiPage from './components/KpiPage'
import RevenuePage from './components/RevenuePage'
import InvoicingPage from './components/InvoicingPage'
import RosterPage from './components/RosterPage'
import SkillsPage from './components/SkillsPage'
import OrgChartPage from './components/OrgChartPage'
import ServicePage from './components/ServicePage'
import PricingPage from './components/PricingPage'
import SowBuilder from './components/SowBuilder'
import AccountHealthPage from './components/AccountHealthPage'
import ClientReportingPage from './components/ClientReportingPage'
import OnboardingPage from './components/OnboardingPage'
import BrandVoicePage from './components/BrandVoicePage'
import ChurnPreventionPage from './components/ChurnPreventionPage'
import QbrPage from './components/QbrPage'
import CreativeStudioPage from './components/CreativeStudioPage'
import QaPipelinePage from './components/QaPipelinePage'
import PaidMediaPage from './components/PaidMediaPage'
import SeoPage from './components/SeoPage'
import EmailPage from './components/EmailPage'
import SocialPage from './components/SocialPage'
import ContentStudioPage from './components/ContentStudioPage'
import PitchEnginePage from './components/PitchEnginePage'
import DiscoveryCallPage from './components/DiscoveryCallPage'
import MarketResearcherPage from './components/MarketResearcherPage'
import ScopeCreepPage from './components/ScopeCreepPage'
import AiContentStudio from './components/AiContentStudio'
import SocialPublisher from './components/SocialPublisher'
import SettingsPage from './components/SettingsPage'
import ClientPortalPage from './components/ClientPortalPage'
import WebsiteBuilderPage from './components/WebsiteBuilderPage'
import HelpPage from './components/HelpPage'
import SalesFunnelPage from './components/SalesFunnelPage'
import ClientPortalView from './components/ClientPortalView'
import ToastContainer from './components/ToastContainer'
import CommandPalette from './components/CommandPalette'
import OnboardingGuide from './components/OnboardingGuide'
import { Sun, Moon, Download, Upload, RotateCcw, Rocket, Link, Menu, X } from 'lucide-react'

const modules: Record<string, { title: string; component: React.ReactNode }> = {
  dashboard: { title: 'Dashboard', component: <Dashboard /> },
  clients: { title: 'Clients', component: <ClientsPage /> },
  pipeline: { title: 'Pipeline', component: <PipelinePage /> },
  projects: { title: 'Projects', component: <ProjectsPage /> },
  tasks: { title: 'Tasks', component: <TasksPage /> },
  revenue: { title: 'Revenue', component: <RevenuePage /> },
  invoicing: { title: 'Invoicing & Payments', component: <InvoicingPage /> },
  kpi: { title: 'KPIs', component: <KpiPage /> },
  agents: { title: 'Roster', component: <RosterPage /> },
  skills: { title: 'Skills', component: <SkillsPage /> },
  'org-chart': { title: 'Org Structure', component: <OrgChartPage /> },
  creative: { title: 'Creative Studio', component: <CreativeStudioPage /> },
  'qa-pipeline': { title: 'QA Pipeline', component: <QaPipelinePage /> },
  'paid-media': { title: 'Paid Media', component: <PaidMediaPage /> },
  seo: { title: 'SEO', component: <SeoPage /> },
  email: { title: 'Email & Lifecycle', component: <EmailPage /> },
  social: { title: 'Social Media', component: <SocialPage /> },
  content: { title: 'Content Studio', component: <ContentStudioPage /> },
  pricing: { title: 'Pricing & Proposals', component: <PricingPage /> },
  sow: { title: 'SOW Builder', component: <SowBuilder /> },
  health: { title: 'Account Health', component: <AccountHealthPage /> },
  reporting: { title: 'Client Reports', component: <ClientReportingPage /> },
  onboarding: { title: 'Onboarding', component: <OnboardingPage /> },
  'brand-voice': { title: 'Brand Voice', component: <BrandVoicePage /> },
  'churn-prevention': { title: 'Churn Prevention', component: <ChurnPreventionPage /> },
  qbr: { title: 'QBR Templates', component: <QbrPage /> },
  'pitch-engine': { title: 'Retainer Pitch Engine', component: <PitchEnginePage /> },
  'discovery-call': { title: 'Discovery Call Orchestrator', component: <DiscoveryCallPage /> },
  'market-research': { title: 'Market Researcher', component: <MarketResearcherPage /> },
  'scope-creep': { title: 'Scope Creep Recovery', component: <ScopeCreepPage /> },
  'ai-content': { title: 'AI Content Studio', component: <ContentStudioPage /> },
  'social-publisher': { title: 'Social Publisher', component: <SocialPublisher /> },
  settings: { title: 'Settings', component: <SettingsPage /> },
  'client-portal': { title: 'Client Portal', component: <ClientPortalPage /> },
  'website-builder': { title: 'Website Builder', component: <WebsiteBuilderPage /> },
  'sales-funnel': { title: 'Sales Funnel', component: <SalesFunnelPage /> },
  'help': { title: 'Help & Guide', component: <HelpPage /> },
}

class ErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:40,background:'#1a1a2e',color:'#ff4444',minHeight:'100vh',fontFamily:'monospace'}}>
          <h2 style={{marginBottom:16}}>🚨 Runtime Error</h2>
          <pre style={{whiteSpace:'pre-wrap',color:'#e0e0e0'}}>{this.state.error.stack || this.state.error.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const dark = useAppStore(s => s.dark)
  const toggleDark = useAppStore(s => s.toggleDark)
  const activeModule = useAppStore(s => s.activeModule)
  const exportData = useAppStore(s => s.exportData)
  const importData = useAppStore(s => s.importData)
  const resetData = useAppStore(s => s.resetData)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sync dark mode to <html>
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }, [sidebarOpen])

  // Close sidebar on route change (module change) on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [activeModule])

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `frantz-enterprise-${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) importData(await file.text())
    }
    input.click()
  }

  // Check for client portal access
  const hasPortalParam = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('portal')

  // ─── Navigate back button + browser back support ───
  const navHistory = useAppStore(s => s.navHistory)
  const goBack = useAppStore(s => s.goBack)

  // Sync activeModule to URL hash for browser back button
  useEffect(() => {
    window.history.replaceState({ module: activeModule }, "", "#" + activeModule)
  }, [activeModule])

  // Listen for browser back/forward
  useEffect(() => {
    const handlePop = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash && hash !== activeModule) {
        setActiveModule(hash)
      }
    }
    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [activeModule])

  const canGoBack = navHistory.length > 0 && navHistory[navHistory.length - 1] !== activeModule

  const currentModule = modules[activeModule] || modules.dashboard

  if (hasPortalParam) {
    return <ClientPortalView />
  }

  console.log('[App] rendering with', activeModule)

  return (
    <ErrorBoundary>
    <div style={{ height: '100%' }}>
      <div className="app-layout">
        {/* Mobile hamburger button */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        <div className={`main-area ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <header className="topbar">
            <div className="topbar-title">
              {canGoBack && (
                <button onClick={goBack} title="Go back" style={{
                  background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                  padding: '4px 8px 4px 0', fontSize: 16, display: 'inline-flex', alignItems: 'center',
                }}>
                  ← <span style={{ fontSize: 12, marginLeft: 4 }}>Back</span>
                </button>
              )}
              {currentModule.title}
            </div>
            <div className="topbar-actions">
              <button className="btn btn-ghost btn-sm no-label-mobile" onClick={handleExport} title="Export data">
                <Download size={16} /> <span className="btn-label">Export</span>
              </button>
              <button className="btn btn-ghost btn-sm no-label-mobile" onClick={handleImport} title="Import data">
                <Upload size={16} /> <span className="btn-label">Import</span>
              </button>
              <button className="btn btn-ghost btn-sm no-label-mobile" onClick={resetData} title="Reset all data">
                <RotateCcw size={16} /> <span className="btn-label">Reset</span>
              </button>
              <button className="btn btn-ghost btn-icon" onClick={toggleDark} title={dark ? 'Light mode' : 'Dark mode'}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </header>

          <main className="main-content">
            {currentModule.component}
          </main>

          <ToastContainer />
          <CommandPalette />
          <OnboardingGuide />
        </div>
      </div>
    </div>
    </ErrorBoundary>
  )
}
