import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'

interface StageData {
  id: string
  label: string
  icon: string
  color: string
  headline: string
  description: string
  features: { name: string; desc: string; module: string }[]
  metric: string
  count: number
  value: number
}

export default function SalesFunnelPage() {
  const clients = useAppStore(s => s.clients)
  const setActiveModule = useAppStore(s => s.setActiveModule)

  // Restore expanded stage + scroll from sessionStorage
  const [expandedStage, setExpandedStage] = useState<string | null>(() => {
    try { return sessionStorage.getItem('sf_expanded') || 'interest' } catch { return 'interest' }
  })

  const handleSetExpanded = (id: string | null) => {
    setExpandedStage(id)
    try { sessionStorage.setItem('sf_expanded', id || '') } catch {}
  }

  // Save scroll on unmount, restore on mount
  const funnelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('sf_scroll')
      if (saved) setTimeout(() => window.scrollTo(0, parseInt(saved)), 50)
    } catch {}
    return () => {
      try { sessionStorage.setItem('sf_scroll', String(window.scrollY)) } catch {}
    }
  }, [])

  const stages: StageData[] = [
    {
      id: 'awareness',
      label: 'STAGE 1: AWARENESS',
      icon: '📢',
      color: '#3b82f6',
      headline: 'They Find You Before They Know They Need You',
      description: 'Most agencies wait for clients to search. We put your name in front of the right decision-makers before the RFP even exists — through paid media, SEO authority content, and strategic social presence. You don\'t chase leads; you attract them.',
      features: [
        { name: 'Paid Media Engine', desc: 'Google Ads, LinkedIn, Meta — automated campaign management with bid optimization and A/B creative testing. Set a budget, we manage the rest.', module: 'paid-media' },
        { name: 'SEO Authority Stack', desc: 'Keyword research → content clusters → technical audits → backlink strategy. Rank for high-intent terms your competitors ignore.', module: 'seo' },
        { name: 'Social Media Presence', desc: 'Platform-specific content calendars, audience targeting, engagement tracking. LinkedIn thought leadership + Instagram/TikTok visual storytelling.', module: 'social' },
        { name: 'Market Researcher AI', desc: 'AI-powered competitor analysis, industry trend spotting, and audience persona development. Know exactly who to target and what they care about.', module: 'market-research' },
      ],
      metric: 'impressions',
      count: 12400,
      value: 0,
    },
    {
      id: 'interest',
      label: 'STAGE 2: INTEREST',
      icon: '🔥',
      color: '#06b6d4',
      headline: 'From Browsers to Buyers — Warm Them Up',
      description: 'Awareness gets attention. Interest builds trust. This stage is where prospects engage with your content, download your tools, and start actively researching. You need a system that captures every signal and responds instantly.',
      features: [
        { name: 'Pitch Engine', desc: 'Pre-built pitch decks, case study libraries, and proposal templates customized per prospect. Generate a full proposal in 60 seconds.', module: 'pitch-engine' },
        { name: 'Email & Lifecycle Automation', desc: 'Drip sequences, lead magnets, newsletter cadences, and re-engagement flows. Every prospect gets the right message at the right time.', module: 'email' },
        { name: 'AI Content Studio', desc: 'Generate blog posts, whitepapers, case studies, and thought leadership content with AI. Set the topic, tone, and target audience — it writes the first draft.', module: 'ai-content' },
        { name: 'Creative Studio', desc: 'On-brand visuals, infographics, video scripts, and ad creative. No design skills needed — templates + AI generation.', module: 'creative' },
      ],
      metric: 'leads',
      count: 1840,
      value: 920000,
    },
    {
      id: 'consideration',
      label: 'STAGE 3: CONSIDERATION',
      icon: '💎',
      color: '#8b5cf6',
      headline: 'They\'re Comparing. Make It an Easy Yes.',
      description: 'Now they\'re evaluating options. Your pricing, scope, and social proof make or break the deal. This stage is about removing friction: clear pricing, instant proposals, and proof that you deliver.',
      features: [
        { name: 'Pricing & Proposals Builder', desc: 'Tiered pricing cards (Foundation / Growth / Scale), custom SOW generation, scope calculators. Prospects see exactly what they get for every dollar.', module: 'pricing' },
        { name: 'SOW Builder', desc: 'Drag-and-drop statement of work builder. Define deliverables, timelines, and milestones. Exports as a professional PDF ready for signature.', module: 'sow' },
        { name: 'Client Reporting (Demo-Ready)', desc: 'Show them what their monthly report will look like: KPI dashboards, campaign performance, SEO rankings — with real data from your existing clients.', module: 'reporting' },
        { name: 'Brand Voice Library', desc: 'Documented tone, style guide, and messaging framework. Prospects see this and know you\'ll represent them consistently.', module: 'brand-voice' },
      ],
      metric: 'proposals',
      count: 421,
      value: 584000,
    },
    {
      id: 'decision',
      label: 'STAGE 4: DECISION',
      icon: '⚡',
      color: '#f59e0b',
      headline: 'Close the Deal with Confidence',
      description: 'The prospect is ready. One last push — the discovery call, the final proposal review, and the signature. This stage is about speed and professionalism. Every minute of delay risks the deal cooling off.',
      features: [
        { name: 'Discovery Call Orchestrator', desc: 'Structured call scripts, agenda templates, objection handlers, and automated follow-up emails. Never forget what to ask or what to follow up on.', module: 'discovery-call' },
        { name: 'Website Builder', desc: 'Build a custom landing page or microsite for the prospect in minutes. 5 industry templates, live preview, AI content fill. "See what we can build for you."', module: 'website-builder' },
        { name: 'Client Portal (Preview Access)', desc: 'Send the prospect a guest portal link showing how their dashboard, invoices, and reports will look. Real-time preview of what they\'re buying.', module: 'client-portal' },
        { name: 'Account Health Dashboard', desc: 'Show them your retention metrics, client satisfaction scores, and renewal rates. Nothing builds trust like transparent data.', module: 'health' },
      ],
      metric: 'meetings',
      count: 147,
      value: 312000,
    },
    {
      id: 'action',
      label: 'STAGE 5: ONBOARDED',
      icon: '🏆',
      color: '#22c55e',
      headline: 'From Signed to Thriving — 14-Day Onboarding',
      description: 'The deal is closed. Now the real work begins. Your onboarding system takes a new client from signed contract to delivered first report in 14 days. No chaos, no dropped balls — just a repeatable process.',
      features: [
        { name: 'Onboarding Sequence', desc: '14-day automated onboarding checklist: kickoff call → audits → brand voice capture → analytics baseline → strategy presentation → first report.', module: 'onboarding' },
        { name: 'Client Portal (Live)', desc: 'Full client hub: invoices, payments, messages, approvals, content deliverables, and campaign performance. Your client has everything in one place.', module: 'client-portal' },
        { name: 'Invoicing & Payments', desc: 'Stripe-integrated invoicing with auto-pay, overdue reminders, payment history, and tax calculation. Get paid on time, every time.', module: 'invoicing' },
        { name: 'Task & Project Management', desc: 'Assign tasks, set deadlines, track progress. Every deliverable is visible to the team and the client. No more "what\'s the status?" emails.', module: 'tasks' },
        { name: 'AI Content Writer (Retainer Fuel)', desc: 'Weekly blog posts, social content, email newsletters — generated, reviewed, and scheduled. The retainer delivers consistent value with less effort.', module: 'ai-content' },
        { name: 'QBR Templates', desc: 'Quarterly business review templates with performance metrics, goal tracking, and growth recommendations. Position yourself as a strategic partner, not a vendor.', module: 'qbr' },
      ],
      metric: 'sales',
      count: 48,
      value: 456000,
    },
  ]

  const totalPipeline = stages.reduce((s, st) => s + st.value, 0)
  const totalProspects = stages[0].count
  const closedDeals = stages[4].count
  const winRate = totalProspects > 0 ? ((closedDeals / stages[3].count) * 100).toFixed(0) : '—'

  return (
    <div>
      {/* HERO HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 16, padding: '32px 28px', marginBottom: 28,
        border: '1px solid #334155',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>
              Frantz Enterprise — Sales Funnel
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, lineHeight: 1.15 }}>
              Your Agency, <span style={{ background: 'linear-gradient(135deg, #6366f1, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Systematized</span>
            </h1>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 8, maxWidth: 500 }}>
              From the first impression to the signed retainer — every stage of your client journey, powered by tools that close deals and deliver results.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'center', padding: '12px 20px', background: '#1e293b', borderRadius: 10 }}>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pipeline Value</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#22c55e' }}>${totalPipeline.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px 20px', background: '#1e293b', borderRadius: 10 }}>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Win Rate</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#6366f1' }}>{winRate}%</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px 20px', background: '#1e293b', borderRadius: 10 }}>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Clients</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#22c55e' }}>{closedDeals}</div>
            </div>
          </div>
        </div>
      </div>

      {/* FUNNEL STAGES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        {stages.map((stage, idx) => {
          const isExpanded = expandedStage === stage.id
          const widthPercent = 100 - (idx * 8)

          return (
            <div
              key={stage.id}
              style={{
                width: '100%',
                maxWidth: `${widthPercent}%`,
                minWidth: idx === 4 ? '98%' : '90%',
                transition: 'all 0.3s ease',
                alignSelf: idx > 0 ? 'center' : 'flex-start',
              }}
            >
              {/* Stage Header Bar */}
              <div
                onClick={() => handleSetExpanded(isExpanded ? null : stage.id)}
                style={{
                  background: isExpanded ? `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)` : `${stage.color}15`,
                  border: `2px solid ${stage.color}`,
                  borderRadius: 12,
                  padding: isExpanded ? 20 : '14px 20px',
                  cursor: 'pointer',
                  boxShadow: isExpanded ? `0 8px 32px ${stage.color}25` : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{stage.icon}</span>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isExpanded ? '#fff' : stage.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {stage.label}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: isExpanded ? '#fff' : '#e2e8f0', marginTop: 1 }}>
                        {stage.headline}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: isExpanded ? '#fff' : '#e2e8f0' }}>{stage.count.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: isExpanded ? '#ffffffaa' : '#64748b' }}>{stage.metric}</div>
                    </div>
                    {stage.value > 0 && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#22c55e' }}>${(stage.value / 1000).toFixed(0)}K</div>
                      </div>
                    )}
                    <div style={{ color: isExpanded ? '#fff' : '#64748b', fontSize: 18 }}>
                      {isExpanded ? '▲' : '▼'}
                    </div>
                  </div>
                </div>

                {/* Collapsed short description */}
                {!isExpanded && (
                  <div style={{ fontSize: 12, color: isExpanded ? '#ffffffcc' : '#64748b', marginTop: 6, paddingLeft: 40, lineHeight: 1.4 }}>
                    {stage.description.substring(0, 80)}...
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{
                  marginTop: 2,
                  background: '#1e293b',
                  border: `1px solid ${stage.color}44`,
                  borderRadius: '0 0 12px 12px',
                  padding: 20,
                  borderTop: 'none',
                }}>
                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                    {stage.description}
                  </p>

                  <div style={{ fontWeight: 700, fontSize: 13, color: '#e2e8f0', marginBottom: 12 }}>
                    🔧 Tools that power this stage:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                    {stage.features.map((feat, fi) => (
                      <div
                        key={fi}
                        style={{
                          background: '#0f172a',
                          borderRadius: 10,
                          padding: 14,
                          border: '1px solid #334155',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{feat.name}</div>
                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.4 }}>{feat.desc}</div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveModule(feat.module) }}
                            style={{
                              padding: '4px 10px', borderRadius: 6, border: 'none',
                              background: stage.color, color: '#fff', fontSize: 11,
                              fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                              marginLeft: 8, flexShrink: 0,
                            }}
                          >
                            Try It →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {stage.value > 0 && (
                    <div style={{
                      marginTop: 14, padding: '10px 14px', background: '#22c55e10',
                      borderRadius: 8, display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', fontSize: 13,
                    }}>
                      <span style={{ color: '#94a3b8' }}>
                        💰 <strong style={{ color: '#22c55e' }}>${(stage.value / 1000).toFixed(0)}K</strong> in {stage.metric} currently in this stage
                      </span>
                      <span style={{ color: '#64748b', fontSize: 12 }}>
                        {stage.count} {stage.label.split(':')[1]?.trim() || stage.metric}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* BOTTOM CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 16, padding: 28, border: '1px solid #334155',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px 0' }}>
          This Could Be <span style={{ color: '#22c55e' }}>Your Dashboard</span>
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', maxWidth: 500, margin: '0 auto 16px' }}>
          Every tool shown here is built into Frantz Enterprise. You're already running it. Open any module from the sidebar and start putting it to work.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: '📊 Dashboard', module: 'dashboard' },
            { label: '📄 Client Reports', module: 'reporting' },
            { label: '🤖 AI Content Studio', module: 'ai-content' },
            { label: '📈 Pipeline', module: 'pipeline' },
          ].map(btn => (
            <button
              key={btn.module}
              onClick={() => setActiveModule(btn.module)}
              className="btn btn-primary"
              style={{ fontSize: 12 }}
            >
              {btn.label} →
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
