import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const integrationCatalog = [
  { platform: 'openai', name: 'OpenAI', category: 'ai' as const, icon: '🧠', desc: 'GPT-4, DALL-E, Whisper — text, image & audio generation' },
  { platform: 'anthropic', name: 'Anthropic', category: 'ai' as const, icon: '🔮', desc: 'Claude — advanced text generation & analysis' },
  { platform: 'stability', name: 'Stability AI', category: 'ai' as const, icon: '🎨', desc: 'Stable Diffusion — image generation' },
  { platform: 'runway', name: 'Runway', category: 'ai' as const, icon: '🎬', desc: 'Gen-3 Alpha — video generation & editing' },
  { platform: 'midjourney', name: 'Midjourney', category: 'ai' as const, icon: '✨', desc: 'Image generation via API' },
  { platform: 'linkedin', name: 'LinkedIn', category: 'social' as const, icon: '💼', desc: 'Company pages, organic posts, ad campaigns' },
  { platform: 'google_business', name: 'Google Business', category: 'social' as const, icon: '📍', desc: 'Google Business Profile — posts, reviews, insights' },
  { platform: 'yelp', name: 'Yelp', category: 'social' as const, icon: '⭐', desc: 'Business page management & review monitoring' },
  { platform: 'amazon', name: 'Amazon', category: 'ads' as const, icon: '🛍️', desc: 'Amazon Ads, brand registry, product pages' },
  { platform: 'reddit', name: 'Reddit', category: 'social' as const, icon: '🧵', desc: 'Reddit Ads & community management' },
  { platform: 'facebook', name: 'Facebook', category: 'social' as const, icon: '📘', desc: 'Page management & Meta Ads' },
  { platform: 'instagram', name: 'Instagram', category: 'social' as const, icon: '📸', desc: 'Instagram posting & Meta Ads' },
  { platform: 'twitter', name: 'X / Twitter', category: 'social' as const, icon: '🐦', desc: 'Tweet scheduling & X Ads' },
  { platform: 'tiktok', name: 'TikTok', category: 'social' as const, icon: '🎵', desc: 'TikTok posting & TikTok Ads' },
  { platform: 'pinterest', name: 'Pinterest', category: 'ads' as const, icon: '📌', desc: 'Pinterest Ads & pin scheduling' },
  { platform: 'snapchat', name: 'Snapchat', category: 'ads' as const, icon: '👻', desc: 'Snapchat Ads' },
  { platform: 'mailchimp', name: 'Mailchimp', category: 'email' as const, icon: '📧', desc: 'Email campaigns, automations, audiences' },
  { platform: 'sendgrid', name: 'SendGrid', category: 'email' as const, icon: '✉️', desc: 'Transactional email & marketing campaigns' },
  { platform: 'constant_contact', name: 'Constant Contact', category: 'email' as const, icon: '📬', desc: 'Email marketing & automation' },
  { platform: 'hubspot', name: 'HubSpot', category: 'crm' as const, icon: '🔄', desc: 'CRM, marketing hub, pipeline management' },
  { platform: 'salesforce', name: 'Salesforce', category: 'crm' as const, icon: '☁️', desc: 'Enterprise CRM & marketing cloud' },
  { platform: 'zoho', name: 'Zoho CRM', category: 'crm' as const, icon: '🌐', desc: 'CRM, projects, & analytics' },
  { platform: 'google_analytics', name: 'Google Analytics', category: 'analytics' as const, icon: '📊', desc: 'Web analytics & conversion tracking' },
  { platform: 'google_ads', name: 'Google Ads', category: 'ads' as const, icon: '📣', desc: 'Search, display, YouTube & shopping ads' },
  { platform: 'meta_ads', name: 'Meta Ads', category: 'ads' as const, icon: '📱', desc: 'Facebook & Instagram ad campaigns' },
  { platform: 'microsoft_ads', name: 'Microsoft Ads', category: 'ads' as const, icon: '🔍', desc: 'Bing search & audience ads' },
  { platform: 'googledrive', name: 'Google Drive', category: 'storage' as const, icon: '🗂️', desc: 'File storage & document collaboration' },
  { platform: 'dropbox', name: 'Dropbox', category: 'storage' as const, icon: '📦', desc: 'Cloud file storage & sharing' },
  { platform: 'aws_s3', name: 'AWS S3', category: 'storage' as const, icon: '☁️', desc: 'Cloud object storage for assets & backups' },
  { platform: 'calendly', name: 'Calendly', category: 'other' as const, icon: '📅', desc: 'Scheduling & meeting automation' },
  { platform: 'zapier', name: 'Zapier', category: 'other' as const, icon: '⚡', desc: 'Workflow automation between 6,000+ apps' },
  { platform: 'make', name: 'Make', category: 'other' as const, icon: '🔗', desc: 'Visual automation platform' },
  { platform: 'stripe', name: 'Stripe', category: 'other' as const, icon: '💳', desc: 'Payment processing & billing' },
  { platform: 'quickbooks', name: 'QuickBooks', category: 'other' as const, icon: '🧾', desc: 'Accounting & invoicing' },
  { platform: 'slack', name: 'Slack', category: 'other' as const, icon: '💬', desc: 'Team communication & notifications' },
]

