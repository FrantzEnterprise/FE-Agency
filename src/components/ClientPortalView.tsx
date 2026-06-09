import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function ClientPortalView() {
  const { portalInvites, clients, clientApprovals, clientMessages, addClientApproval, addClientMessage, updateClientMessage } = useAppStore()
  const [params, setParams] = useState<{ portal: string }>({ portal: '' })

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
  const [tab, setTab] = useState<'dashboard' | 'messages' | 'approvals'>('dashboard')
  const [msgText, setMsgText] = useState('')

  if (!params.portal || !invite) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
        background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: 40,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔗</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Client Portal</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
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
        background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: 40,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Link Expired</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            This portal link has expired. Contact your agency for a new invite.
          </p>
        </div>
      </div>
    )
  }

  if (!client) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
  }

  const clientPendings = clientApprovals.filter(a => a.clientId === client.id && a.status === 'pending')
  const clientAllApprovals = clientApprovals.filter(a => a.clientId === client.id)
  const clientAllMessages = clientMessages.filter(m => m.clientId === client.id)

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)',
      padding: '0 24px 40px',
    }}>
      {/* Portal header */}
      <div style={{
        padding: '16px 0', borderBottom: '1px solid var(--border)', marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>FRANTZ ENTERPRISE — CLIENT PORTAL</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{client.name}</h1>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
          <div>Welcome, {invite.contactName}</div>
          <div>{client.industry} · {client.retainerTier} Tier</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Health Score</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: client.health === 'green' ? 'var(--success-500)' : client.health === 'yellow' ? 'var(--warning-500)' : 'var(--danger-500)' }}>
            {client.health === 'green' ? '🟢' : client.health === 'yellow' ? '🟡' : '🔴'}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Monthly Retainer</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: 'var(--success-500)' }}>${client.mrr.toLocaleString()}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Since</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: 'var(--brand-500)' }}>
            {new Date(client.since).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        {[
          { id: 'dashboard' as const, label: '📊 Dashboard' },
          { id: 'messages' as const, label: `💬 Messages (${clientAllMessages.filter(m => m.authorRole === 'agency').filter(m => !m.readAt).length})` },
          { id: 'approvals' as const, label: `✅ Approvals (${clientPendings.length})` },
        ].map(t => (
          <button key={t.id} className={`btn btn-ghost btn-sm ${tab === t.id ? 'btn-active' : ''}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ─── CLIENT DASHBOARD ─── */}
      {tab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Recent Activity</h3>
              {clientAllApprovals.slice(0, 5).reverse().map(a => (
                <div key={a.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{a.title}</span>
                  <span style={{ color: a.status === 'approved' ? 'var(--success-500)' : a.status === 'pending' ? 'var(--warning-500)' : 'var(--danger-500)' }}>
                    {a.status}
                  </span>
                </div>
              ))}
              {clientAllApprovals.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No activity yet.</p>
              )}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Messages</h3>
              {clientAllMessages.slice(0, 5).reverse().map(m => (
                <div key={m.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <strong>{m.authorName}</strong>: {m.content.substring(0, 80)}{m.content.length > 80 ? '...' : ''}
                </div>
              ))}
              {clientAllMessages.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No messages yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── CLIENT MESSAGES ─── */}
      {tab === 'messages' && (
        <div>
          <div style={{ maxHeight: 400, overflow: 'auto', marginBottom: 16 }}>
            {clientAllMessages.map(msg => (
              <div key={msg.id} style={{
                padding: 10, marginBottom: 8, borderRadius: 8, maxWidth: '80%',
                marginLeft: msg.authorRole === 'client' ? 'auto' : 0,
                background: msg.authorRole === 'agency' ? 'var(--accent-500)15' : 'var(--brand-500)15',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                  {msg.authorName} · {new Date(msg.createdAt).toLocaleString()}
                </div>
                <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{msg.content}</div>
              </div>
            ))}
            {clientAllMessages.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
                No messages. Start a conversation with your agency.
              </p>
            )}
          </div>

          <textarea className="input" style={{ minHeight: 80, resize: 'vertical' }}
            placeholder="Type your message..."
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
            Send Message to Agency
          </button>
        </div>
      )}

      {/* ─── CLIENT APPROVALS ─── */}
      {tab === 'approvals' && (
        <div>
          {clientPendings.length > 0 && (
            <>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Items Awaiting Your Review</h3>
              {clientPendings.map(a => (
                <div key={a.id} className="card" style={{ marginBottom: 10, borderLeft: '4px solid var(--warning-500)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{a.description}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.type.replace(/_/g, ' ')} · Submitted {new Date(a.submittedAt).toLocaleDateString()}</div>
                </div>
              ))}
            </>
          )}

          {clientAllApprovals.length > 0 && (
            <>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 10px' }}>Decision History</h3>
              {clientAllApprovals.filter(a => a.status !== 'pending').map(a => (
                <div key={a.id} className="card" style={{ marginBottom: 6, opacity: 0.8, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(a.respondedAt).toLocaleDateString()}</div>
                    </div>
                    <span className="tag" style={{
                      background: a.status === 'approved' ? 'var(--success-500)20' : 'var(--danger-500)20',
                      color: a.status === 'approved' ? 'var(--success-500)' : 'var(--danger-500)',
                    }}>
                      {a.status === 'approved' ? '✅ Approved' : a.status === 'revisions' ? '🔄 Revisions' : '❌ Rejected'}
                    </span>
                  </div>
                  {a.responseNotes && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{a.responseNotes}</div>}
                </div>
              ))}
            </>
          )}

          {clientAllApprovals.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>
              No items pending your review. Your agency will notify you when something needs your approval.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
