import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ClientsPage from './components/ClientsPage'
import PipelinePage from './components/PipelinePage'
import ProjectsPage from './components/ProjectsPage'
import TasksPage from './components/TasksPage'
import KpiPage from './components/KpiPage'
import RevenuePage from './components/RevenuePage'
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
import { Sun, Moon, Download, Upload, RotateCcw, Rocket } from 'lucide-react'

const modules: Record<string, { title: string; component: React.ReactNode }> = {
  dashboard: { title: 'Dashboard', component: <Dashboard /> },
  clients: { title: 'Clients', component: <ClientsPage /> },
  pipeline: { title: 'Pipeline', component: <PipelinePage /> },
  projects: { title: 'Projects', component: <ProjectsPage /> },
  tasks: { title: 'Tasks', component: <TasksPage /> },
  revenue: { title: 'Revenue', component: <RevenuePage /> },
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
}

export default function App() {
  const dark = useAppStore(s => s.dark)
  const toggleDark = useAppStore(s => s.toggleDark)
  const activeModule = useAppStore(s => s.activeModule)
  const exportData = useAppStore(s => s.exportData)
  const importData = useAppStore(s => s.importData)
  const resetData = useAppStore(s => s.resetData)

  // Sync dark mode to <html> so CSS variable lookups on body and descendants resolve correctly
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

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

  const currentModule = modules[activeModule] || modules.dashboard

  return (
    <div style={{ height: '100%' }}>
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <header className="topbar">
            <div className="topbar-title">{currentModule.title}</div>
            <div className="topbar-actions">
              <button className="btn btn-ghost btn-sm" onClick={handleExport} title="Export data">
                <Download size={16} /> Export
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleImport} title="Import data">
                <Upload size={16} /> Import
              </button>
              <button className="btn btn-ghost btn-sm" onClick={resetData} title="Reset to sample data">
                <RotateCcw size={16} /> Reset
              </button>
              <button className="btn btn-ghost btn-icon" onClick={toggleDark} title={dark ? 'Light mode' : 'Dark mode'}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </header>

          <main className="main-content">
            {currentModule.component}
          </main>
        </div>
      </div>
    </div>
  )
}
