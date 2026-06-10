import { useState } from 'react'
import { Sparkles, X, Loader2 } from 'lucide-react'
import type { ContentPiece } from '../types'

interface Props {
  show: boolean
  onClose: () => void
  onSave: (data: Partial<ContentPiece> & { title: string; type: string; body: string }) => void
}

const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'conversational', label: 'Conversational' },
  { id: 'persuasive', label: 'Persuasive' },
  { id: 'educational', label: 'Educational' },
  { id: 'humorous', label: 'Humorous' },
]

const CONTENT_TYPES = [
  { id: 'blog_post', label: 'Blog Post', icon: '📝' },
  { id: 'video', label: 'Video Script', icon: '🎬' },
  { id: 'social_asset', label: 'Social Post', icon: '📱' },
  { id: 'landing_page', label: 'Landing Page', icon: '🌐' },
  { id: 'whitepaper', label: 'Whitepaper', icon: '📄' },
]

// Simulated AI generation — in production, call an API
function simulateAiContent(topic: string, tone: string, type: string, keywords: string[]): { outline: string; body: string; socialPost: string } {
  const toneMap: Record<string, string> = {
    professional: 'maintain a polished, authoritative tone',
    conversational: 'write in a friendly, approachable voice',
    persuasive: 'use compelling, action-oriented language',
    educational: 'explain concepts clearly and thoroughly',
    humorous: 'inject light humor and relatable moments',
  }

  const typeMap: Record<string, string> = {
    blog_post: 'a 800-1200 word blog article',
    video: 'a 3-5 minute video script with hook, body, and CTA',
    social_asset: 'a short, punchy social media post',
    landing_page: 'a high-converting landing page with headline, benefits, and CTA',
    whitepaper: 'a comprehensive whitepaper with research and analysis',
  }

  const kwTag = keywords.length > 0 ? ` Include these keywords: ${keywords.join(', ')}.` : ''

  return {
    outline: `1. Hook / Opening (${type === 'video' ? 'first 10 seconds' : 'first paragraph'})\n2. Problem statement: why this matters\n3. Solution / core content\n4. Supporting evidence (stats, examples)\n5. Conclusion with CTA`,
    body: `## ${topic}\n\n**Tone:** ${toneMap[tone] || toneMap.professional}\n\n**Format:** ${typeMap[type] || typeMap.blog_post}${kwTag}\n\nThis ${type.replace(/_/g, ' ')} covers "${topic}" for your target audience. The ${tone} approach creates engagement while delivering real value. Focus on practical takeaways the reader can apply immediately. Use short paragraphs, bullet points for key ideas, and end with a clear next step.\n\nGenerated with AI. Review and customize before publishing.`,
    socialPost: `🔥 ${topic}\n\n${keywords.length > 0 ? `Keywords: ${keywords.slice(0, 3).join(', ')}\n\n` : ''}Check out our latest content! 👆\n\n#contentmarketing #${topic.toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
  }
}

export default function AiWriterModal({ show, onClose, onSave }: Props) {
  const [step, setStep] = useState<'prompt' | 'result'>('prompt')
  const [topic, setTopic] = useState('')
  const [type, setType] = useState('blog_post')
  const [tone, setTone] = useState('professional')
  const [targetAudience, setTargetAudience] = useState('')
  const [seoKeywords, setSeoKeywords] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{ outline: string; body: string; socialPost: string } | null>(null)
  const [editedOutline, setEditedOutline] = useState('')
  const [editedBody, setEditedBody] = useState('')
  const [editedSocial, setEditedSocial] = useState('')
  const [title, setTitle] = useState('')

  if (!show) return null

  const handleGenerate = () => {
    if (!topic.trim()) return
    setGenerating(true)
    // Simulate API delay
    setTimeout(() => {
      const kw = seoKeywords.split(',').map(k => k.trim()).filter(Boolean)
      const r = simulateAiContent(topic.trim(), tone, type, kw)
      setResult(r)
      setEditedOutline(r.outline)
      setEditedBody(r.body)
      setEditedSocial(r.socialPost)
      setTitle(topic.trim())
      setStep('result')
      setGenerating(false)
    }, 800)
  }

  const handleSave = () => {
    onSave({
      title,
      type,
      body: editedBody,
      outline: editedOutline,
      socialPost: editedSocial,
      seoKeywords: seoKeywords.split(',').map(k => k.trim()).filter(Boolean),
      tone: tone as any,
      targetAudience,
      generatedWithAi: true,
      wordCount: editedBody.split(/\s+/).filter(Boolean).length,
      status: 'brief',
      assignee: '',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      publishedAt: '',
      url: '',
      scheduledAt: '',
    })
    setStep('prompt')
    setTopic('')
    setSeoKeywords('')
    setTargetAudience('')
    setResult(null)
    onClose()
  }

  const handleClose = () => {
    setStep('prompt')
    setTopic('')
    setSeoKeywords('')
    setTargetAudience('')
    setResult(null)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', padding: 16,
    }} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="card" style={{
        maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto',
        padding: 24, position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} style={{ color: 'var(--brand-500)' }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              {step === 'prompt' ? 'AI Content Writer' : 'Review Generated Content'}
            </h2>
          </div>
          <button onClick={handleClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
        </div>

        {step === 'prompt' && (
          <>
            <div className="form-field">
              <label>Topic / Title <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="e.g. 10 Ways to Improve Your Dental Health"
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div className="form-field">
                <label>Content Type</label>
                <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
                  {CONTENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} style={selectStyle}>
                  {TONES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Target Audience</label>
              <input
                value={targetAudience} onChange={e => setTargetAudience(e.target.value)}
                placeholder="e.g. Small business owners, age 30-55"
                style={inputStyle}
              />
            </div>
            <div className="form-field">
              <label>SEO Keywords (comma-separated)</label>
              <input
                value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)}
                placeholder="dental health, teeth whitening, dentist near me"
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn btn-ghost" onClick={handleClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={!topic.trim() || generating}>
                {generating ? <><Loader2 size={14} className="spinner" /> Generating...</> : <><Sparkles size={14} /> Generate Content</>}
              </button>
            </div>
          </>
        )}

        {step === 'result' && result && (
          <>
            {/* Title */}
            <div className="form-field">
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} style={{ ...inputStyle, fontWeight: 700, fontSize: 15 }} />
            </div>

            {/* Outline */}
            <div className="form-field">
              <label>Outline</label>
              <textarea
                rows={5} value={editedOutline}
                onChange={e => setEditedOutline(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
              />
            </div>

            {/* Body */}
            <div className="form-field">
              <label>Body Content</label>
              <textarea
                rows={10} value={editedBody}
                onChange={e => setEditedBody(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
              />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 2 }}>
                {editedBody.split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {/* Social Post */}
            <div className="form-field">
              <label>Social Media Copy</label>
              <textarea
                rows={3} value={editedSocial}
                onChange={e => setEditedSocial(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 2 }}>
                {editedSocial.length} chars / 280 max for X
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-muted)', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
              <span>🎯 Tone: {tone}</span>
              <span>📋 Type: {type.replace(/_/g, ' ')}</span>
              {seoKeywords && <span>🔑 KW: {seoKeywords}</span>}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn btn-ghost" onClick={() => setStep('prompt')}>Back to Prompt</button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Sparkles size={14} /> Save as Draft
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)',
  fontSize: 13, width: '100%', boxSizing: 'border-box',
}
const selectStyle: React.CSSProperties = {
  padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, width: '100%',
}
