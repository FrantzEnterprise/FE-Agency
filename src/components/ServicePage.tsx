import { useAppStore } from '../store/useAppStore'
import { Palette, Megaphone, Search, Mail, MessageSquare, FileText, Camera } from 'lucide-react'

interface ServicePageProps {
  service: string
}

const serviceConfig: Record<string, { title: string; icon: React.ReactNode; desc: string; leads: string[]; agents: string[] }> = {
  'creative': {
    title: 'Creative Studio',
    icon: <Palette size={24} />,
    desc: 'Design, copywriting, and video production for retainer clients. Creative director → brand designer + copywriter + video editor.',
    leads: ['creative-director'],
    agents: ['brand-designer', 'copywriter', 'video-editor'],
  },
  'paid-media': {
    title: 'Paid Media',
    icon: <Megaphone size={24} />,
    desc: 'Paid social, search ads, display, and retargeting. Ad account audits, creative testing, and ROAS optimization.',
    leads: ['paid-media-lead'],
    agents: [],
  },
  'seo': {
    title: 'Search Engine Optimization',
    icon: <Search size={24} />,
    desc: 'Organic search strategy, technical SEO, content optimization, and link building for retainer clients.',
    leads: ['seo-lead'],
    agents: [],
  },
  'email': {
    title: 'Email & Lifecycle Marketing',
    icon: <Mail size={24} />,
    desc: 'Email sequences, lifecycle automation, drip campaigns, newsletter strategy, and retention workflows.',
    leads: ['lifecycle-email-lead'],
    agents: [],
  },
  'social': {
    title: 'Social Media',
    icon: <MessageSquare size={24} />,
    desc: 'Organic social strategy, content calendar, community management, and platform-specific execution.',
    leads: ['social-lead'],
    agents: [],
  },
  'brand': {
    title: 'Brand & Voice',
    icon: <FileText size={24} />,
    desc: 'Brand voice capture, visual identity, brand guidelines, and creative systems for retainer clients.',
    leads: ['creative-director'],
    agents: ['brand-designer', 'copywriter'],
  },
  'content': {
    title: 'Content Studio',
    icon: <Camera size={24} />,
    desc: 'Content production pipeline: photo, video, graphic assets, and content calendar for retainer clients.',
    leads: ['creative-director'],
    agents: ['video-editor', 'brand-designer'],
  },
}

export default function ServicePage({ service }: ServicePageProps) {
  const { agents } = useAppStore()
  const config = serviceConfig[service]

  if (!config) return <div className="empty-state"><span>Service not found</span></div>

  const leadAgents = config.leads.map(slug => agents.find(a => a.slug === slug)).filter(Boolean)
  const teamAgents = config.agents.map(slug => agents.find(a => a.slug === slug)).filter(Boolean)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {config.icon}
            {config.title}
          </h2>
          <p className="section-desc">{config.desc}</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {leadAgents.map(a => a && (
          <div key={a.id} className="card" style={{ borderLeft: '4px solid var(--brand-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 700 }}>
                {a.slug.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.title} · Lead</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teamAgents.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Team</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {teamAgents.map(a => a && (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>
                  {a.slug.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Service Overview</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          This service operates on a monthly retainer cadence: <strong>Plan → Run → Report</strong>.
          Each cycle begins with a plan week (strategy + brief), followed by run weeks (execution + QA),
          and ends with a report week (results + recap).
        </p>
      </div>
    </div>
  )
}
