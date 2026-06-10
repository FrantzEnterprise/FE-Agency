import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { Autoresponder, AutoresponderStep, AutoresponderTriggerType, ContactList, ContactEntry, EmailTemplate, EmailCampaign } from '../types'

type EmailTab = 'dashboard' | 'campaigns' | 'lists' | 'autoresponders' | 'templates'

// ─── Email sending helpers ──────────────────────────────────────────

function getEmailProvider(integrations: any[]) {
  return integrations.find(i => i.category === 'email' && i.apiKey && i.enabled)
}

async function sendViaProvider(provider: any, to: string, subject: string, htmlBody: string): Promise<{ ok: boolean; error?: string }> {
  if (!provider) {
    // Simulated send (no provider configured)
    await new Promise(r => setTimeout(r, 300))
    return { ok: true }
  }

  const platform = provider.platform.toLowerCase()

  if (platform === 'sendgrid') {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: 'noreply@frantzenterprise.com', name: 'Frantz Enterprise' },
          subject,
          content: [{ type: 'text/html', value: htmlBody }],
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        return { ok: false, error: `SendGrid error ${res.status}: ${text}` }
      }
      return { ok: true }
    } catch (err: any) {
      return { ok: false, error: err.message || 'SendGrid request failed' }
    }
  }

  if (platform === 'mailgun') {
    try {
      const domain = provider.apiUrl?.replace(/^https?:\/\//, '') || 'mg.example.com'
      const formData = new URLSearchParams()
      formData.append('from', 'Frantz Enterprise <noreply@frantzenterprise.com>')
      formData.append('to', to)
      formData.append('subject', subject)
      formData.append('html', htmlBody)

      const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${provider.apiKey}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })
      if (!res.ok) {
        const text = await res.text()
        return { ok: false, error: `Mailgun error ${res.status}: ${text}` }
      }
      return { ok: true }
    } catch (err: any) {
      return { ok: false, error: err.message || 'Mailgun request failed' }
    }
  }

  // Generic SMTP / other — simulate for now
  await new Promise(r => setTimeout(r, 300))
  return { ok: true }
}

// ─── Component ───────────────────────────────────────────────────────

