import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const QUESTIONS = [
  { id: 'mission', q: 'What is your company mission and vision?', hint: 'One sentence each. What drives the business beyond profit?' },
  { id: 'audience', q: 'Describe your ideal customer in 3 sentences.', hint: 'Demographics, psychographics, pain points, what they value most.' },
  { id: 'tone', q: 'Choose 3 words that describe your brand voice.', hint: 'e.g. Professional, warm, bold, playful, authoritative, empathetic, minimalist' },
  { id: 'antitone', q: 'What tone should we NEVER use?', hint: 'e.g. Too casual, overly technical, sarcastic, salesy, corporate jargon' },
  { id: 'colors', q: 'What are your brand colors?', hint: 'Primary hex codes or Pantone. If unknown, describe the palette.' },
  { id: 'fonts', q: 'What typography do you use?', hint: 'Headline and body fonts. If unknown, describe the aesthetic.' },
  { id: 'competitors', q: 'Who are your top 3 competitors?', hint: 'Names and what you admire or dislike about their branding.' },
  { id: 'differentiator', q: 'What makes you different from competitors?', hint: 'Your unique value proposition in one sentence.' },
  { id: 'visuals', q: 'Describe your visual style in 5 words.', hint: 'e.g. Clean, bold, organic, technical, colorful, minimal, textured' },
  { id: 'imagery', q: 'What imagery/photo style represents your brand?', hint: 'e.g. Lifestyle shots, product close-ups, illustrations, abstract, user-generated' },
  { id: 'examples', q: 'Give 2–3 brands whose voice/style you admire.', hint: 'And explain what you like about each one.' },
  { id: 'avoid', q: 'What words, phrases, or imagery should we avoid?', hint: 'Anything that feels off-brand, dated, or could alienate your audience.' },
]

export default function BrandVoicePage() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [generated, setGenerated] = useState(false)

  const handleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
    setGenerated(false)
  }

  const allAnswered = QUESTIONS.every(q => (answers[q.id] || '').trim().length > 0)

  const generateGuidelines = () => {
    setGenerated(true)
  }

  const handleCopy = () => {
    const text = `BRAND VOICE GUIDELINES — Generated ${new Date().toLocaleDateString()}

MISSION & VISION
${answers.mission}

TARGET AUDIENCE
${answers.audience}

TONE WORDS: ${answers.tone}
AVOID: ${answers.antitone}

PRIMARY COLORS: ${answers.colors}
TYPOGRAPHY: ${answers.fonts}

TOP COMPETITORS: ${answers.competitors}
DIFFERENTIATOR: ${answers.differentiator}

VISUAL STYLE: ${answers.visuals}
IMAGERY: ${answers.imagery}

INSPIRATION: ${answers.examples}
AVOID IN CONTENT: ${answers.avoid}`
    navigator.clipboard.writeText(text)
  }

  const progress = Object.keys(answers).filter(k => answers[k].trim()).length
  const pct = Math.round((progress / QUESTIONS.length) * 100)

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Brand Voice Capture</h2>
          <p className="section-desc">Capture and document client brand voice, tone, and visual guidelines.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Brand Profile Progress</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{progress}/{QUESTIONS.length} answered</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, var(--brand-500), var(--accent-500))', transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* Questions */}
      <div className="card">
        <div style={{ display: 'grid', gap: 16 }}>
          {QUESTIONS.map(q => (
            <div key={q.id}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {q.q}
              </label>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{q.hint}</div>
              <textarea
                rows={2}
                className="form-textarea"
                style={{ width: '100%' }}
                value={answers[q.id] || ''}
                onChange={e => handleAnswer(q.id, e.target.value)}
                placeholder="Type your answer..."
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn btn-primary" disabled={!allAnswered} onClick={generateGuidelines}>
            Generate Brand Guidelines
          </button>
          {generated && (
            <button className="btn" onClick={handleCopy}>Copy Guidelines</button>
          )}
        </div>
      </div>

      {generated && (
        <div className="card" style={{ marginTop: 16, borderLeft: '4px solid var(--accent-500)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Brand Guidelines</h3>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p><strong>Mission:</strong> {answers.mission}</p>
            <p><strong>Audience:</strong> {answers.audience}</p>
            <p><strong>Voice:</strong> {answers.tone} · <strong>Avoid:</strong> {answers.antitone}</p>
            <p><strong>Colors:</strong> {answers.colors} · <strong>Fonts:</strong> {answers.fonts}</p>
            <p><strong>Visual Style:</strong> {answers.visuals} · <strong>Imagery:</strong> {answers.imagery}</p>
            <p><strong>Differentiator:</strong> {answers.differentiator}</p>
            <p><strong>Competitors:</strong> {answers.competitors}</p>
            <p><strong>Inspiration:</strong> {answers.examples}</p>
            <p><strong>Avoid:</strong> {answers.avoid}</p>
          </div>
        </div>
      )}
    </div>
  )
}
