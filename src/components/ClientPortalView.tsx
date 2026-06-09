import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

type Tab = 'dashboard' | 'messages' | 'approvals' | 'deliverables'

export default function ClientPortalView() {
  const { portalInvites, clients, clientApprovals, clientMessages, projects, tasks, contentPieces, socialPosts, creativeAssets, campaigns, addClientMessage, updateClientMessage } = useAppStore()
  const [params, setParams] = useState<{ portal: string }>({ portal: '' })
  const [tab, setTab] = useState<Tab>('dashboard')
  const [msgText, setMsgText] = useState('')
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const token = sp.get('portal') || ''
    setParams({ portal: token })
    if (token) {
      const invite = portalInvites.find(i => i.token === token)
      if (invite && invite.status !== 'expired') {
        useAppStore.getState().updatePortalInvite(invite.id, { lastAccessedAt: new Date().toISOString() })
      }
    }
  }, [])

  const invite = portalInvites.find(i => i.token === params.portal)
  const client = invite ? clients.find(c => c.id === invite.clientId) : null

  if (!params.portal || !invite) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
        background: '#0f172a', color: '#e2e8f0', padding: 40,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔗</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Client Portal</h1>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>
            Please use the invite link your agency provided to access your client portal.
          </p>
        </div>
      </div>
    )
  }

  if (invite.status === 'expired') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
        background: '#0f172a', color: '#e2e8f0', padding: 40,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Link Expired</h1>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>
            This portal link has expired. Contact your agency for a new invite.
          </p>
        </div>
      </div>
    )
  }

  if (!client) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading...</div>

  const clientPendings = clientApprovals.filter(a => a.clientId === client.id && a.status === 'pending')
  const clientAllApprovals = clientApprovals.filter(a => a.clientId === client.id)
  const clientAllMessages = clientMessages.filter(m => m.clientId === client.id)
  const unreadAgency = clientAllMessages.filter(m => m.authorRole === 'agency' && !m.readAt).length
  const clientProjects = projects.filter(p => p.owner === client.id)
  const clientContent = contentPieces.filter(c => c.clientId === client.id)
  const clientSocial = socialPosts.filter(p => p.clientId === client.id)
  const clientAssets = creativeAssets.filter(a => a.clientId === client.id)

  const bg = dark ? '#0f172a' : '#ffffff'
  const text = dark ? '#e2e8f0' : '#0f172a'
  const muted = dark ? '#64748b' : '#94a3b8'
  const cardBg = dark ? '#1e293b' : '#f1f5f9'
  const border = dark ? '#334155' : '#e2e8f0'

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, padding: '0 24px 40px' }}>
      {/* Header */}
      <div style={{
        padding: '16px 0', borderBottom: `1px solid ${border}`, marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, color: muted }}>FRANTZ ENTERPRISE — CLIENT PORTAL</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{client.name}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 12, color: muted, textAlign: 'right' }}>
            <div>Welcome, {invite.contactName}</div>
            <div>{client.industry} · {client.retainerTier} Tier</div>
          </div>
          <button onClick={() => setDark(!dark)} className="btn btn-ghost btn-sm" style={{ fontSize: 16 }}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ background: cardBg, borderRadius: 8, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 11, color: muted }}>Account Health</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>
            {client.health === 'green' ? '🟢' : client.health === 'yellow' ? '🟡' : '🔴'}
          </div>
        </div>
        <div style={{ background: cardBg, borderRadius: 8, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 11, color: muted }}>Monthly Retainer</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: '#22c55e' }}>${client.mrr.toLocaleString()}</div>
        </div>
        <div style={{ background: cardBg, borderRadius: 8, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 11, color: muted }}>Deliverables</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: '#a855f7' }}>{clientContent.length + clientAssets.length + clientSocial.length}</div>
        </div>
        <div style={{ background: cardBg, borderRadius: 8, textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 11, color: muted }}>Since</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: '#3b82f6' }}>{new Date(client.since).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: `1px solid ${border}`, paddingBottom: 8, flexWrap: 'wrap' }}>
        {[
          { id: 'dashboard' as const, label: '📊 Dashboard' },
          { id: 'messages' as const, label: `💬 Messages${unreadAgency > 0 ? ` (${unreadAgency})` : ''}` },
          { id: 'approvals' as const, label: `✅ Approvals${clientPendings.length > 0 ? ` (${clientPendings.length})` : ''}` },
          { id: 'deliverables' as const, label: '📦 Deliverables' },
        ].map(t => (
          <button key={t.id}
            style={{
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: tab === t.id ? '#3b82f6' : 'transparent',
              color: tab === t.id ? '#fff' : muted,
            }}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ─── DASHBOARD ─── */}
      {tab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Projects */}
          <div style={{ background: cardBg, borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Active Projects</h3>
            {clientProjects.length === 0 ? (
              <p style={{ fontSize: 12, color: muted }}>No active projects.</p>
            ) : clientProjects.map(p => (
              <div key={p.id} style={{ padding: '8px 0', borderBottom: `1px solid ${border}`, fontSize: 13 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: muted }}>{p.description.substring(0, 60)}...</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{ background: cardBg, borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Recent Activity</h3>
            {clientAllApprovals.length === 0 && clientAllMessages.length === 0 ? (
              <p style={{ fontSize: 12, color: muted }}>No activity yet. Your agency will post updates here.</p>
            ) : (
              <>
                {clientAllApprovals.slice(0, 4).reverse().map(a => (
                  <div key={a.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{a.title}</span>
                    <span style={{ color: a.status === 'approved' ? '#22c55e' : a.status === 'pending' ? '#eab308' : '#ef4444' }}>
                      {a.status}
                    </span>
                  </div>
                ))}
                {clientAllMessages.slice(0, 3).reverse().map(m => (
                  <div key={m.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: `1px solid ${border}` }}>
                    <strong>{m.authorName}</strong>: {m.content.substring(0, 60)}...
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Content Pipeline */}
          <div style={{ background: cardBg, borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Content Pipeline</h3>
            {clientContent.length === 0 ? (
              <p style={{ fontSize: 12, color: muted }}>No content in pipeline.</p>
            ) : (
              clientContent.slice(0, 5).map(c => (
                <div key={c.id} style={{ padding: '6px 0', borderBottom: `1px solid ${border}`, fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{c.title.substring(0, 35)}</span>
                  <span style={{ color: c.status === 'published' ? '#22c55e' : c.status === 'review' ? '#eab308' : muted }}>
                    {c.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Upcoming */}
          <div style={{ background: cardBg, borderRadius: 8, padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Upcoming</h3>
            {/* Pull from revenue pipeline to show upcoming */}
            {campaigns.filter(c => c.clientId === client.id).slice(0, 5).map(c => (
              <div key={c.id} style={{ padding: '6px 0', borderBottom: `1px solid ${border}`, fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.name}</span>
                <span style={{ color: muted }}>{c.status}</span>
              </div>
            ))}
            {campaigns.filter(c => c.clientId === client.id).length === 0 && (
              <p style={{ fontSize: 12, color: muted }}>No upcoming campaigns.</p>
            )}
          </div>
        </div>
      )}

      {/* ─── MESSAGES ─── */}
      {tab === 'messages' && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ marginBottom: 16 }}>
            {clientAllMessages.length === 0 ? (
              <div style={{ background: cardBg, borderRadius: 8, textAlign: 'center', padding: 24 }}>
                <p style={{ fontSize: 14, color: muted }}>No messages yet. Start a conversation with your agency.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {clientAllMessages.map(msg => (
                  <div key={msg.id} style={{
                    padding: 10, borderRadius: 8, maxWidth: '80%',
                    marginLeft: msg.authorRole === 'client' ? 'auto' : 0,
                    background: msg.authorRole === 'agency' ? '#3b82f610' : '#a855f710',
                    border: `1px solid ${border}`,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: muted }}>
                      {msg.authorName} · {new Date(msg.createdAt).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    {msg.attachments.length > 0 && (
                      <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {msg.attachments.map((att, i) => (
                          <span key={i} style={{ fontSize: 11, color: muted, background: bg, padding: '2px 6px', borderRadius: 4 }}>
                            📎 {att}
                          </span>
                        ))}
                      </div>
                    )}
                    {msg.authorRole === 'agency' && !msg.readAt && (
                      <div style={{ marginTop: 4 }}>
                        <button className="btn btn-xs btn-ghost" style={{ fontSize: 11, color: '#3b82f6' }}
                          onClick={() => updateClientMessage(msg.id, { readAt: new Date().toISOString() })}>
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <textarea className="input" style={{
            minHeight: 80, resize: 'vertical', width: '100%', background: cardBg, color: text,
            border: `1px solid ${border}`, padding: 10, borderRadius: 8, fontSize: 13,
          }}
            placeholder="Send a message to your agency..."
            value={msgText} onChange={e => setMsgText(e.target.value)} />
          <button className="btn btn-primary" style={{ marginTop: 8 }}
            onClick={() => {
              if (!msgText.trim()) return
              addClientMessage({
                clientId: client.id, authorId: invite.id, authorName: invite.contactName,
                authorRole: 'client', content: msgText.trim(), attachments: [], readAt: '', threadId: 'general',
              })
              setMsgText('')
            }}
            disabled={!msgText.trim()}>
            Send Message
          </button>
        </div>
      )}

      {/* ─── APPROVALS ─── */}
      {tab === 'approvals' && (
        <div style={{ maxWidth: 700 }}>
          {clientPendings.length > 0 && (
            <>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#eab308' }}>
                ⏳ Items Awaiting Your Review ({clientPendings.length})
              </h3>
              {clientPendings.map(a => (
                <div key={a.id} style={{
                  background: cardBg, borderRadius: 8, marginBottom: 10,
                  borderLeft: '4px solid #eab308', padding: 14,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                    {a.type.replace(/_/g, ' ')} · Submitted {new Date(a.submittedAt).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{a.description}</div>
                </div>
              ))}
              <p style={{ fontSize: 12, color: muted, marginBottom: 16 }}>
                Your agency will receive your decision. Contact them via Messages for any questions.
              </p>
            </>
          )}

          {/* History */}
          {clientAllApprovals.filter(a => a.status !== 'pending').length > 0 && (
            <>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Decision History</h3>
              {clientAllApprovals.filter(a => a.status !== 'pending').map(a => (
                <div key={a.id} style={{
                  background: cardBg, borderRadius: 8, marginBottom: 6, opacity: 0.8, padding: 12,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: muted }}>{new Date(a.respondedAt).toLocaleDateString()}</div>
                    </div>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: a.status === 'approved' ? '#22c55e20' : a.status === 'revisions' ? '#eab30820' : '#ef444420',
                      color: a.status === 'approved' ? '#22c55e' : a.status === 'revisions' ? '#eab308' : '#ef4444',
                    }}>
                      {a.status === 'approved' ? '✅ Approved' : a.status === 'revisions' ? '🔄 Revisions' : '❌ Rejected'}
                    </span>
                  </div>
                  {a.responseNotes && <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>{a.responseNotes}</div>}
                </div>
              ))}
            </>
          )}

          {clientAllApprovals.length === 0 && (
            <div style={{ background: cardBg, borderRadius: 8, textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No Pending Approvals</p>
              <p style={{ fontSize: 13, color: muted }}>
                Your agency will submit content and deliverables here for your review.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── DELIVERABLES ─── */}
      {tab === 'deliverables' && (
        <div>
          {clientContent.length === 0 && clientSocial.length === 0 && clientAssets.length === 0 ? (
            <div style={{ background: cardBg, borderRadius: 8, textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No Deliverables Yet</p>
              <p style={{ fontSize: 13, color: muted }}>
                Your agency's work will appear here once published.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {/* Content Pieces */}
              {clientContent.map(c => (
                <div key={c.id} style={{ background: cardBg, borderRadius: 8, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{c.title}</div>
                    <span style={{
                      padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: c.status === 'published' ? '#22c55e20' : c.status === 'review' ? '#eab30820' : '#64748b20',
                      color: c.status === 'published' ? '#22c55e' : c.status === 'review' ? '#eab308' : muted,
                    }}>{c.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>{c.type} · {new Date(c.dueDate).toLocaleDateString()}</div>
                  <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.4, color: text, opacity: 0.9 }}>
                    {c.title}
                  </div>
                </div>
              ))}
              {/* Social Posts */}
              {clientSocial.map(p => (
                <div key={p.id} style={{ background: cardBg, borderRadius: 8, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Social Post</div>
                    <span style={{
                      padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: p.status === 'posted' ? '#22c55e20' : '#64748b20',
                      color: p.status === 'posted' ? '#22c55e' : muted,
                    }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>{p.platform}</div>
                  <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.4, color: text, opacity: 0.9 }}>
                    {p.content.substring(0, 120)}...
                  </div>
                  {p.status === 'posted' && p.likes > 0 && (
                    <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>♥ {p.likes} · 💬 {p.comments}</div>
                  )}
                </div>
              ))}
              {/* Creative Assets */}
              {clientAssets.map(a => (
                <div key={a.id} style={{ background: cardBg, borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>🎨 {a.type.replace(/-/g, ' ')}</div>
                  <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>v{a.version} · {new Date(a.createdAt).toLocaleDateString()}</div>
                  <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.4, color: text, opacity: 0.9 }}>{a.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
