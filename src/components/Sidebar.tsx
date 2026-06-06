import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import {
  LayoutDashboard, Users, Target, Briefcase, BarChart3, TrendingUp,
  DollarSign, PieChart, FileText, UserCheck, BookOpen, MessageSquare,
  Megaphone, Search, Mail, Camera, Palette, GitBranch,
  Receipt, ScrollText, HeartPulse, FileBarChart,
  Rocket, Speech, Shield, CalendarCheck, CheckCircle,
  ChevronDown, ChevronRight
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface Category {
  label: string
  items: NavItem[]
}

const categories: Category[] = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'clients', label: 'Clients', icon: <Users size={18} /> },
      { id: 'pipeline', label: 'Pipeline', icon: <TrendingUp size={18} /> },
      { id: 'projects', label: 'Projects', icon: <Target size={18} /> },
      { id: 'tasks', label: 'Tasks', icon: <Briefcase size={18} /> },
      { id: 'revenue', label: 'Revenue', icon: <DollarSign size={18} /> },
      { id: 'kpi', label: 'KPIs', icon: <BarChart3 size={18} /> },
    ],
  },
  {
    label: 'RETAINER TOOLS',
    items: [
      { id: 'pricing', label: 'Pricing & Proposals', icon: <Receipt size={18} /> },
      { id: 'sow', label: 'SOW Builder', icon: <ScrollText size={18} /> },
      { id: 'health', label: 'Account Health', icon: <HeartPulse size={18} /> },
      { id: 'reporting', label: 'Client Reports', icon: <FileBarChart size={18} /> },
    ],
  },
  {
    label: 'CLIENT LIFECYCLE',
    items: [
      { id: 'onboarding', label: 'Onboarding', icon: <Rocket size={18} /> },
      { id: 'brand-voice', label: 'Brand Voice', icon: <Speech size={18} /> },
      { id: 'churn-prevention', label: 'Churn Prevention', icon: <Shield size={18} /> },
      { id: 'qbr', label: 'QBR Templates', icon: <CalendarCheck size={18} /> },
    ],
  },
  {
    label: 'AGENCY',
    items: [
      { id: 'agents', label: 'Roster', icon: <UserCheck size={18} /> },
      { id: 'skills', label: 'Skills', icon: <BookOpen size={18} /> },
      { id: 'org-chart', label: 'Org Structure', icon: <GitBranch size={18} /> },
    ],
  },
  {
    label: 'SERVICES',
    items: [
      { id: 'creative', label: 'Creative Studio', icon: <Palette size={18} /> },
      { id: 'qa-pipeline', label: 'QA Pipeline', icon: <CheckCircle size={18} /> },
      { id: 'paid-media', label: 'Paid Media', icon: <Megaphone size={18} /> },
      { id: 'seo', label: 'SEO', icon: <Search size={18} /> },
      { id: 'email', label: 'Email/Lifecycle', icon: <Mail size={18} /> },
      { id: 'social', label: 'Social Media', icon: <MessageSquare size={18} /> },
      { id: 'content', label: 'Content Studio', icon: <Camera size={18} /> },
    ],
  },
]

function useActiveCategory(activeModule: string, cats: Category[]): string | null {
  for (const cat of cats) {
    if (cat.items.some(i => i.id === activeModule)) return cat.label
  }
  return null
}

export default function Sidebar() {
  const activeModule = useAppStore(s => s.activeModule)
  const setActiveModule = useAppStore(s => s.setActiveModule)
  const initialCat = useActiveCategory(activeModule, categories) || 'OVERVIEW'
  const [openCats, setOpenCats] = useState<Set<string>>(() => new Set([initialCat]))

  const toggleCat = (label: string) => {
    setOpenCats(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  // Auto-open the category of the active module
  const activeCat = useActiveCategory(activeModule, categories)
  if (activeCat && !openCats.has(activeCat)) {
    setOpenCats(prev => new Set([...prev, activeCat]))
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          Frantz<span>Enterprise</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--sidebar-text)', marginTop: 4, opacity: 0.6 }}>
          Agency Operations
        </div>
      </div>

      <div className="sidebar-nav">
        {categories.map(cat => {
          const isOpen = openCats.has(cat.label)
          const hasActive = cat.items.some(i => i.id === activeModule)

          return (
            <div key={cat.label}>
              <button
                className={`sidebar-category ${hasActive ? 'has-active' : ''}`}
                onClick={() => toggleCat(cat.label)}
              >
                <span>{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                <span>{cat.label}</span>
              </button>

              {isOpen && (
                <div className="sidebar-subnav">
                  {cat.items.map(item => (
                    <button
                      key={item.id}
                      className={`sidebar-link ${activeModule === item.id ? 'active' : ''}`}
                      onClick={() => setActiveModule(item.id)}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