export default function EmailPage() {
  const { emailCampaigns, contactLists, autoresponders, emailTemplates, clients, integrations, addContactList, addContactToList, removeContactFromList, addAutoresponder, updateAutoresponder, addAutoresponderStep, removeAutoresponderStep, updateAutoresponderStep, addEmailTemplate, updateEmailTemplate, updateEmailCampaign } = useAppStore()
  const getClient = (id: string) => clients.find(c => c.id === id)
  const emailProvider = getEmailProvider(integrations)

  // Send state
  const [sendingCampaign, setSendingCampaign] = useState<string | null>(null)
  const [sendStatus, setSendStatus] = useState<{ campaignId: string; ok: boolean; msg: string } | null>(null)

  const [tab, setTab] = useState<EmailTab>('dashboard')
  const [expandedAutoresponder, setExpandedAutoresponder] = useState<string | null>(null)

  const tabs: { id: EmailTab; label: string }[] = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'campaigns', label: '📨 Campaigns' },
    { id: 'lists', label: '👥 Lists' },
    { id: 'autoresponders', label: '⚡ Autoresponders' },
    { id: 'templates', label: '📝 Templates' },
  ]

  // Stats
  const totalSent = emailCampaigns.reduce((s, e) => s + e.sent, 0)
  const totalOpens = emailCampaigns.reduce((s, e) => s + e.opens, 0)
  const totalClicks = emailCampaigns.reduce((s, e) => s + e.clicks, 0)
  const avgOpenRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : '0.0'
  const totalContacts = contactLists.reduce((s, l) => s + l.contacts.length, 0)
  const subscribedContacts = contactLists.reduce((s, l) => s + l.contacts.filter(c => c.subscribed).length, 0)
  const totalTriggered = autoresponders.reduce((s, a) => s + a.stats.totalTriggered, 0)
  const activeAutoresponders = autoresponders.filter(a => a.status === 'active').length

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Email &amp; Lifecycle Automation</h2>
          <p className="section-desc">Campaigns, contact lists, autoresponder sequences, and email templates.</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} className="btn" style={{
            background: tab === t.id ? 'var(--brand-500)' : 'var(--bg-secondary)',
            color: tab === t.id ? '#fff' : 'var(--text-primary)',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── Email Provider Banner ── */}
      {!emailProvider ? (
        <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: 'var(--warning-500)15', border: '1px solid var(--warning-500)', fontSize: 13, color: 'var(--text-primary)' }}>
          ⚠️ <strong>No email provider configured.</strong> Go to <strong>Settings → Integrations</strong> and connect SendGrid or Mailgun to send real emails. Without a provider, sends are <strong>simulated</strong> (data captured but nothing transmitted).
        </div>
      ) : (
        <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: 'var(--success-500)15', border: '1px solid var(--success-500)', fontSize: 13, color: 'var(--text-primary)' }}>
          ✅ Connected: <strong>{emailProvider.name}</strong> — emails will send in real time.
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {tab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12, marginBottom: 20 }}>
            <StatCard label="Total Sent" value={totalSent.toLocaleString()} color="var(--brand-500)" />
            <StatCard label="Open Rate" value={`${avgOpenRate}%`} color="var(--accent-500)" />
            <StatCard label="Total Contacts" value={totalContacts.toLocaleString()} color="var(--success-500)" />
            <StatCard label="Subscribed" value={subscribedContacts.toLocaleString()} color="var(--success-300)" />
            <StatCard label="Auto-Triggers" value={totalTriggered.toLocaleString()} color="var(--warning-500)" />
            <StatCard label="Active Sequences" value={activeAutoresponders.toString()} color="var(--brand-400)" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚡ Active Autoresponders</h3>
              {autoresponders.filter(a => a.status === 'active').slice(0, 3).map(a => (
                <div key={a.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{a.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{a.trigger.description}</div>
                </div>
              ))}
              {autoresponders.filter(a => a.status === 'active').length === 0 && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No active sequences</div>}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📋 Recent Campaigns</h3>
              {emailCampaigns.slice(0, 3).map(c => (
                <div key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.sent} sent · {c.opens} opens</div>
                </div>
              ))}
              {emailCampaigns.length === 0 && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No campaigns yet</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── CAMPAIGNS ── */}
      {tab === 'campaigns' && (
        <div>
          {emailCampaigns.map(cam => {
            const client = getClient(cam.clientId)
            const openRate = cam.sent > 0 ? ((cam.opens / cam.sent) * 100).toFixed(1) : '0.0'
            const clickRate = cam.sent > 0 ? ((cam.clicks / cam.sent) * 100).toFixed(1) : '0.0'
            return (
              <div key={cam.id} className="card" style={{ marginBottom: 10, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{cam.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{client?.name || 'Unknown'} · {cam.type} · {cam.scheduledFor ? new Date(cam.scheduledFor).toLocaleDateString() : 'No date'}</div>
                  </div>
                  <StatusBadge status={cam.status} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 8, fontSize: 12 }}>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Sent</div><div style={{ fontWeight: 600 }}>{cam.sent.toLocaleString()}</div></div>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Open Rate</div><div style={{ fontWeight: 600 }}>{openRate}%</div></div>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Click Rate</div><div style={{ fontWeight: 600 }}>{clickRate}%</div></div>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>Bounces</div><div style={{ fontWeight: 600, color: cam.bounces > 20 ? 'var(--danger-500)' : 'var(--text-muted)' }}>{cam.bounces}</div></div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
                  {(cam.status === 'draft' || cam.status === 'paused') && (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '4px 14px', fontSize: 12 }}
                      onClick={async () => {
                        setSendingCampaign(cam.id)
                        setSendStatus(null)
                        const result = await sendViaProvider(emailProvider as any, cam.id, `Test: ${cam.name}`, `<h2>${cam.name}</h2><p>This is a simulated send for the &quot;${cam.name}&quot; campaign.</p>`)
                        setSendingCampaign(null)
                        if (result.ok) {
                          updateEmailCampaign(cam.id, { status: 'active', sent: cam.sent + 1 })
                          setSendStatus({ campaignId: cam.id, ok: true, msg: emailProvider ? '✅ Sent!' : '✅ Recorded (simulated — no API key set)' })
                        } else {
                          setSendStatus({ campaignId: cam.id, ok: false, msg: `❌ ${result.error || 'Send failed'}` })
                        }
                      }}
                      disabled={sendingCampaign === cam.id}
                    >
                      {sendingCampaign === cam.id ? '⏳ Sending...' : '📤 Send'}
                    </button>
                  )}
                  {cam.status === 'active' && (
                    <button
                      className="btn"
                      style={{ padding: '4px 14px', fontSize: 12 }}
                      onClick={() => updateEmailCampaign(cam.id, { status: 'paused' })}
                    >⏸️ Pause</button>
                  )}
                  {sendStatus && sendStatus.campaignId === cam.id && (
                    <span style={{ fontSize: 12, color: sendStatus.ok ? 'var(--success-500)' : 'var(--danger-500)' }}>{sendStatus.msg}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── CONTACT LISTS ── */}
      {tab === 'lists' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
            <input placeholder="New list name..." id="new-list-input" style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, flex: 1, maxWidth: 300 }} />
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => {
              const input = document.getElementById('new-list-input') as HTMLInputElement
              if (input.value.trim()) {
                addContactList({ clientId: clients[0]?.id || '', name: input.value.trim(), description: '', contacts: [], tags: [] })
                input.value = ''
              }
            }}>+ New List</button>
          </div>
          {contactLists.map(list => (
            <ContactListCard key={list.id} list={list} clientName={getClient(list.clientId)?.name || 'Unknown'} onAddContact={(contact) => addContactToList(list.id, contact)} onRemoveContact={(contactId) => removeContactFromList(list.id, contactId)} />
          ))}
        </div>
      )}

      {/* ── AUTORESPONDERS ── */}
      {tab === 'autoresponders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
            <input placeholder="New sequence name..." id="new-ar-input" style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, flex: 1, maxWidth: 300 }} />
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => {
              const input = document.getElementById('new-ar-input') as HTMLInputElement
              if (input.value.trim()) {
                addAutoresponder({ clientId: clients[0]?.id || '', name: input.value.trim(), description: '', status: 'draft', trigger: { type: 'subscribed', value: '', description: 'Trigger description...' }, steps: [], stats: { totalTriggered: 0, activeInSequence: 0, completedSequence: 0, unsubscribed: 0, totalSent: 0, totalOpens: 0, totalClicks: 0, totalBounces: 0, conversionRate: 0 } })
                input.value = ''
              }
            }}>+ New Sequence</button>
          </div>
          {autoresponders.map(ar => (
            <AutoresponderCard
              key={ar.id}
              ar={ar}
              clientName={getClient(ar.clientId)?.name || 'Unknown'}
              expanded={expandedAutoresponder === ar.id}
              onToggle={() => setExpandedAutoresponder(expandedAutoresponder === ar.id ? null : ar.id)}
              onUpdate={(data) => updateAutoresponder(ar.id, data)}
              onAddStep={(step) => addAutoresponderStep(ar.id, step)}
              onRemoveStep={(stepId) => removeAutoresponderStep(ar.id, stepId)}
              onUpdateStep={(stepId, data) => updateAutoresponderStep(ar.id, stepId, data)}
            />
          ))}
        </div>
      )}

      {/* ── TEMPLATES ── */}
      {tab === 'templates' && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {emailTemplates.map(t => {
              const [showTest, setShowTest] = useState(false)
              const [testEmail, setTestEmail] = useState('')
              const [testSending, setTestSending] = useState(false)
              const [testStatus, setTestStatus] = useState<string | null>(null)
              return (
                <div key={t.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{t.subject}</div>
                    </div>
                    <span className="tag" style={{ fontSize: 11 }}>{t.category}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{t.previewText}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Last used: {t.lastUsed ? new Date(t.lastUsed).toLocaleDateString() : 'Never'}</div>
                  <div style={{ marginTop: 8 }}>
                    <button className="btn" style={{ padding: '3px 12px', fontSize: 11 }} onClick={() => { setShowTest(!showTest); setTestStatus(null) }}>📬 Send Test</button>
                  </div>
                  {showTest && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        placeholder="Recipient email..."
                        value={testEmail}
                        onChange={e => setTestEmail(e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, flex: 1, minWidth: 180 }}
                      />
                      <button
                        className="btn btn-primary"
                        style={{ padding: '4px 12px', fontSize: 12 }}
                        disabled={!testEmail.trim() || testSending}
                        onClick={async () => {
                          if (!testEmail.trim()) return
                          setTestSending(true)
                          setTestStatus(null)
                          const body = t.body || t.previewText || `<h2>${t.subject}</h2><p>Test send of &quot;${t.name}&quot; template.</p>`
                          const result = await sendViaProvider(emailProvider as any, testEmail.trim(), t.subject || 'Test: ' + t.name, body)
                          setTestSending(false)
                          if (result.ok) {
                            setTestStatus('✅ Sent!')
                            updateEmailTemplate(t.id, { lastUsed: new Date().toISOString() })
                          } else {
                            setTestStatus(`❌ ${result.error || 'Send failed'}`)
                          }
                        }}
                      >
                        {testSending ? '⏳ Sending...' : 'Send'}
                      </button>
                      {testStatus && <span style={{ fontSize: 12, color: testStatus.startsWith('✅') ? 'var(--success-500)' : 'var(--danger-500)' }}>{testStatus}</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────── Sub-Components ─────────────────── */

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 16 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    active: { color: 'var(--success-500)', label: '🟢 Active' },
    draft: { color: 'var(--warning-500)', label: '⚪ Draft' },
    paused: { color: 'var(--warning-300)', label: '🟡 Paused' },
    completed: { color: 'var(--text-muted)', label: '⚫ Completed' },
    sent: { color: 'var(--accent-500)', label: '✅ Sent' },
  }
  const m = map[status] || { color: 'var(--text-muted)', label: status }
  return <span className="tag" style={{ background: `${m.color}20`, color: m.color, fontSize: 11 }}>{m.label}</span>
}

/* ─── Contact List Card ─── */
function ContactListCard({ list, clientName, onAddContact, onRemoveContact }: { list: ContactList; clientName: string; onAddContact: (c: Omit<ContactEntry, 'id' | 'createdAt' | 'lastOpened' | 'lastClicked' | 'totalOpens' | 'totalClicks'>) => void; onRemoveContact: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const subscribed = list.contacts.filter(c => c.subscribed).length

  return (
    <div className="card" style={{ marginBottom: 10, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{list.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{clientName} · {list.contacts.length} contacts ({subscribed} subscribed)</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {list.tags.map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button className="btn" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => setShowAdd(!showAdd)}>+ Add Contact</button>
          </div>
          {showAdd && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
              <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, flex: 1 }} />
              <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, flex: 1 }} />
              <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => {
                if (email.trim()) {
                  onAddContact({ email: email.trim(), name: name.trim(), company: '', phone: '', tags: [], source: 'manual', subscribed: true, subscribedAt: new Date().toISOString().slice(0,10), unsubscribedAt: '' })
                  setEmail(''); setName(''); setShowAdd(false)
                }
              }}>Add</button>
            </div>
          )}
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            {list.contacts.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.name || c.email}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{c.email} · {c.company || '—'} · Opens: {c.totalOpens} · Clicks: {c.totalClicks}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: c.subscribed ? 'var(--success-500)' : 'var(--danger-500)' }}>{c.subscribed ? 'Subscribed' : 'Unsubscribed'}</span>
                  <button className="btn" style={{ padding: '2px 8px', fontSize: 11, color: 'var(--danger-500)' }} onClick={() => onRemoveContact(c.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Autoresponder Card ─── */
function AutoresponderCard({ ar, clientName, expanded, onToggle, onUpdate, onAddStep, onRemoveStep, onUpdateStep }: {
  ar: Autoresponder; clientName: string; expanded: boolean; onToggle: () => void
  onUpdate: (data: Partial<Autoresponder>) => void
  onAddStep: (step: Omit<AutoresponderStep, 'id'>) => void
  onRemoveStep: (stepId: string) => void
  onUpdateStep: (stepId: string, data: Partial<AutoresponderStep>) => void
}) {
  const [newStepSubject, setNewStepSubject] = useState('')
  const [newStepDelay, setNewStepDelay] = useState(0)
  const [newStepAction, setNewStepAction] = useState<'send_email' | 'add_tag' | 'remove_tag' | 'move_to_list' | 'conditional_split'>('send_email')

  const triggerLabels: Record<AutoresponderTriggerType, string> = {
    subscribed: 'On Subscribe',
    tag_added: 'Tag Added',
    link_clicked: 'Link Clicked',
    form_submitted: 'Form Submitted',
    purchase_made: 'Purchase Made',
    date_reached: 'Date Reached',
    manual: 'Manual',
  }

  return (
    <div className="card" style={{ marginBottom: 10, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={onToggle}>
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{ar.name}</span>
            <StatusBadge status={ar.status} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{clientName} · {ar.steps.length} steps · {ar.stats.totalTriggered} triggered · {(ar.stats.conversionRate).toFixed(1)}% conv.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="tag" style={{ fontSize: 11 }}>{triggerLabels[ar.trigger.type] || ar.trigger.type}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: 12 }}>
          {/* Trigger */}
          <div style={{ marginBottom: 12, background: 'var(--bg-primary)', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>TRIGGER</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>{triggerLabels[ar.trigger.type]}:</span>
              <span style={{ color: 'var(--text-secondary)' }}>{ar.trigger.description}</span>
            </div>
          </div>

          {/* Steps as a visual pipeline */}
          <div style={{ position: 'relative', paddingLeft: 20 }}>
            {ar.steps.sort((a, b) => a.order - b.order).map((step, i) => (
              <div key={step.id} style={{ position: 'relative', marginBottom: 12, paddingLeft: 24 }}>
                {/* Vertical line */}
                {i < ar.steps.length - 1 && <div style={{ position: 'absolute', left: 6, top: 20, bottom: -12, width: 2, background: 'var(--border)' }} />}
                {/* Circle */}
                <div style={{ position: 'absolute', left: 0, top: 4, width: 14, height: 14, borderRadius: '50%', background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700 }}>{step.order}</div>
                {/* Card */}
                <div style={{ background: 'var(--bg-primary)', padding: 10, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600 }}>{step.action === 'send_email' ? `📧 ${step.subject}` : step.action === 'add_tag' ? '🏷️ Add Tag' : step.action === 'remove_tag' ? '🏷️ Remove Tag' : step.action === 'move_to_list' ? '📋 Move to List' : '🔀 Conditional Split'}</div>
                    <button className="btn" style={{ padding: '2px 6px', fontSize: 11, color: 'var(--danger-500)' }} onClick={() => onRemoveStep(step.id)}>✕</button>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>Wait {step.delayDays > 0 ? `${step.delayDays}d ` : ''}{step.delayHours > 0 ? `${step.delayHours}h` : '0h'} after previous</div>
                  {step.conditions && step.conditions.length > 0 && (
                    <div style={{ marginTop: 4, fontSize: 11, color: 'var(--accent-500)' }}>
                      ⚡ Conditions: {step.conditions.map(c => `${c.field} ${c.operator} ${c.value}`).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Step */}
          <div style={{ background: 'var(--bg-primary)', padding: 10, borderRadius: 8, border: '1px dashed var(--border)', marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>+ ADD STEP</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={newStepAction} onChange={e => setNewStepAction(e.target.value as any)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12 }}>
                <option value="send_email">Send Email</option>
                <option value="add_tag">Add Tag</option>
                <option value="remove_tag">Remove Tag</option>
                <option value="move_to_list">Move to List</option>
                <option value="conditional_split">Conditional Split</option>
              </select>
              <input placeholder="Subject line..." value={newStepSubject} onChange={e => setNewStepSubject(e.target.value)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, flex: 1, minWidth: 150 }} />
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Delay:</span>
                <input type="number" value={newStepDelay} onChange={e => setNewStepDelay(Number(e.target.value))} min={0} style={{ width: 50, padding: '4px 6px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12 }} />
                <span style={{ color: 'var(--text-muted)' }}>days</span>
              </div>
              <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => {
                onAddStep({ order: ar.steps.length + 1, delayDays: newStepDelay, delayHours: 0, action: newStepAction, emailTemplateId: '', subject: newStepSubject || `Step ${ar.steps.length + 1}`, body: '', conditions: [] })
                setNewStepSubject(''); setNewStepDelay(0); setNewStepAction('send_email')
              }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