type Tab = 'integrations' | 'general' | 'team' | 'billing' | 'export'

export default function SettingsPage() {
  const { apiConfig, integrations, settings, updateApiConfig, addIntegration, updateIntegration, removeIntegration, updateSettings, exportData, importData, resetData } = useAppStore()
  const [tab, setTab] = useState<Tab>('integrations')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAdd, setShowAdd] = useState<string | null>(null)
  const [newApiKey, setNewApiKey] = useState('')
  const [newApiUrl, setNewApiUrl] = useState('')

  const handleConnect = (platform: string, name: string, category: string, icon: string) => {
    if (!newApiKey.trim()) return
    const existing = integrations.find(i => i.platform === platform)
    if (existing) {
      updateIntegration(existing.id, { apiKey: newApiKey, apiUrl: newApiUrl, status: 'connected', lastVerified: new Date().toISOString() })
    } else {
      addIntegration({
        name, platform, category: category as any, apiKey: newApiKey, apiUrl: newApiUrl,
        enabled: true, config: {}, status: 'connected', icon,
      })
    }
    setNewApiKey('')
    setNewApiUrl('')
    setShowAdd(null)
  }

  const handleDisconnect = (id: string) => {
    updateIntegration(id, { status: 'disconnected', enabled: false })
  }

  const handleDelete = (id: string) => {
    if (confirm('Remove this integration permanently?')) removeIntegration(id)
  }

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `frantz-enterprise-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      importData(text)
    }
    input.click()
  }

  const filteredCatalog = integrationCatalog.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.platform.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || i.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const availableInts = filteredCatalog.filter(i => !integrations.some(x => x.platform === i.platform))
  const connectedInts = integrations.filter(i => i.status === 'connected')
  const disconnectedInts = integrations.filter(i => i.status !== 'connected')

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Settings</h2>
          <p className="section-desc">Manage integrations, agency settings, and data.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 8, flexWrap: 'wrap' }}>
        {([
          { id: 'integrations' as const, label: '🔌 Integrations', count: integrations.length },
          { id: 'general' as const, label: '⚙️ General' },
          { id: 'team' as const, label: '👥 Team' },
          { id: 'billing' as const, label: '💳 Billing' },
          { id: 'export' as const, label: '📦 Export / Import' },
        ]).map(t => (
          <button key={t.id} className={`btn btn-ghost btn-sm ${tab === t.id ? 'btn-active' : ''}`}
            onClick={() => setTab(t.id)}>
            {t.label}{t.count !== undefined ? ` (${t.count})` : ''}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════ INTEGRATIONS ═══ */}
      {tab === 'integrations' && (
        <div>
          {/* Connected */}
          {connectedInts.length > 0 && (
            <>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>✅ Connected</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, marginBottom: 20 }}>
                {connectedInts.map(int => (
                  <div key={int.id} className="card" style={{ borderColor: 'var(--success-500)', padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{int.icon} {int.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Connected {new Date(int.connectedAt).toLocaleDateString()}</div>
                      </div>
                      <span className="tag" style={{ background: 'var(--success-500)20', color: 'var(--success-500)' }}>Live</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      URL: {int.apiUrl || 'default'}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <button className="btn btn-sm btn-ghost" onClick={() => handleDisconnect(int.id)}>Disconnect</button>
                      <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger-500)' }} onClick={() => handleDelete(int.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Disconnected */}
          {disconnectedInts.length > 0 && (
            <>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>⚠️ Disconnected</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, marginBottom: 20 }}>
                {disconnectedInts.map(int => (
                  <div key={int.id} className="card" style={{ opacity: 0.7, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{int.icon} {int.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{int.status === 'error' ? 'Last sync failed' : 'Disconnected'}</div>
                      </div>
                      <span className="tag" style={{ background: 'var(--text-muted)20', color: 'var(--text-muted)' }}>Offline</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <button className="btn btn-sm" onClick={() => setShowAdd(int.platform)}>Reconnect</button>
                      <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger-500)' }} onClick={() => handleDelete(int.id)}>Remove</button>
                    </div>
                    {showAdd === int.platform && (
                      <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-tertiary)', borderRadius: 6 }}>
                        <input className="input" type="password" value={newApiKey} onChange={e => setNewApiKey(e.target.value)} placeholder="API Key" style={{ marginBottom: 6, fontSize: 12 }} />
                        <input className="input" value={newApiUrl} onChange={e => setNewApiUrl(e.target.value)} placeholder="API URL (optional)" style={{ marginBottom: 6, fontSize: 12 }} />
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-sm btn-primary" onClick={() => handleConnect(int.platform, int.name, int.category, int.icon)}>Save</button>
                          <button className="btn btn-sm btn-ghost" onClick={() => setShowAdd(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Add New */}
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
            + Add Integration
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>{availableInts.length} available</span>
          </h3>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="input" style={{ maxWidth: 240 }} placeholder="Search integrations..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="input" style={{ maxWidth: 160 }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="ai">AI & Content</option>
              <option value="social">Social Media</option>
              <option value="email">Email</option>
              <option value="ads">Advertising</option>
              <option value="analytics">Analytics</option>
              <option value="crm">CRM</option>
              <option value="storage">Storage</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
            {availableInts.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', gridColumn: '1 / -1', padding: 20, textAlign: 'center' }}>
                {search || categoryFilter !== 'all' ? 'No matching integrations found.' : 'All integrations are connected!'}
              </p>
            ) : availableInts.map(int => (
              <div key={int.platform} className="card" style={{ cursor: 'pointer', padding: 12 }}
                onClick={() => setShowAdd(showAdd === int.platform ? null : int.platform)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{int.icon} {int.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{int.desc}</div>
                  </div>
                  <span className="tag" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: 10 }}>
                    {int.category}
                  </span>
                </div>
                {showAdd === int.platform && (
                  <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-tertiary)', borderRadius: 6 }}
                    onClick={e => e.stopPropagation()}>
                    <input className="input" type="password" value={newApiKey} onChange={e => setNewApiKey(e.target.value)}
                      placeholder="API Key / Access Token" style={{ marginBottom: 6, fontSize: 12 }} autoFocus />
                    <input className="input" value={newApiUrl} onChange={e => setNewApiUrl(e.target.value)}
                      placeholder="API URL (optional)" style={{ marginBottom: 6, fontSize: 12 }} />
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-sm btn-primary" onClick={() => handleConnect(int.platform, int.name, int.category, int.icon)}
                        disabled={!newApiKey.trim()}>Connect</button>
                      <button className="btn btn-sm btn-ghost" onClick={() => setShowAdd(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════ GENERAL ════════ */}
      {tab === 'general' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Agency Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Agency Name</label>
              <input className="input" value={settings.agencyName} onChange={e => updateSettings({ agencyName: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Tagline</label>
              <input className="input" value={settings.agencyTagline} onChange={e => updateSettings({ agencyTagline: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Default Timezone</label>
              <select className="input" value={settings.defaultTimezone} onChange={e => updateSettings({ defaultTimezone: e.target.value })}>
                <option value="US/Eastern">US/Eastern</option>
                <option value="US/Central">US/Central</option>
                <option value="US/Mountain">US/Mountain</option>
                <option value="US/Pacific">US/Pacific</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Chicago">America/Chicago</option>
                <option value="America/Denver">America/Denver</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Currency</label>
              <select className="input" value={settings.currency} onChange={e => updateSettings({ currency: e.target.value })}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Date Format</label>
              <select className="input" value={settings.dateFormat} onChange={e => updateSettings({ dateFormat: e.target.value })}>
                <option value="MMMM D, YYYY">May 15, 2026</option>
                <option value="MM/DD/YYYY">05/15/2026</option>
                <option value="DD/MM/YYYY">15/05/2026</option>
                <option value="YYYY-MM-DD">2026-05-15</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Week Start Day</label>
              <select className="input" value={settings.weekStartDay} onChange={e => updateSettings({ weekStartDay: Number(e.target.value) })}>
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
              </select>
            </div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '24px 0 12px' }}>API Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>AI Base URL</label>
              <input className="input" value={apiConfig.baseUrl} onChange={e => updateApiConfig({ baseUrl: e.target.value })} placeholder="https://api.example.com/generate" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>AI API Key</label>
              <input className="input" type="password" value={apiConfig.apiKey} onChange={e => updateApiConfig({ apiKey: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Text Model</label>
              <input className="input" value={apiConfig.textModel} onChange={e => updateApiConfig({ textModel: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Image Model</label>
              <input className="input" value={apiConfig.imageModel} onChange={e => updateApiConfig({ imageModel: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Video Model</label>
              <input className="input" value={apiConfig.videoModel} onChange={e => updateApiConfig({ videoModel: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ TEAM ══════ */}
      {tab === 'team' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Team Members</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500 }}>
            {useAppStore.getState().agents.map(agent => (
              <div key={agent.id} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                  {agent.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{agent.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{agent.title}</div>
                </div>
                <span className="tag" style={{ marginLeft: 'auto', fontSize: 10, background: agent.active ? 'var(--success-500)20' : 'var(--text-muted)20', color: agent.active ? 'var(--success-500)' : 'var(--text-muted)' }}>
                  {agent.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
            Team members are synced from the Roster. Manage roles and skills from the <strong>AGENCY → Roster</strong> page.
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════ BILLING ════ */}
      {tab === 'billing' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Billing & Subscription</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            <div className="card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Plan</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--brand-500)', marginTop: 4 }}>Agency Pro</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Monthly MRR</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--success-500)', marginTop: 4 }}>
                ${useAppStore.getState().revenueHistory[useAppStore.getState().revenueHistory.length-1]?.mrr.toLocaleString() || '30,000'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Across {useAppStore.getState().clients.length} clients</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Integrations</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-500)', marginTop: 4 }}>{integrations.length}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Connected services</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Full billing management and subscription changes coming in a future update.
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════ EXPORT ═════ */}
      {tab === 'export' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Export / Import Data</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Export all agency data as JSON for backup, or import a previously exported file to restore state.
            This includes all clients, projects, tasks, revenue history, integrations, and settings.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button className="btn btn-primary" onClick={handleExport}>
              📥 Export All Data
            </button>
            <button className="btn" onClick={handleImport}>
              📤 Import Data
            </button>
            <button className="btn" style={{ background: 'var(--danger-500)20', color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }} onClick={() => { if (confirm('Reset all data to defaults? This cannot be undone.')) resetData() }}>
              🗑️ Reset to Defaults
            </button>
          </div>
          <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
            <strong>Last export:</strong> {new Date().toLocaleDateString()} (generated on demand)
          </div>
        </div>
      )}
    </div>
  )
}
