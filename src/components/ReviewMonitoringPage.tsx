import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const PLATFORMS: { value: string; label: string; icon: string }[] = [
  { value: 'google_business', label: 'Google Business', icon: '🔎' },
  { value: 'yelp', label: 'Yelp', icon: '💛' },
  { value: 'facebook', label: 'Facebook', icon: '👍' },
  { value: 'amazon', label: 'Amazon', icon: '📦' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'g2', label: 'G2', icon: '⭐' },
  { value: 'capterra', label: 'Capterra', icon: '📋' },
  { value: 'trustpilot', label: 'Trustpilot', icon: '🌐' },
  { value: 'manual', label: 'Manual Entry', icon: '✏️' },
]

const PLATFORM_COLORS: Record<string, string> = {
  google_business: '#4285F4',
  yelp: '#D32323',
  facebook: '#1877F2',
  amazon: '#FF9900',
  linkedin: '#0A66C2',
  g2: '#FF492C',
  capterra: '#1AB394',
  trustpilot: '#00B67A',
  manual: '#64748b',
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return 'var(--success-500)'
    case 'negative': return 'var(--danger-500)'
    default: return 'var(--warning-500)'
  }
}

export default function ReviewMonitoringPage() {
  const { clients, reviews, addReview, updateReview } = useAppStore()
  const [tab, setTab] = useState<'all' | 'flagged' | 'needs_response' | 'history'>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [filterClient, setFilterClient] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('')
  const [responseText, setResponseText] = useState('')
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    clientId: '',
    platform: 'google_business' as string,
    reviewerName: '',
    rating: 5,
    title: '',
    content: '',
    url: '',
    publishedAt: new Date().toISOString().slice(0, 10),
    sentiment: 'positive' as 'positive' | 'neutral' | 'negative',
  })

  const newReviews = reviews.filter(r => r.status === 'new')
  const negativeReviews = reviews.filter(r => r.sentiment === 'negative' || r.rating <= 3)
  const pendingResponse = reviews.filter(r => r.status !== 'responded' && (r.sentiment === 'negative' || r.rating <= 3))

  const filteredReviews = reviews.filter(r => {
    if (tab === 'flagged') return r.status === 'flagged'
    if (tab === 'needs_response') return r.status !== 'responded' && (r.sentiment === 'negative' || r.rating <= 3)
    if (filterClient && r.clientId !== filterClient) return false
    if (filterPlatform && r.platform !== filterPlatform) return false
    return true
  })

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown'

  const handleAddReview = () => {
    if (!formData.clientId || !formData.reviewerName || !formData.content) return
    addReview({
      clientId: formData.clientId,
      platform: formData.platform as any,
      reviewerName: formData.reviewerName,
      rating: formData.rating,
      title: formData.title,
      content: formData.content,
      url: formData.url,
      publishedAt: formData.publishedAt,
      status: 'new',
      respondedAt: '',
      response: '',
      sentiment: formData.sentiment as any,
    })
    setFormData({
      clientId: '', platform: 'google_business', reviewerName: '', rating: 5,
      title: '', content: '', url: '', publishedAt: new Date().toISOString().slice(0, 10),
      sentiment: 'positive',
    })
    setShowAdd(false)
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Review Monitoring</h2>
          <p className="section-desc">Track reviews across platforms per client — detect issues, draft responses, send for approval.</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? 'Cancel' : '+ Add Review'}
          </button>
        </div>
      </div>

      {/* Alert bar */}
      {pendingResponse.length > 0 && (
        <div style={{
          padding: '10px 14px', marginBottom: 12, borderRadius: 8,
          background: 'var(--danger-500)15', borderLeft: '4px solid var(--danger-500)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 13 }}>⚠️ {pendingResponse.length} negative review{pendingResponse.length !== 1 ? 's' : ''} need{pendingResponse.length === 1 ? 's' : ''} a response</span>
            <span style={{ fontSize: 12, marginLeft: 8, color: 'var(--text-muted)' }}>
              {newReviews.length} new · {negativeReviews.length} total flagged
            </span>
          </div>
          <button className="btn btn-sm" onClick={() => setTab('needs_response')}>View All</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 14 }}>
        <div className="card" style={{ textAlign: 'center', padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Reviews</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{reviews.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>New</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-500)' }}>{newReviews.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Negative</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--danger-500)' }}>{negativeReviews.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Need Response</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--warning-500)' }}>{pendingResponse.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Avg Rating</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success-500)' }}>
            {reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'}
          </div>
        </div>
      </div>

      {/* Add review form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 12, padding: 16, borderLeft: '4px solid var(--brand-500)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Add Review Entry</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>Client</label>
              <select className="input" style={{ fontSize: 12 }} value={formData.clientId}
                onChange={e => setFormData(f => ({ ...f, clientId: e.target.value }))}>
                <option value="">Select...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>Platform</label>
              <select className="input" style={{ fontSize: 12 }} value={formData.platform}
                onChange={e => setFormData(f => ({ ...f, platform: e.target.value }))}>
                {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.icon} {p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>Reviewer Name</label>
              <input className="input" style={{ fontSize: 12 }} value={formData.reviewerName}
                onChange={e => setFormData(f => ({ ...f, reviewerName: e.target.value }))} placeholder="Jane Smith" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>Rating (1-5)</label>
              <input className="input" style={{ fontSize: 12 }} type="number" min={1} max={5} value={formData.rating}
                onChange={e => setFormData(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>Sentiment</label>
              <select className="input" style={{ fontSize: 12 }} value={formData.sentiment}
                onChange={e => setFormData(f => ({ ...f, sentiment: e.target.value as any }))}>
                <option value="positive">😊 Positive</option>
                <option value="neutral">😐 Neutral</option>
                <option value="negative">😠 Negative</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>Date</label>
              <input className="input" style={{ fontSize: 12 }} type="date" value={formData.publishedAt}
                onChange={e => setFormData(f => ({ ...f, publishedAt: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>Review Title</label>
              <input className="input" style={{ fontSize: 12 }} value={formData.title}
                onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} placeholder="Great service!" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>URL</label>
              <input className="input" style={{ fontSize: 12 }} value={formData.url}
                onChange={e => setFormData(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 3 }}>Review Content</label>
            <textarea className="input" style={{ minHeight: 60, fontSize: 12 }} value={formData.content}
              onChange={e => setFormData(f => ({ ...f, content: e.target.value }))} placeholder="Full review text..." />
          </div>
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={handleAddReview}
            disabled={!formData.clientId || !formData.reviewerName || !formData.content}>
            Save Review
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 8, flexWrap: 'wrap' }}>
        {[
          { id: 'all' as const, label: `📋 All Reviews (${reviews.length})` },
          ...(negativeReviews.length > 0 ? [{ id: 'needs_response' as const, label: `⚠️ Needs Response (${pendingResponse.length})` }] : []),
          { id: 'flagged' as const, label: `🚩 Flagged (${reviews.filter(r => r.status === 'flagged').length})` },
          { id: 'history' as const, label: '📜 Review History' },
        ].filter(Boolean).map(t => (
          <button key={t.id} className={`btn btn-ghost btn-sm ${tab === t.id ? 'btn-active' : ''}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Filters */}
      {tab !== 'flagged' && tab !== 'needs_response' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <select className="input" style={{ fontSize: 12, width: 180 }} value={filterClient}
            onChange={e => setFilterClient(e.target.value)}>
            <option value="">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="input" style={{ fontSize: 12, width: 160 }} value={filterPlatform}
            onChange={e => setFilterPlatform(e.target.value)}>
            <option value="">All Platforms</option>
            {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.icon} {p.label}</option>)}
          </select>
        </div>
      )}

      {/* Review cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredReviews.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No Reviews Found</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {reviews.length === 0 ? 'Start tracking by clicking "+ Add Review" above.' : 'No reviews match the current filter.'}
            </p>
          </div>
        ) : filteredReviews.map(review => {
          const platformMeta = PLATFORMS.find(p => p.value === review.platform)
          return (
            <div key={review.id} className="card" style={{
              padding: 14,
              borderLeft: `4px solid ${PLATFORM_COLORS[review.platform] || 'var(--border)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="tag" style={{ background: `${PLATFORM_COLORS[review.platform]}20`, color: PLATFORM_COLORS[review.platform], fontSize: 11 }}>
                      {platformMeta?.icon} {platformMeta?.label || review.platform}
                    </span>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ fontSize: 14, color: i < review.rating ? '#eab308' : 'var(--text-muted)' }}>
                        ★
                      </span>
                    ))}
                    <span style={{ fontSize: 12, fontWeight: 700, marginLeft: 4 }}>
                      {review.rating}/5
                    </span>
                    <span className="tag" style={{
                      background: `${getSentimentColor(review.sentiment)}15`,
                      color: getSentimentColor(review.sentiment), fontSize: 10,
                    }}>
                      {review.sentiment === 'positive' ? '😊' : review.sentiment === 'negative' ? '😠' : '😐'} {review.sentiment}
                    </span>
                    {review.status === 'new' && (
                      <span className="tag" style={{ background: 'var(--accent-500)20', color: 'var(--accent-500)', fontSize: 10 }}>🆕 New</span>
                    )}
                    {review.status === 'flagged' && (
                      <span className="tag" style={{ background: 'var(--danger-500)20', color: 'var(--danger-500)', fontSize: 10 }}>🚩 Flagged</span>
                    )}
                  </div>

                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{getClientName(review.clientId)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {review.reviewerName} · {new Date(review.publishedAt).toLocaleDateString()}
                      {review.detectedAt && ` · Detected ${new Date(review.detectedAt).toLocaleDateString()}`}
                    </div>
                  </div>

                  {review.title && <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>"{review.title}"</div>}
                  <div style={{
                    fontSize: 13, marginTop: 4, lineHeight: 1.5, padding: 8,
                    background: 'var(--bg-tertiary)', borderRadius: 6, whiteSpace: 'pre-wrap',
                  }}>
                    {review.content}
                  </div>

                  {review.url && (
                    <a href={review.url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 12, color: 'var(--accent-500)', marginTop: 6, display: 'inline-block',
                    }}>
                      🔗 View Original Review
                    </a>
                  )}

                  {/* Existing response */}
                  {review.response && (
                    <div style={{ marginTop: 8, padding: 8, background: 'var(--success-500)08', borderRadius: 6, borderLeft: '3px solid var(--success-500)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--success-500)' }}>✅ Response Posted</div>
                      <div style={{ fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>{review.response}</div>
                      {review.respondedAt && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          {new Date(review.respondedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 12 }}>
                  <button className="btn btn-xs btn-ghost"
                    onClick={() => updateReview(review.id, { status: review.status === 'flagged' ? 'reviewed' : 'flagged' })}>
                    {review.status === 'flagged' ? 'Unflag' : '🚩 Flag'}
                  </button>
                  <button className="btn btn-xs" onClick={() => updateReview(review.id, { status: 'reviewed' })}>
                    Mark Reviewed
                  </button>
                </div>
              </div>

              {/* Response form */}
              {!review.response && (
                <div style={{ marginTop: 8 }}>
                  {respondingTo === review.id ? (
                    <div style={{ background: 'var(--bg-tertiary)', padding: 8, borderRadius: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                        Draft Response
                      </label>
                      <textarea className="input" style={{ minHeight: 60, fontSize: 12, resize: 'vertical' }}
                        value={responseText} onChange={e => setResponseText(e.target.value)}
                        placeholder="Write a response to this review..." />
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        <button className="btn btn-sm btn-primary"
                          onClick={() => {
                            if (!responseText.trim()) return
                            updateReview(review.id, {
                              response: responseText.trim(),
                              respondedAt: new Date().toISOString(),
                              status: 'responded',
                            })
                            setResponseText('')
                            setRespondingTo(null)
                          }}
                          disabled={!responseText.trim()}>
                          Post Response
                        </button>
                        <button className="btn btn-sm btn-ghost"
                          onClick={() => {
                            // Submit for client portal approval instead
                            useAppStore.getState().addClientApproval({
                              clientId: review.clientId,
                              type: 'content_draft',
                              title: `Review Response — ${getClientName(review.clientId)} (${platformMeta?.label || review.platform})`,
                              description: `Draft response to ${review.reviewerName}'s ${review.rating}/5 review:\n\n${responseText || 'No draft yet'}\n\nOriginal review: "${review.content.substring(0, 100)}${review.content.length > 100 ? '...' : ''}"`,
                              status: 'pending',
                              respondedAt: '',
                              responseNotes: '',
                              relatedId: review.id,
                              submittedBy: 'Review Monitoring',
                            })
                            setResponseText('')
                            setRespondingTo(null)
                          }}>
                          Send for Client Approval
                        </button>
                        <button className="btn btn-xs btn-ghost" onClick={() => { setRespondingTo(null); setResponseText('') }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn btn-sm" onClick={() => setRespondingTo(review.id)}>
                      ✍️ Draft Response
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* History tab: trend data */}
      {tab === 'history' && (
        <div className="card" style={{ marginTop: 12, padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Review Trends</h3>
          {reviews.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No review data to analyze yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* By client */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>By Client</h4>
                {clients.filter(c => reviews.some(r => r.clientId === c.id)).map(client => {
                  const clientReviews = reviews.filter(r => r.clientId === client.id)
                  const avg = clientReviews.reduce((s, r) => s + r.rating, 0) / clientReviews.length
                  const negatives = clientReviews.filter(r => r.rating <= 3).length
                  return (
                    <div key={client.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12, borderBottom: '1px solid var(--border)' }}>
                      <span>{client.name}</span>
                      <span>
                        <span style={{ color: 'var(--success-500)' }}>{avg.toFixed(1)}★</span>
                        {negatives > 0 && <span style={{ color: 'var(--danger-500)', marginLeft: 6 }}>{negatives} negative</span>}
                        <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>{clientReviews.length} reviews</span>
                      </span>
                    </div>
                  )
                })}
              </div>
              {/* By platform */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>By Platform</h4>
                {PLATFORMS.filter(p => reviews.some(r => r.platform === p.value)).map(p => {
                  const pReviews = reviews.filter(r => r.platform === p.value)
                  const avg = pReviews.reduce((s, r) => s + r.rating, 0) / pReviews.length
                  return (
                    <div key={p.value} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12, borderBottom: '1px solid var(--border)' }}>
                      <span>{p.icon} {p.label}</span>
                      <span>
                        <span style={{ color: 'var(--success-500)' }}>{avg.toFixed(1)}★</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>{pReviews.length} reviews</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
