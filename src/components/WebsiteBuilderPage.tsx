import { useState, useMemo, useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Globe, Plus, Trash2, Edit3, Eye, Smartphone, Monitor, Palette, Type, Image, Columns, Save, Send, Check, X, ArrowLeft, ExternalLink, Copy, Play, Pause, ChevronDown, ChevronUp, Layout, Sparkles } from 'lucide-react'
import EmptyState from './EmptyState'

type ViewMode = 'list' | 'editor' | 'preview'

const sectionIcons: Record<string, React.ReactNode> = {
  hero: <Layout size={14} />,
  features: <Layout size={14} />,
  testimonials: <Layout size={14} />,
  pricing: <Layout size={14} />,
  faq: <Layout size={14} />,
  cta: <Layout size={14} />,
  contact: <Layout size={14} />,
  about: <Layout size={14} />,
  services: <Layout size={14} />,
  stats: <Layout size={14} />,
  logos: <Layout size={14} />,
  footer: <Layout size={14} />,
}

export default function WebsiteBuilderPage() {
  const { websites, websiteTemplates, clients, addWebsite, updateWebsite, publishWebsite, removeWebsite, addToast } = useAppStore()
  const [view, setView] = useState<ViewMode>('list')
  const [editingSite, setEditingSite] = useState<string | null>(null)
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [previewMobile, setPreviewMobile] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(websiteTemplates[0]?.id || '')
  const [siteName, setSiteName] = useState('')
  const [clientId, setClientId] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')

  // Editing state
  const site = websites.find(s => s.id === editingSite)
  const template = websiteTemplates.find(t => t.id === (site?.templateId || selectedTemplate))
  const client = clients.find(c => c.id === (site?.clientId || clientId))
  const page = site?.pages.find(p => p.id === (editingPage || site.pages[0]?.id))
  const activePage = page || site?.pages[0]

  const genId = () => `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

  const handleCreateSite = useCallback(() => {
    if (!siteName.trim()) return
    const tpl = websiteTemplates.find(t => t.id === selectedTemplate)
    if (!tpl) return
    const pages = JSON.parse(JSON.stringify(tpl.pages)) as typeof tpl.pages
    addWebsite({
      clientId,
      name: siteName.trim(),
      domain: `${siteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.frantzmarketing.com`,
      published: false,
      publishedUrl: `/site/${Date.now()}`,
      templateId: selectedTemplate,
      colorScheme: { ...tpl.colorScheme },
      fontFamily: tpl.fontFamily,
      pages,
      seoSettings: { title: '', description: '', keywords: '', googleAnalyticsId: '' },
    })
    setShowNewForm(false)
    setSiteName('')
    setAiPrompt('')
    addToast('success', 'Website created', `${tpl.name} template applied`)
  }, [siteName, selectedTemplate, clientId, websiteTemplates, addWebsite, addToast])

  const handleSaveSection = useCallback((pageId: string, sectionId: string, data: Record<string, any>) => {
    if (!editingSite) return
    const s = websites.find(w => w.id === editingSite)
    if (!s) return
    const newPages = s.pages.map(p => {
      if (p.id !== pageId) return p
      return { ...p, sections: p.sections.map(sec => sec.id === sectionId ? { ...sec, ...data } : sec) }
    })
    updateWebsite(editingSite, { pages: newPages })
    addToast('info', 'Section updated')
  }, [editingSite, websites, updateWebsite, addToast])

  const handleAddSection = useCallback((pageId: string, type: string) => {
    if (!editingSite) return
    const s = websites.find(w => w.id === editingSite)
    if (!s) return
    const newSection = {
      id: genId(), type: type as any, heading: 'New Section', subheading: 'Edit this text', layout: 'center' as const,
      items: [{ title: 'Item 1', description: 'Description' }],
      ctaText: 'Get Started', ctaUrl: '#', show: true, order: s.pages.find(p => p.id === pageId)?.sections.length || 0,
    }
    const newPages = s.pages.map(p => {
      if (p.id !== pageId) return p
      return { ...p, sections: [...p.sections, newSection] }
    })
    updateWebsite(editingSite, { pages: newPages })
    addToast('success', 'Section added')
  }, [editingSite, websites, updateWebsite, addToast])

  const handleRemoveSection = useCallback((pageId: string, sectionId: string) => {
    if (!editingSite) return
    const s = websites.find(w => w.id === editingSite)
    if (!s) return
    const newPages = s.pages.map(p => {
      if (p.id !== pageId) return p
      return { ...p, sections: p.sections.filter(sec => sec.id !== sectionId) }
    })
    updateWebsite(editingSite, { pages: newPages })
    addToast('info', 'Section removed')
  }, [editingSite, websites, updateWebsite, addToast])

  // ── Section Editor ──
  const renderSectionEditor = (sec: any) => {
    return (
      <div key={sec.id} className="card" style={{ marginBottom: 12, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {sectionIcons[sec.type] || <Layout size={14} />}
            <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{sec.type}</span>
            <span className="tag" style={{ fontSize: 10, background: sec.show ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.15)', color: sec.show ? '#22c55e' : '#6b7280' }}>
              {sec.show ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-ghost btn-icon" onClick={() => handleRemoveSection(activePage?.id!, sec.id)} title="Remove section">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Heading */}
        <div className="form-field">
          <label>Heading</label>
          <input type="text" value={sec.heading || ''} onChange={e => handleSaveSection(activePage?.id!, sec.id, { heading: e.target.value })} style={inputStyle} />
        </div>

        {/* Subheading */}
        {(sec.type !== 'footer' && sec.type !== 'logos') && (
          <div className="form-field">
            <label>Subheading</label>
            <input type="text" value={sec.subheading || ''} onChange={e => handleSaveSection(activePage?.id!, sec.id, { subheading: e.target.value })} style={inputStyle} />
          </div>
        )}

        {/* Content (for about, footer) */}
        {(sec.type === 'about' || sec.type === 'footer') && (
          <div className="form-field">
            <label>Content</label>
            <textarea rows={3} value={sec.content || ''} onChange={e => handleSaveSection(activePage?.id!, sec.id, { content: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        )}

        {/* CTA */}
        {(sec.type === 'hero' || sec.type === 'cta') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="form-field">
              <label>CTA Text</label>
              <input type="text" value={sec.ctaText || ''} onChange={e => handleSaveSection(activePage?.id!, sec.id, { ctaText: e.target.value })} style={inputStyle} />
            </div>
            <div className="form-field">
              <label>CTA URL</label>
              <input type="text" value={sec.ctaUrl || ''} onChange={e => handleSaveSection(activePage?.id!, sec.id, { ctaUrl: e.target.value })} style={inputStyle} />
            </div>
          </div>
        )}

        {/* Items (features, services, pricing, testimonials, logos) */}
        {(sec.type === 'features' || sec.type === 'services' || sec.type === 'pricing' || sec.type === 'testimonials' || sec.type === 'logos' || sec.type === 'gallery') && (
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Items</label>
            {sec.items?.map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                <input type="text" value={item.title} onChange={e => {
                  const newItems = [...sec.items]; newItems[i] = { ...newItems[i], title: e.target.value }
                  handleSaveSection(activePage?.id!, sec.id, { items: newItems })
                }} style={{ ...inputStyle, flex: 1 }} placeholder="Title" />
                <input type="text" value={item.description} onChange={e => {
                  const newItems = [...sec.items]; newItems[i] = { ...newItems[i], description: e.target.value }
                  handleSaveSection(activePage?.id!, sec.id, { items: newItems })
                }} style={{ ...inputStyle, flex: 1 }} placeholder="Description" />
                <button className="btn btn-ghost btn-icon" onClick={() => {
                  const newItems = sec.items.filter((_: any, j: number) => j !== i)
                  handleSaveSection(activePage?.id!, sec.id, { items: newItems })
                }}><X size={12} /></button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => {
              const newItems = [...(sec.items || []), { title: 'New Item', description: 'Description' }]
              handleSaveSection(activePage?.id!, sec.id, { items: newItems })
            }}>
              <Plus size={12} /> Add Item
            </button>
          </div>
        )}

        {/* Layout selector */}
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="form-field" style={{ margin: 0 }}>
            <label>Layout</label>
            <select value={sec.layout || 'center'} onChange={e => handleSaveSection(activePage?.id!, sec.id, { layout: e.target.value })} style={selectStyle}>
              <option value="center">Center</option>
              <option value="left">Left Align</option>
              <option value="grid-2">2 Columns</option>
              <option value="grid-3">3 Columns</option>
              <option value="grid-4">4 Columns</option>
            </select>
          </div>
          <div className="form-field" style={{ margin: 0 }}>
            <label>Visibility</label>
            <select value={sec.show ? 'true' : 'false'} onChange={e => handleSaveSection(activePage?.id!, sec.id, { show: e.target.value === 'true' })} style={selectStyle}>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  // ── Preview ──
  const renderPreview = () => {
    if (!site) return null
    const p = activePage || site.pages[0]
    return (
      <div style={previewMobile ? { maxWidth: 375, margin: '0 auto', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', minHeight: 600 } : {}}>
        {/* Preview TopBar */}
        <div style={{ background: site.colorScheme.primary, color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, fontFamily: site.fontFamily }}>
          <span style={{ fontWeight: 700 }}>{site.name}</span>
          <nav style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            {site.pages.map(pg => (
              <span key={pg.id} style={{ cursor: 'pointer', opacity: pg.id === activePage?.id ? 1 : 0.7, borderBottom: pg.id === activePage?.id ? '2px solid #fff' : 'none', paddingBottom: 2 }}
                onClick={() => setEditingPage(pg.id)}>
                {pg.name}
              </span>
            ))}
          </nav>
        </div>

        {p.sections.filter(s => s.show).sort((a, b) => a.order - b.order).map(sec => {
          const isDark = sec.bgColor && sec.bgColor !== '#ffffff'
          return (
            <section key={sec.id} style={{
              padding: '40px 24px',
              background: sec.bgColor || site.colorScheme.background,
              color: sec.textColor || site.colorScheme.text,
              fontFamily: site.fontFamily,
              textAlign: sec.layout === 'center' || sec.layout === 'grid-2' || sec.layout === 'grid-3' || sec.layout === 'grid-4' ? 'center' : 'left',
            }}>
              {sec.heading && <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: isDark ? '#fff' : site.colorScheme.text }}>{sec.heading}</h2>}
              {sec.subheading && <p style={{ fontSize: 16, margin: '0 0 24px', opacity: 0.8, lineHeight: 1.5 }}>{sec.subheading}</p>}
              {sec.content && <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>{sec.content}</p>}

              {/* Grid items */}
              {sec.items && sec.items.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: sec.layout === 'grid-2' ? '1fr 1fr' : sec.layout === 'grid-4' ? 'repeat(4, 1fr)' : sec.layout === 'grid-3' || sec.items.length >= 3 ? 'repeat(3, 1fr)' : '1fr',
                  gap: 20,
                  maxWidth: 800,
                  margin: '0 auto',
                }}>
                  {sec.items.map((item: any, i: number) => (
                    <div key={i} style={{
                      padding: sec.type === 'pricing' ? 24 : 16,
                      border: sec.type === 'pricing' ? '2px solid rgba(0,0,0,0.1)' : 'none',
                      borderRadius: 12,
                      background: sec.type === 'pricing' ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}>
                      {item.icon && <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>}
                      {item.imageUrl && <div style={{ fontSize: 48, marginBottom: 8, opacity: 0.5 }}>{item.imageUrl}</div>}
                      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>{item.description}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA button */}
              {sec.ctaText && (
                <div style={{ marginTop: 24 }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '12px 32px',
                    borderRadius: 8,
                    background: site.colorScheme.primary,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                  }}>{sec.ctaText}</span>
                </div>
              )}
            </section>
          )
        })}
      </div>
    )
  }

  // ── List View ──
  if (view === 'list') {
    return (
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">🌐 Website Builder</h2>
            <p className="section-desc">Create AI-powered landing pages and websites for your clients — or your own brand.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowNewForm(true)}>
            <Plus size={16} /> New Site
          </button>
        </div>

        {showNewForm && (
          <div className="card" style={{ marginBottom: 16, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Create a New Website</h3>
            <div className="form-field">
              <label>Site Name</label>
              <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="e.g. BrightPath Dental" style={inputStyle} />
            </div>
            <div className="form-field">
              <label>Client (optional)</label>
              <select value={clientId} onChange={e => setClientId(e.target.value)} style={selectStyle}>
                <option value="">— Standalone site —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Template</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                {websiteTemplates.map(t => (
                  <button key={t.id} onClick={() => setSelectedTemplate(t.id)} style={{
                    padding: 12, borderRadius: 10, border: selectedTemplate === t.id ? '2px solid var(--brand-500)' : '1px solid var(--border)',
                    background: selectedTemplate === t.id ? 'rgba(99,102,241,0.08)' : 'transparent', cursor: 'pointer', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{t.previewImage}</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Prompt */}
            <div className="form-field">
              <label>AI Content (optional)</label>
              <textarea
                rows={2}
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Describe your business: 'A dental practice in Austin specializing in cosmetic dentistry and implants'"
                style={{ ...inputStyle, resize: 'vertical', fontSize: 13 }}
              />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                <Sparkles size={11} /> AI will auto-fill content based on your description
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowNewForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateSite} disabled={!siteName.trim()}>
                <Sparkles size={14} /> Create Site
              </button>
            </div>
          </div>
        )}

        {websites.length === 0 && !showNewForm && (
          <EmptyState
            icon={<Globe size={40} />}
            title="No websites yet"
            description="Create your first landing page or website with our AI-powered builder. Pick a template, customize, and publish."
            action={{ label: 'Create Your First Site', onClick: () => setShowNewForm(true) }}
          />
        )}

        {websites.map(s => {
          const t = websiteTemplates.find(t => t.id === s.templateId)
          const c = clients.find(c => c.id === s.clientId)
          return (
            <div key={s.id} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 32 }}>{t?.previewImage || '🌐'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 10, marginTop: 2 }}>
                  <span>{t?.name || 'Custom'}</span>
                  {c && <span>· {c.name}</span>}
                  <span>· {s.domain}</span>
                  <span>· {s.pages.length} page{s.pages.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className={`tag ${s.published ? 'tag-green' : 'tag-gray'}`}>
                  {s.published ? 'Published' : 'Draft'}
                </span>
                <button className="btn btn-ghost btn-icon" onClick={() => publishWebsite(s.id)} title={s.published ? 'Unpublish' : 'Publish'}>
                  {s.published ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setEditingSite(s.id); setEditingPage(s.pages[0]?.id); setView('editor'); }}>
                  <Edit3 size={14} /> Edit
                </button>
                <button className="btn btn-ghost btn-icon" onClick={() => removeWebsite(s.id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Editor View ──
  if (view === 'editor' && site) {
    const p = activePage || site.pages[0]
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Editor TopBar */}
        <div className="card" style={{ padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { setView('list'); setEditingSite(null); setEditingPage(null); }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{site.name}</div>
          <select value={editingPage || ''} onChange={e => setEditingPage(e.target.value)} style={{ ...selectStyle, width: 'auto', fontSize: 12 }}>
            {site.pages.map(pg => <option key={pg.id} value={pg.id}>{pg.name}</option>)}
          </select>
          <button className={`btn btn-sm ${previewMobile ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setPreviewMobile(false)}>
            <Monitor size={14} /> Desktop
          </button>
          <button className={`btn btn-sm ${previewMobile ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setPreviewMobile(true)}>
            <Smartphone size={14} /> Mobile
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setView('preview')}>
            <Eye size={14} /> Preview
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => { publishWebsite(site.id); addToast('success', site.published ? 'Site unpublished' : 'Site published'); }}>
            {site.published ? 'Unpublish' : 'Publish'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Left: Editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Page Sections</h3>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleAddSection(activePage?.id!, 'hero')}><Plus size={12} /> Hero</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleAddSection(activePage?.id!, 'features')}><Plus size={12} /> Features</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleAddSection(activePage?.id!, 'cta')}><Plus size={12} /> CTA</button>
              </div>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '70vh', paddingRight: 4 }}>
              {p.sections.sort((a, b) => a.order - b.order).map(sec => renderSectionEditor(sec))}
            </div>
          </div>

          {/* Right: Live Preview */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', maxHeight: '80vh', overflowY: 'auto', background: '#fff' }}>
            {renderPreview()}
          </div>
        </div>
      </div>
    )
  }

  // ── Full Preview ──
  if (view === 'preview') {
    return (
      <div>
        <div className="card" style={{ padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setView('editor')}>
            <ArrowLeft size={14} /> Back to Editor
          </button>
          <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{site?.name} — Full Preview</div>
          <button className={`btn btn-sm ${!previewMobile ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setPreviewMobile(false)}>
            <Monitor size={14} /> Desktop
          </button>
          <button className={`btn btn-sm ${previewMobile ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setPreviewMobile(true)}>
            <Smartphone size={14} /> Mobile
          </button>
        </div>
        <div style={{ background: '#f1f5f9', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          {renderPreview()}
        </div>
      </div>
    )
  }

  return null
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, width: '100%', boxSizing: 'border-box',
}
const selectStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, width: '100%',
}
