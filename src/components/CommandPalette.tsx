import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Search, Users, Target, Briefcase, DollarSign, FileText, Settings, UserCheck, Palette, Mail, MessageSquare, Camera, BarChart3, TrendingUp, LayoutDashboard, ScrollText, HeartPulse, FileBarChart, Rocket, Speech, Shield, CalendarCheck, GitBranch, Megaphone, Search as SearchIcon, PhoneCall, Compass, AlertTriangle, Sparkles, Share2, Link, Receipt, CheckCircle, BookOpen, ArrowRight } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'client' | 'agent' | 'project' | 'task' | 'page' | 'campaign'
  label: string
  subtitle?: string
  icon: React.ReactNode
  action: () => void
}

const pageIcons: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={16} />,
  clients: <Users size={16} />,
  pipeline: <TrendingUp size={16} />,
  projects: <Target size={16} />,
  tasks: <Briefcase size={16} />,
  revenue: <DollarSign size={16} />,
  kpi: <BarChart3 size={16} />,
  agents: <UserCheck size={16} />,
  skills: <BookOpen size={16} />,
  'org-chart': <GitBranch size={16} />,
  creative: <Palette size={16} />,
  'qa-pipeline': <CheckCircle size={16} />,
  'paid-media': <Megaphone size={16} />,
  seo: <SearchIcon size={16} />,
  email: <Mail size={16} />,
  social: <MessageSquare size={16} />,
  content: <Camera size={16} />,
  pricing: <Receipt size={16} />,
  sow: <ScrollText size={16} />,
  health: <HeartPulse size={16} />,
  reporting: <FileBarChart size={16} />,
  onboarding: <Rocket size={16} />,
  'brand-voice': <Speech size={16} />,
  'churn-prevention': <Shield size={16} />,
  qbr: <CalendarCheck size={16} />,
  'pitch-engine': <TrendingUp size={16} />,
  'discovery-call': <PhoneCall size={16} />,
  'market-research': <Compass size={16} />,
  'scope-creep': <AlertTriangle size={16} />,
  'ai-content': <Sparkles size={16} />,
  'social-publisher': <Share2 size={16} />,
  settings: <Settings size={16} />,
  'client-portal': <Link size={16} />,
}

const moduleNames: Record<string, string> = {
  dashboard: 'Dashboard', clients: 'Clients', pipeline: 'Pipeline',
  projects: 'Projects', tasks: 'Tasks', revenue: 'Revenue',
  kpi: 'KPIs', agents: 'Roster', skills: 'Skills',
  'org-chart': 'Org Structure', creative: 'Creative Studio',
  'qa-pipeline': 'QA Pipeline', 'paid-media': 'Paid Media',
  seo: 'SEO', email: 'Email & Lifecycle', social: 'Social Media',
  content: 'Content Studio', pricing: 'Pricing & Proposals',
  sow: 'SOW Builder', health: 'Account Health',
  reporting: 'Client Reports', onboarding: 'Onboarding',
  'brand-voice': 'Brand Voice', 'churn-prevention': 'Churn Prevention',
  qbr: 'QBR Templates', 'pitch-engine': 'Pitch Engine',
  'discovery-call': 'Discovery Calls', 'market-research': 'Market Researcher',
  'scope-creep': 'Scope Creep', 'ai-content': 'AI Content Studio',
  'social-publisher': 'Social Publisher', settings: 'Settings',
  'client-portal': 'Client Portal',
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const {
    clients, agents, projects, tasks, campaigns,
    setActiveModule, activeModule,
  } = useAppStore()

  // Toggle on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
        setQuery('')
        setSelectedIndex(0)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected into view
  useEffect(() => {
    const el = resultsRef.current?.children[selectedIndex] as HTMLElement
    el?.scrollIntoView?.({ block: 'nearest' })
  }, [selectedIndex])

  const navigate = useCallback((moduleId: string) => {
    setActiveModule(moduleId)
    setOpen(false)
    setQuery('')
  }, [setActiveModule])

  const q = query.toLowerCase().trim()

  const results: SearchResult[] = []

  // Add page results
  for (const [id, name] of Object.entries(moduleNames)) {
    if (id !== activeModule && (name.toLowerCase().includes(q) || id.includes(q))) {
      results.push({
        id: `page-${id}`,
        type: 'page',
        label: name,
        subtitle: 'Page · Click to navigate',
        icon: pageIcons[id] || <ArrowRight size={16} />,
        action: () => navigate(id),
      })
    }
  }

  // Add client results
  for (const c of clients) {
    if (c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)) {
      results.push({
        id: `client-${c.id}`,
        type: 'client',
        label: c.name,
        subtitle: `${c.industry} · $${c.mrr}/mo · ${c.status}`,
        icon: <Users size={16} style={{ color: c.health === 'green' ? '#22c55e' : c.health === 'yellow' ? '#f59e0b' : '#ef4444' }} />,
        action: () => navigate('clients'),
      })
    }
  }

  // Add agent results
  for (const a of agents) {
    if (a.name.toLowerCase().includes(q) || a.title.toLowerCase().includes(q) || a.slug?.toLowerCase().includes(q)) {
      results.push({
        id: `agent-${a.id}`,
        type: 'agent',
        label: a.name,
        subtitle: `${a.title} · ${a.utilization}% utilized`,
        icon: <UserCheck size={16} />,
        action: () => navigate('agents'),
      })
    }
  }

  // Add project results
  for (const p of projects) {
    if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
      results.push({
        id: `project-${p.id}`,
        type: 'project',
        label: p.name,
        subtitle: p.status.replace('_', ' ') + ' · Owner: ' + p.owner,
        icon: <Target size={16} />,
        action: () => navigate('projects'),
      })
    }
  }

  // Add task results
  for (const t of tasks) {
    if (t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)) {
      results.push({
        id: `task-${t.id}`,
        type: 'task',
        label: t.name,
        subtitle: `${t.status.replace('_', ' ')} · ${t.assignee}`,
        icon: <Briefcase size={16} />,
        action: () => navigate('tasks'),
      })
    }
  }

  // Add campaign results
  for (const c of campaigns) {
    if (c.name.toLowerCase().includes(q)) {
      results.push({
        id: `campaign-${c.id}`,
        type: 'campaign',
        label: c.name,
        subtitle: `${c.platform} · $${c.spent}/${c.budget} · ${c.status}`,
        icon: <Megaphone size={16} />,
        action: () => navigate('paid-media'),
      })
    }
  }

  const filtered = results.filter(r => {
    if (!q) return r.type === 'page'
    return r.label.toLowerCase().includes(q) || (r.subtitle?.toLowerCase() || '').includes(q)
  })

  // For empty query show top pages
  const display = q ? filtered : filtered.slice(0, 10)

  const handleSelect = (index: number) => {
    if (display[index]) {
      display[index].action()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, display.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(selectedIndex)
    }
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10vh',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => { setOpen(false); setQuery('') }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 580,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.15s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, clients, agents, projects, tasks, campaigns..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 15,
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
          <kbd style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          style={{ overflowY: 'auto', flex: 1, padding: 8 }}
        >
          {display.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No results found for "{query}"
            </div>
          )}
          {display.map((r, i) => (
            <button
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                background: i === selectedIndex ? 'var(--bg-tertiary)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.1s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={() => setSelectedIndex(i)}
              onClick={() => handleSelect(i)}
            >
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                {r.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                {r.subtitle && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{r.subtitle}</div>
                )}
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                {r.type}
              </span>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  )
}
