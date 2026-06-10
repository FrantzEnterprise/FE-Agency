import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import type { Toast } from '../types/toast'

const iconMap = {
  success: <CheckCircle size={18} style={{ color: '#22c55e' }} />,
  error: <AlertCircle size={18} style={{ color: '#ef4444' }} />,
  warning: <AlertTriangle size={18} style={{ color: '#f59e0b' }} />,
  info: <Info size={18} style={{ color: '#3b82f6' }} />,
}

const bgMap: Record<string, string> = {
  success: 'rgba(34,197,94,0.1)',
  error: 'rgba(239,68,68,0.1)',
  warning: 'rgba(245,158,11,0.1)',
  info: 'rgba(59,130,246,0.1)',
}

const borderMap: Record<string, string> = {
  success: 'var(--success)',
  error: 'var(--danger)',
  warning: 'var(--warning)',
  info: 'var(--info)',
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    if (toast.duration <= 0) return
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderLeft: `4px solid ${borderMap[toast.type] || 'var(--info)'}`,
        borderRadius: 10,
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        marginBottom: 8,
        animation: 'slideUp 0.25s ease-out',
        maxWidth: 400,
        minWidth: 280,
        position: 'relative',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        {iconMap[toast.type] || iconMap.info}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: toast.message ? 2 : 0 }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {toast.message}
          </div>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.6,
          transition: 'opacity 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useAppStore(s => s.toasts)
  const removeToast = useAppStore(s => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'auto',
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
      ))}
    </div>
  )
}
