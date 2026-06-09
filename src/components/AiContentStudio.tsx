import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const contentOptions = [
  { id: 'blog-post', label: 'Blog Post', contentType: 'text' as const, model: 'gpt-4' },
  { id: 'social-caption', label: 'Social Caption', contentType: 'text' as const, model: 'gpt-4' },
  { id: 'email-newsletter', label: 'Email Newsletter', contentType: 'text' as const, model: 'gpt-4' },
  { id: 'ad-copy', label: 'Ad Copy', contentType: 'text' as const, model: 'gpt-4' },
  { id: 'blog-hero-image', label: 'Blog Hero Image', contentType: 'image' as const, model: 'dall-e-3' },
  { id: 'social-graphic', label: 'Social Graphic', contentType: 'image' as const, model: 'dall-e-3' },
  { id: 'ad-banner', label: 'Ad Banner', contentType: 'image' as const, model: 'dall-e-3' },
  { id: 'promo-video', label: 'Promo Video', contentType: 'video' as const, model: 'runway-gen-3' },
  { id: 'product-demo', label: 'Product Demo', contentType: 'video' as const, model: 'runway-gen-3' },
]

export default function AiContentStudio() {
  const { clients, aiJobs, apiConfig, addAiJob, updateAiJob, updateApiConfig } = useAppStore()
  const [selectedClient, setSelectedClient] = useState('')
  const [contentType, setContentType] = useState('blog-post')
  const [prompt, setPrompt] = useState('')
  const [showConfig, setShowConfig] = useState(false)

  const opt = contentOptions.find(o => o.id === contentType)
  const isGenerating = aiJobs.some(j => j.status === 'generating' || j.status === 'pending')

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedClient) return
    if (!apiConfig.baseUrl) { alert('Configure your API endpoint first in Settings') ; return }

    addAiJob({
      contentType: opt?.contentType || 'text',
      prompt: prompt.trim(),
      result: '',
      error: '',
      model: opt?.model || 'gpt-4',
      metadata: { clientId: selectedClient, templateType: contentType },
    })

    updateAiJob(aiJobs[aiJobs.length - 1]?.id || '', { status: 'generating' })

    // Simulate API call — in production this would POST to apiConfig.baseUrl
    const generatedContent = `[Generated ${opt?.contentType}] Based on prompt: "${prompt.substring(0, 60)}..."

This is a placeholder response. When you configure your API endpoint at:
${apiConfig.baseUrl || '<your-api-url>'}

It will return real AI-generated ${opt?.contentType} content.

Features supported:
- Text generation with model: ${apiConfig.textModel}
- Image generation with model: ${apiConfig.imageModel}
- Video generation with model: ${apiConfig.videoModel}`

    updateAiJob(aiJobs[aiJobs.length - 1]?.id || '', { status: 'complete', result: generatedContent, completedAt: new Date().toISOString() })
  }

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard')
  }

  const recentJobs = [...aiJobs].reverse().slice(0, 10)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">AI Content Studio</h2>
          <p className="section-desc">Generate text, images, and video content via your personal API. Configure endpoint in Settings.</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowConfig(!showConfig)}>
          {showConfig ? 'Hide Settings' : 'API Settings'}
        </button>
      </div>

      {showConfig && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>API Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Base URL</label>
              <input className="input" value={apiConfig.baseUrl} onChange={e => updateApiConfig({ baseUrl: e.target.value })} placeholder="https://api.example.com/generate" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>API Key</label>
              <input className="input" type="password" value={apiConfig.apiKey} onChange={e => updateApiConfig({ apiKey: e.target.value })} placeholder="sk-..." />
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

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Client</label>
            <select className="input" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
              <option value="">Select client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Content Type</label>
            <select className="input" value={contentType} onChange={e => setContentType(e.target.value)}>
              {contentOptions.map(o => (
                <option key={o.id} value={o.id}>{o.label} ({o.contentType})</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Prompt</label>
          <textarea className="input" style={{ minHeight: 100, resize: 'vertical' }}
            value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder={opt?.contentType === 'text' ? `Write a blog post about...` : `Describe the ${opt?.contentType} you want to generate...`}
          />
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={!prompt.trim() || !selectedClient || isGenerating}>
            {isGenerating ? 'Generating...' : `Generate ${opt?.contentType === 'text' ? 'Text' : opt?.contentType === 'image' ? 'Image' : 'Video'}`}
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Model: <strong>{opt?.model}</strong>
          </span>
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Recent Generations</h3>
      {recentJobs.map(job => (
        <div key={job.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{job.metadata.templateType?.replace(/-/g, ' ') || job.contentType}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{job.createdAt} · {job.model}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="tag" style={{
                background: job.status === 'complete' ? 'var(--success-500)20' : job.status === 'failed' ? 'var(--danger-500)20' : 'var(--warning-500)20',
                color: job.status === 'complete' ? 'var(--success-500)' : job.status === 'failed' ? 'var(--danger-500)' : 'var(--warning-500)',
              }}>
                {job.status === 'complete' ? '✅ Done' : job.status === 'generating' ? '⚡ Generating' : job.status === 'failed' ? '❌ Failed' : '⚪ Pending'}
              </span>
              {job.status === 'complete' && (
                <button className="btn btn-ghost btn-sm" onClick={() => copyResult(job.result)}>Copy</button>
              )}
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            <strong>Prompt:</strong> {job.prompt.substring(0, 120)}{job.prompt.length > 120 ? '...' : ''}
          </div>
          {job.status === 'complete' && (
            <div style={{ marginTop: 6, padding: 8, background: 'var(--bg-tertiary)', borderRadius: 6, fontSize: 12, whiteSpace: 'pre-wrap', maxHeight: 120, overflow: 'auto' }}>
              {job.result}
            </div>
          )}
          {job.error && <div style={{ marginTop: 4, fontSize: 11, color: 'var(--danger-500)' }}>Error: {job.error}</div>}
        </div>
      ))}
      {recentJobs.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>No generations yet. Connect your API and create your first piece of content.</p>
      )}
    </div>
  )
}
