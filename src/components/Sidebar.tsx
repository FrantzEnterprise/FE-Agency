import { useAppStore } from '../store/useAppStore'
import {
  LayoutDashboard, Users, Target, Briefcase, BarChart3, TrendingUp,
  DollarSign, PieChart, FileText, UserCheck, BookOpen, MessageSquare,
  Megaphone, Search, Mail, Camera, Palette, GitBranch, Building2
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  section?: string
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: '', label: 'OPERATIONS', icon: null },
  { id: 'clients', label: 'Clients', icon: <Users size={18} /> },
  { id: 'pipeline', label: 'Pipeline', icon: <TrendingUp size={18} /> },
  { id: 'projects', label: 'Projects', icon: <Target size={18} /> },
  { id: 'tasks', label: 'Tasks', icon: <Briefcase size={18} /> },
  { id: 'revenue', label: 'Revenue', icon: <DollarSign size={18} /> },
  { id: 'kpi', label: 'KPIs', icon: <BarChart3 size={18} /> },
  { id: '', label: 'AGENCY', icon: null },
  { id: 'agents', label: 'Roster', icon: <UserCheck size={18} /> },
  { id: 'skills', label: 'Skills', icon: <BookOpen size={18} /> },
  { id: 'org-chart', label: 'Org Structure', icon: <GitBranch size={18} /> },
  { id: '', label: 'SERVICES', icon: null },
  { id: 'creative', label: 'Creative', icon: <Palette size={18} /> },
  { id: 'paid-media', label: 'Paid Media', icon: <Megaphone size={18} /> },
  { id: 'seo', label: 'SEO', icon: <Search size={18} /> },
  { id: 'email', label: 'Email/Lifecycle', icon: <Mail size={18} /> },
  { id: 'social', label: 'Social', icon: <MessageSquare size={18} /> },
  { id: 'brand', label: 'Brand & Voice', icon: <FileText size={18} /> },
  { id: 'content', label: 'Content Studio', icon: <Camera size={18} /> },
]

export default function Sidebar() {
  const activeModule = useAppStore(s => s.activeModule)
  const setActiveModule = useAppStore(s => s.setActiveModule)
  const dark = useAppStore(s => s.dark)

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
        {navItems.map((item, i) =>
          !item.id ? (
            <div key={i} className="sidebar-section-label">{item.label}</div>
          ) : (
            <button
              key={item.id}
              className={`sidebar-link ${activeModule === item.id ? 'active' : ''}`}
              onClick={() => setActiveModule(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          )
        )}
      </div>
    </nav>
  )
}
