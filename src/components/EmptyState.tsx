import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  compact?: boolean
}

export default function EmptyState({ icon, title, description, action, compact }: EmptyStateProps) {
  return (
    <div style={{
      textAlign: 'center',
      padding: compact ? '32px 16px' : '60px 20px',
      color: 'var(--text-muted)',
    }}>
      {icon && (
        <div style={{
          width: compact ? 36 : 48,
          height: compact ? 36 : 48,
          margin: '0 auto 12px',
          opacity: 0.4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </div>
      )}
      <div style={{
        fontSize: compact ? 13 : 15,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: description ? 6 : 0,
      }}>
        {title}
      </div>
      {description && (
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: action ? 16 : 0, lineHeight: 1.5 }}>
          {description}
        </div>
      )}
      {action && (
        <button className="btn btn-primary btn-sm" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
