import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function ClientPortalPage() {
  const { clients, portalInvites, clientApprovals, clientMessages, projects, tasks, contentPieces, socialPosts, creativeAssets, campaigns, pipeline, addPortalInvite, updatePortalInvite, addClientApproval, updateClientApproval, addClientMessage, setPortalViewClientId, portalViewClientId } = useAppStore()
  const [tab, setTab] = useState<'overview' | 'approvals' | 'messages' | 'invites'>('overview')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteClient, setInviteClient] = useState('')
  const [replyText, setReplyText] = useState('')
  const [revisionNotes, setRevisionNotes] = useState('')
  const [rejectNotes, setRejectNotes] = useState('')
  const [activeAction, setActiveAction] = useState<string | null>(null)

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
      status: 'active',
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
  const handleRevisions = (id: string) => {
    updateClientApproval(id, { status: 'revisions', respondedAt: new Date().toISOString(), responseNotes: revisionNotes })
    setRevisionNotes('')
    setActiveAction(null)
  }
  const handleReject = (id: string) => {
    updateClientApproval(id, { status: 'rejected', respondedAt: new Date().toISOString(), responseNotes: rejectNotes })
    setRejectNotes('')
    setActiveAction(null)
  }

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown'
  const getClientColor = (id: string) => {
    const idx = clients.findIndex(c => c.id === id)
    const colors = ['var(--brand-500)', 'var(--success-500)', 'var(--accent-500)', 'var(--warning-500)', 'var(--danger-500)']
    return colors[idx % colors.length]
  }
  const getInviteUrl = (token: string) => `${window.location.origin}${window.location.pathname}?portal=${token}`

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Client Portal</h2>
          <p className="section-desc">Shareable dashboards, content approvals, messaging & file sharing for every client.</p>
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
          {pendingApprovals.length > 0 && <div style={{ fontSize: 10, color: 'var(--warning-500)' }}>Needs your action</div>}
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
          { id: 'approvals' as const, label: `✅ Approvals ${pendingApprovals.length > 0 ? `(${pendingApprovals.length})` : ''}` },
          { id: 'messages' as const, label: `💬 Messages ${unreadMessages.length > 0 ? `(${unreadMessages.length})` : ''}` },
          { id: 'invites' as const, label: '🔗 Invites' },
        ].map(t => (
          <button key={t.id} className={`btn btn-ghost btn-sm ${tab === t.id ? 'btn-active' : ''}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="card" style={{ marginBottom: 16, padding: 16, borderLeft: '4px solid var(--brand-500)' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 10 }}>
            {clients.map(client => {
              const invite = portalInvites.find(i => i.clientId === client.id && i.status === 'active')
              const clientApprovalsList = clientApprovals.filter(a => a.clientId === client.id)
              const pending = clientApprovalsList.filter(a => a.status === 'pending').length
              const msgs = clientMessages.filter(m => m.clientId === client.id)
              const unread = msgs.filter(m => m.authorRole === 'client' && !m.readAt).length
              const clientProjects = projects.filter(p => p.owner === client.id)
              const clientContent = contentPieces.filter(c => c.clientId === client.id)
              const clientPosts = socialPosts.filter(p => p.clientId === client.id)

              return (
                <div key={client.id} className="card" style={{
                  padding: 14, cursor: 'pointer',
                  borderLeft: `4px solid ${getClientColor(client.id)}`,
                }}
                  onClick={() => setPortalViewClientId(portalViewClientId === client.id ? null : client.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{client.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{client.industry} · ${client.mrr.toLocaleString()}/mo · {client.retainerTier} Tier</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {invite && <span className="tag" style={{ background: 'var(--success-500)20', color: 'var(--success-500)' }}>🟢 Portal</span>}
                      {!invite && <span className="tag" style={{ background: 'var(--text-muted)20', color: 'var(--text-muted)' }}>No Portal</span>}
                      {pending > 0 && <span className="tag" style={{ background: 'var(--warning-500)20', color: 'var(--warning-500)' }}>⏳ {pending}</span>}
                      {unread > 0 && <span className="tag" style={{ background: 'var(--accent-500)20', color: 'var(--accent-500)' }}>💬 {unread}</span>}
                    </div>
                  </div>

                  {/* Quick metric pills */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>{clientProjects.length} projects</span>
                    <span>{clientContent.length} content pieces</span>
                    <span>{clientPosts.length} social posts</span>
                  </div>

                  {portalViewClientId === client.id && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      {/* Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success-500)' }}>{clientApprovalsList.filter(a => a.status === 'approved').length}</div>
                          <div>Approved</div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--warning-500)' }}>{pending}</div>
                          <div>Pending</div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{msgs.length}</div>
                          <div>Messages</div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-500)' }}>{clientContent.length + clientPosts.length}</div>
                          <div>Deliverables</div>
                        </div>
                      </div>

                      {invite && (
                        <div style={{ fontSize: 11, background: 'var(--bg-tertiary)', padding: 8, borderRadius: 6, marginBottom: 10 }}>
                          <strong>Portal URL:</strong>
                          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                            <input className="input" style={{ fontSize: 11, flex: 1 }} readOnly value={getInviteUrl(invite.token)} onClick={e => (e.target as HTMLInputElement).select()} />
                            <button className="btn btn-sm" onClick={() => navigator.clipboard.writeText(getInviteUrl(invite.token))}>Copy</button>
                            <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger-500)' }}
                              onClick={() => updatePortalInvite(invite.id, { status: 'expired' })}>Revoke</button>
                            <button className="btn btn-sm btn-ghost" onClick={() => window.open(getInviteUrl(invite.token), '_blank')}>Open</button>
                          </div>
                        </div>
                      )}

                      {/* Recent messages */}
                      {msgs.length > 0 && (
                        <div style={{ maxHeight: 160, overflow: 'auto', marginBottom: 8 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Recent Messages</div>
                          {msgs.slice(-3).reverse().map(msg => (
                            <div key={msg.id} style={{
                              padding: 6, marginBottom: 4, borderRadius: 4,
                              background: msg.authorRole === 'client' ? 'var(--brand-500)08' : 'var(--bg-tertiary)',
                              borderLeft: `3px solid ${msg.authorRole === 'client' ? 'var(--brand-500)' : 'var(--accent-500)'}`,
                            }}>
                              <div style={{ fontSize: 10, fontWeight: 600 }}>
                                {msg.authorName} · {new Date(msg.createdAt).toLocaleDateString()}
                                {!msg.readAt && msg.authorRole === 'client' && <span style={{ color: 'var(--accent-500)', marginLeft: 4 }}>●</span>}
                              </div>
                              <div style={{ fontSize: 11, marginTop: 1, lineHeight: 1.4 }}>{msg.content.substring(0, 100)}{msg.content.length > 100 ? '...' : ''}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Send quick message from overview */}
                      <textarea className="input" style={{ minHeight: 40, fontSize: 11, resize: 'vertical' }}
                        placeholder="Quick message to client..."
                        value={replyText} onChange={e => setReplyText(e.target.value)} />
                      <button className="btn btn-sm btn-primary" style={{ marginTop: 4 }}
                        onClick={() => {
                          if (!replyText.trim()) return
                          addClientMessage({
                            clientId: client.id, authorId: 'agency', authorName: 'Frantz Enterprise',
                            authorRole: 'agency', content: replyText.trim(), attachments: [], readAt: '', threadId: 'general',
                          })
                          setReplyText('')
                        }}
                        disabled={!replyText.trim()}>Send</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Send approval for any client */}
          <div className="card" style={{ marginTop: 16, padding: 16, borderLeft: '4px solid var(--accent-500)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Submit Content for Client Approval</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
              <select className="input" id="approval-client" style={{ fontSize: 12 }}
                onChange={e => {
                  const sel = e.target.value
                  if (sel) {
                    const title = prompt('Approval title:') || 'Content for review'
                    const desc = prompt('Description:') || ''
                    addClientApproval({
                      clientId: sel, type: 'content_draft', title, description: desc,
                      status: 'pending', respondedAt: '', responseNotes: '', relatedId: '', submittedBy: 'Agency',
                    })
                    e.target.value = ''
                  }
                }}>
                <option value="">Request approval from...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                Select a client to create a new approval request visible in their portal
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── APPROVALS ─── */}
      {tab === 'approvals' && (
        <div>
          {clientApprovals.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No Approval Requests</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Submit content, creative assets, or social posts for client approval from the Overview tab.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Group: Pending first */}
              {pendingApprovals.length > 0 && (
                <>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--warning-500)' }}>⏳ Pending Your Review ({pendingApprovals.length})</h3>
                  {pendingApprovals.map(approval => (
                    <div key={approval.id} className="card" style={{
                      padding: 14, borderLeft: '4px solid var(--warning-500)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{approval.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            {getClientName(approval.clientId)}
                            <span style={{ margin: '0 6px' }}>·</span>
                            {approval.type.replace(/_/g, ' ')}
                            <span style={{ margin: '0 6px' }}>·</span>
                            Submitted {new Date(approval.submittedAt).toLocaleDateString()}
                          </div>
                          {approval.description && (
                            <div style={{
                              marginTop: 6, padding: 8, background: 'var(--bg-tertiary)', borderRadius: 6,
                              fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap',
                            }}>
                              {approval.description}
                            </div>
                          )}
                        </div>
                      </div>

                      {activeAction === approval.id && (
                        <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-tertiary)', borderRadius: 6 }}>
                          {activeAction === `revisions-${approval.id}` && (
                            <div>
                              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Revision Notes</label>
                              <textarea className="input" style={{ minHeight: 60, fontSize: 12 }} value={revisionNotes}
                                onChange={e => setRevisionNotes(e.target.value)} placeholder="What needs to change?" />
                              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                <button className="btn btn-sm" onClick={() => handleRevisions(approval.id)} disabled={!revisionNotes.trim()}>Send Revisions</button>
                                <button className="btn btn-sm btn-ghost" onClick={() => { setActiveAction(null); setRevisionNotes('') }}>Cancel</button>
                              </div>
                            </div>
                          )}
                          {activeAction === `reject-${approval.id}` && (
                            <div>
                              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Reason for Rejection</label>
                              <textarea className="input" style={{ minHeight: 60, fontSize: 12 }} value={rejectNotes}
                                onChange={e => setRejectNotes(e.target.value)} placeholder="Why is this being rejected?" />
                              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                <button className="btn btn-sm" style={{ background: 'var(--danger-500)20', color: 'var(--danger-500)' }}
                                  onClick={() => handleReject(approval.id)} disabled={!rejectNotes.trim()}>Confirm Reject</button>
                                <button className="btn btn-sm btn-ghost" onClick={() => { setActiveAction(null); setRejectNotes('') }}>Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button className="btn btn-sm btn-primary" onClick={() => handleApprove(approval.id)}>✅ Approve</button>
                        <button className="btn btn-sm" onClick={() => setActiveAction(activeAction === `revisions-${approval.id}` ? null : `revisions-${approval.id}`)}>
                          🔄 Request Revisions
                        </button>
                        <button className="btn btn-sm" style={{ background: 'var(--danger-500)15', color: 'var(--danger-500)' }}
                          onClick={() => setActiveAction(activeAction === `reject-${approval.id}` ? null : `reject-${approval.id}`)}>
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* History */}
              {clientApprovals.filter(a => a.status !== 'pending').length > 0 && (
                <>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginTop: 8 }}>History</h3>
                  {clientApprovals.filter(a => a.status !== 'pending').map(a => (
                    <div key={a.id} className="card" style={{ opacity: 0.8, padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {getClientName(a.clientId)} · {new Date(a.respondedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span className="tag" style={{
                          background: a.status === 'approved' ? 'var(--success-500)20' : a.status === 'revisions' ? 'var(--warning-500)20' : 'var(--danger-500)20',
                          color: a.status === 'approved' ? 'var(--success-500)' : a.status === 'revisions' ? 'var(--warning-500)' : 'var(--danger-500)',
                        }}>
                          {a.status === 'approved' ? '✅ Approved' : a.status === 'revisions' ? '🔄 Revisions' : '❌ Rejected'}
                        </span>
                      </div>
                      {a.responseNotes && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{a.responseNotes}</div>}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── MESSAGES ─── */}
      {tab === 'messages' && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Client Messages</h3>
          {clientMessages.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No Messages Yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Messages from clients with active portals will appear here.
              </p>
            </div>
          ) : (
            <div style={{ maxHeight: 500, overflow: 'auto' }}>
              {clientMessages.map(msg => (
                <div key={msg.id} style={{
                  padding: 10, marginBottom: 8, borderRadius: 8,
                  background: msg.authorRole === 'client' ? 'var(--brand-500)08' : 'var(--bg-tertiary)',
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
                  <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                  {msg.attachments.length > 0 && (
                    <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {msg.attachments.map((att, i) => (
                        <span key={i} className="tag" style={{ background: 'var(--bg-tertiary)', fontSize: 11, cursor: 'pointer' }}>
                          📎 {att}
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.authorRole === 'client' && (
                    <div style={{ marginTop: 6 }}>
                      <textarea className="input" style={{ minHeight: 40, fontSize: 12, resize: 'vertical' }} placeholder="Reply..."
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
                  {/* Mark as read from agency side */}
                  {!msg.readAt && msg.authorRole === 'client' && (
                    <button className="btn btn-xs btn-ghost" style={{ marginTop: 4 }}
                      onClick={() => updateClientMessage(msg.id, { readAt: new Date().toISOString() })}>Mark read</button>
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
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔗</div>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No Invites Sent</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Click "+ Invite Client" above to generate a shareable portal link for any client.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {portalInvites.map(invite => {
                const client = clients.find(c => c.id === invite.clientId)
                return (
                  <div key={invite.id} className="card" style={{
                    padding: 14,
                    borderLeft: `4px solid ${invite.status === 'active' ? 'var(--success-500)' : invite.status === 'pending' ? 'var(--warning-500)' : 'var(--text-muted)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{invite.contactName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{invite.email}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                          {client?.name || 'Unknown'} · Created {new Date(invite.createdAt).toLocaleDateString()}
                          {invite.lastAccessedAt && ` · Last access ${new Date(invite.lastAccessedAt).toLocaleDateString()}`}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Expires {new Date(invite.expiresAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="tag" style={{
                          background: invite.status === 'active' ? 'var(--success-500)20' : invite.status === 'pending' ? 'var(--warning-500)20' : 'var(--text-muted)20',
                          color: invite.status === 'active' ? 'var(--success-500)' : invite.status === 'pending' ? 'var(--warning-500)' : 'var(--text-muted)',
                        }}>
                          {invite.status === 'active' ? '🟢 Active' : invite.status === 'pending' ? '⏳ Pending' : '🔴 Expired'}
                        </span>
                      </div>
                    </div>
                    {invite.status !== 'expired' && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                        <input className="input" style={{ fontSize: 11, flex: 1, minWidth: 200 }} readOnly value={getInviteUrl(invite.token)} onClick={e => (e.target as HTMLInputElement).select()} />
                        <button className="btn btn-sm" onClick={() => navigator.clipboard.writeText(getInviteUrl(invite.token))}>Copy Link</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => window.open(getInviteUrl(invite.token), '_blank')}>Preview</button>
                        {invite.status === 'active' && (
                          <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger-500)' }}
                            onClick={() => updatePortalInvite(invite.id, { status: 'expired' })}>Revoke</button>
                        )}
                        {invite.status === 'pending' && (
                          <button className="btn btn-sm" onClick={() => updatePortalInvite(invite.id, { status: 'active' })}>Activate</button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
