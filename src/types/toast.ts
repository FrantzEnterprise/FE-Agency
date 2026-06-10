// ─── Toast notification system ─────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration: number // ms, 0 = persistent (dismissable)
  createdAt: number
}

let toastIdCounter = 0
export function nextToastId(): string {
  return `toast-${++toastIdCounter}`
}

export function createToast(
  type: ToastType,
  title: string,
  message?: string,
  duration: number = type === 'error' ? 5000 : 3000,
): Toast {
  return { id: nextToastId(), type, title, message, duration, createdAt: Date.now() }
}
