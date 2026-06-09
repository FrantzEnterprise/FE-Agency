import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function ClientPortalPage() {
  const { clients, portalInvites, clientApprovals, clientMessages, addPortalInvite, updatePortalInvite, addClientApproval, updateClientApproval, addClientMessage, setPortalViewClientId, portalViewClientId } = useAppStore()
  const [tab, setTab] = useState<'overview' | 'approvals' | 'messages' | 'invites'>('overview')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteClient, setInviteClient] = useState('')
  const [replyText, setReplyText] = useState('')

  const activeInvites = portalInvites.filter(i => i.status === 'active')
  const pendingApprovals = clientApprovals.filter(a => a.status === 'pending')
  const unreadMessages = clientMessages.filter(m => m.authorRole === 'client' && !m.readAt)

  const handleCreateInvite = () => {
    if (!inviteEmail.trim() || !inviteName.trim() || !inviteClient) return
    const token = Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15)
    addPortalInvite({
      clientId: inviteClient,
      token,
      email: inviteEmail.trim(),
      contactName: inviteName.trim(),
      status: 'pending',
      lastAccessedAt: '',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    })
    setInviteEmail('')
    setInviteName('')
    setInviteClient('')
    setShowInvite(false)
  }

  const handleApprove = (id: string) => {
    updateClientApproval(id, { status: 'approved', respondedAt: new Date().toISOString() })
  }
  const handleReject = (id: string) => {
    const notes = prompt('Rejection reason (optional):')
    updateClientApproval(id, { status: 'rejected', respondedAt: new Date().toISOString(), responseNotes: notes || '' })
  }

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown'
  const getInviteUrl = (token: string) => `${window.location.origin}${window.location.pathname}?portal=${token}`

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Client Portal</h2>
          <p className="section-desc">Shareable dashboards, content approvals, and messaging for every client.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInvite(!showInvite)}>
          {showInvite ? 'Cancel' : '+ Invite Client'}
        </button>
      </div>

      {/* Status bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Active Portals</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success-500)' }}>{activeInvites.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Pending Approvals</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--warning-500)' }}>{pendingApprovals.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Unread Messages</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-500)' }}>{unreadMessages.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Clients</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-500)' }}>{clients.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 8, flexWrap: 'wrap' }}>
        {[
          { id: 'overview' as const, label: '📊 Overview' },
          { id: 'approvals' as const, label: `✅ Approvals (${pendingApprovals.length})` },
          { id: 'messages' as const, label: `💬 Messages (${unreadMessages.length})` },
          { id: 'invites' as const, label: `🔗 Invites (${portalInvites.length})` },
        ].map(t => (
          <button key={t.id} className={`btn btn-ghost btn-sm ${tab === t.id ? 'btn-active' : ''}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>New Portal Invite</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Client</label>
              <select className="input" value={inviteClient} onChange={e => setInviteClient(e.target.value)}>
                <option value="">Select...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Contact Name</label>
              <input className="input" value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Jane Smith" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
              <input className="input" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="jane@client.com" />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={handleCreateInvite}
            disabled={!inviteEmail || !inviteName || !inviteClient}>
            Generate Invite Link
          </button>
        </div>
      )}

      {/* ─── OVERVIEW ─── */}
      {tab === 'overview' && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Client Portals</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
            {clients.map(client => {
              const invite = portalInvites.find(i => i.clientId === client.id && i.status === 'active')
              const clientApprovalsList = clientApprovals.filter(a => a.clientId === client.id)
              const pending = clientApprovalsList.filter(a => a.status === 'pending').length
              const msgs = clientMessages.filter(m => m.clientId === client.id)
              const unread = msgs.filter(m => m.authorRole === 'client' && !m.readAt).length

              return (
                <div key={client.id} className="card" style={{ padding: 14, cursor: 'pointer' }}
                  onClick={() => setPortalViewClientId(portalViewClientId === client.id ? null : client.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{client.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{client.industry} · ${client.mrr.toLocaleString()}/mo</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {invite && <span className="tag" style={{ background: 'var(--success-500)20', color: 'var(--success-500)' }}>🟢 Portal</span>}
                      {pending > 0 && <span className="tag" style={{ background: 'var(--warning-500)20', color: 'var(--warning-500)' }}>⏳ {pending}</span>}
                      {unread > 0 && <span className="tag" style={{ background: 'var(--accent-500)20', color: 'var(--accent-500)' }}>💬 {unread}</span>}
                    </div>
                  </div>
                  {portalViewClientId === client.id && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      {/* Quick Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{clientApprovalsList.filter(a => a.status !== 'rejected').length}</div>
                          <div>Approved</div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{msgs.length}</div>
                          <div>Messages</div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{invite ? '🟢 Live' : '🔴 No Portal'}</div>
                          <div>Status</div>
                        </div>
                      </div>

                      {invite && (
                        <div style={{ fontSize: 11, background: 'var(--bg-tertiary)', padding: 8, borderRadius: 6, marginBottom: 10 }}>
                          <strong>Portal URL:</strong>
                          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                            <input className="input" style={{ fontSize: 11, flex: 1 }} readOnly value={getInviteUrl(invite.token)} onClick={e => (e.target as HTMLInputElement).select()} />
                            <button className="btn btn-sm" onClick={() => { navigator.clipboard.writeText(getInviteUrl(invite.token)) }}>Copy</button>
                            <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger-500)' }}
                              onClick={() => updatePortalInvite(invite.id, { status: 'expired' })}>Revoke</button>
                          </div>
                        </div>
                      )}

                      {/* Recent messages */}
                      <div style={{ maxHeight: 200, overflow: 'auto' }}>
                        {msgs.slice(-5).reverse().map(msg => (
                          <div key={msg.id} style={{
                            padding: 8, marginBottom: 6, borderRadius: 6,
                            background: msg.authorRole === 'client' ? 'var(--brand-500)10' : 'var(--bg-tertiary)',
                            borderLeft: `3px solid ${msg.authorRole === 'client' ? 'var(--brand-500)' : 'var(--accent-500)'}`,
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 600 }}>
                              {msg.authorName} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>· {new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>{msg.content.substring(0, 120)}{msg.content.length > 120 ? '...' : ''}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── APPROVALS ─── */}
      {tab === 'approvals' && (
        <div>
          {clientApprovals.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>
              No approval requests yet. When content is ready for client review, it will appear here.
            </p>
          ) : clientApprovals.map(approval => (
            <div key={approval.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{approval.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {getClientName(approval.clientId)} · {approval.type.replace(/_/g, ' ')} · Submitted {new Date(approval.submittedAt).toLocaleDateString()}
                  </div>
                  {approval.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{approval.description}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="tag" style={{
                    background: approval.status === 'pending' ? 'var(--warning-500)20' : approval.status === 'approved' ? 'var(--success-500)20' : 'var(--danger-500)20',
                    color: approval.status === 'pending' ? 'var(--warning-500)' : approval.status === 'approved' ? 'var(--success-500)' : 'var(--danger-500)',
                  }}>
                    {approval.status === 'pending' ? '⏳ Pending' : approval.status === 'approved' ? '✅ Approved' : approval.status === 'revisions' ? '🔄 Revisions' : '❌ Rejected'}
                  </span>
                  {approval.respondedAt && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {new Date(approval.respondedAt).toLocaleDateString()}
                  </div>}
                </div>
              </div>
              {approval.status === 'pending' && (
                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <button className="btn btn-sm btn-primary" onClick={() => handleApprove(approval.id)}>✅ Approve</button>
                  <button className="btn btn-sm" onClick={() => updateClientApproval(approval.id, { status: 'revisions', respondedAt: new Date().toISOString(), responseNotes: prompt('Revision notes:') || '' })}>
                    🔄 Request Revisions
                  </button>
                  <button className="btn btn-sm" style={{ background: 'var(--danger-500)20', color: 'var(--danger-500)' }} onClick={() => handleReject(approval.id)}>
                    ❌ Reject
                  </button>
                </div>
              )}
              {approval.responseNotes && (
                <div style={{ marginTop: 6, padding: 8, background: 'var(--bg-tertiary)', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <strong>Notes:</strong> {approval.responseNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── MESSAGES ─── */}
      {tab === 'messages' && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Client Messages</h3>
          {clientMessages.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>
              No messages yet. Messages from clients will appear here once portals are active.
            </p>
          ) : (
            <div style={{ maxHeight: 500, overflow: 'auto' }}>
              {clientMessages.map(msg => (
                <div key={msg.id} style={{
                  padding: 10, marginBottom: 8, borderRadius: 8,
                  background: msg.authorRole === 'client' ? 'var(--brand-500)10' : 'var(--bg-tertiary)',
                  borderLeft: `3px solid ${msg.authorRole === 'client' ? 'var(--brand-500)' : 'var(--accent-500)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{msg.authorName}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>
                        {msg.authorRole === 'client' ? '👤 Client' : '🏢 Agency'} · {getClientName(msg.clientId)}
                      </span>
                      {!msg.readAt && msg.authorRole === 'client' && (
                        <span className="tag" style={{ background: 'var(--accent-500)20', color: 'var(--accent-500)', fontSize: 10, marginLeft: 6 }}>New</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(msg.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{msg.content}</div>
                  {msg.attachments.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                      📎 {msg.attachments.length} attachment(s)
                    </div>
                  )}
                  {msg.authorRole === 'client' && (
                    <div style={{ marginTop: 6 }}>
                      <textarea className="input" style={{ minHeight: 50, fontSize: 12 }} placeholder="Type a reply..."
                        value={replyText} onChange={e => setReplyText(e.target.value)} />
                      <button className="btn btn-sm btn-primary" style={{ marginTop: 4 }}
                        onClick={() => {
                          if (!replyText.trim()) return
                          addClientMessage({
                            clientId: msg.clientId, authorId: 'agency', authorName: 'Frantz Enterprise',
                            authorRole: 'agency', content: replyText.trim(), attachments: [], readAt: '', threadId: msg.threadId,
                          })
                          updateClientMessage(msg.id, { readAt: new Date().toISOString() })
                          setReplyText('')
                        }}
                        disabled={!replyText.trim()}>Send Reply</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── INVITES ─── */}
      {tab === 'invites' && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Portal Invites</h3>
          {portalInvites.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>
              No invites sent. Click "+ Invite Client" to generate a shareable portal link.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {portalInvites.map(invite => (
                <div key={invite.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{invite.contactName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{invite.email} · {getClientName(invite.clientId)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        Created {new Date(invite.createdAt).toLocaleDateString()} · Expires {new Date(invite.expiresAt).toLocaleDateString()}
                        {invite.lastAccessedAt && ` · Last access ${new Date(invite.lastAccessedAt).toLocaleDateString()}`}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="tag" style={{
                        background: invite.status === 'active' ? 'var(--success-500)20' : invite.status === 'pending' ? 'var(--warning-500)20' : 'var(--text-muted)20',
                        color: invite.status === 'active' ? 'var(--success-500)' : invite.status === 'pending' ? 'var(--warning-500)' : 'var(--text-muted)',
                      }}>
                        {invite.status === 'active' ? 'Active' : invite.status === 'pending' ? 'Pending' : 'Expired'}
                      </span>
                    </div>
                  </div>
                  {invite.status !== 'expired' && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input className="input" style={{ fontSize: 11, flex: 1 }} readOnly value={getInviteUrl(invite.token)} onClick={e => (e.target as HTMLInputElement).select()} />
                      <button className="btn btn-sm" onClick={() => navigator.clipboard.writeText(getInviteUrl(invite.token))}>Copy Link</button>
                      {invite.status === 'active' && (
                        <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger-500)' }}
                          onClick={() => updatePortalInvite(invite.id, { status: 'expired' })}>Revoke</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
