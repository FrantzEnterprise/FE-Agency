// ─── localStorage auto-save for useAppStore ─────────────────────────────
// Imported from main.tsx to avoid interfering with Rolldown's .ts parser
// (which gets confused by the create(...) arrow function parens when code
// follows the export statement in the same file).

import { useAppStore } from './useAppStore'
import type { AppState } from '../types'

const PERSIST_KEY = 'frantz…data'

/** Keys to persist — excludes transient UI state (activeModule, etc.) */
const SAVE_KEYS: (keyof AppState)[] = [
  'dark',
  'agents', 'skills', 'projects', 'tasks', 'clients', 'clientTasks',
  'revenueHistory', 'pipeline', 'kpis', 'weeklyNotes', 'creativeAssets',
  'campaigns', 'seoKeywords', 'emailCampaigns', 'contactLists', 'autoresponders',
  'emailTemplates', 'socialPosts', 'contentPieces', 'pitchDeals', 'discoveryCalls',
  'marketIntel', 'scopeChanges', 'aiJobs', 'socialQueue',
  'apiConfig', 'integrations', 'settings',
  'portalInvites', 'clientApprovals', 'clientMessages',
  'websites', 'websiteTemplates',
  'invoices', 'payments', 'stripeConfig',
]

/** Hydrate persisted data on first load */
export function hydrateStore(): void {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (raw) {
      const parsed: Partial<AppState> = JSON.parse(raw)
      const partial: Record<string, unknown> = {}
      for (const key of SAVE_KEYS) {
        if (key in parsed) partial[key] = (parsed as any)[key]
      }
      // Ensure array fields never become null/undefined from stale localStorage
      for (const key of ["agents","skills","projects","tasks","clients","clientTasks","contentPieces","pitchDeals","discoveryCalls","marketIntel","scopeChanges","aiJobs","socialQueue","integrations","portalInvites","clientApprovals","clientMessages","websites","invoices","payments"]) {
        if (key in partial && !Array.isArray((partial as any)[key])) (partial as any)[key] = []
      }
      if (Object.keys(partial).length > 0) {
        useAppStore.setState(partial)
      }
    }
  } catch {
    // First visit — sample data is fine
  }
}

/** Subscribe to store changes and auto-save (debounced 500ms) */
export function persistSubscribe(): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  const unsub = useAppStore.subscribe((state) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        const data: Record<string, unknown> = {}
        const s = state as unknown as Record<string, unknown>
        for (const key of SAVE_KEYS) data[key] = s[key]
        localStorage.setItem(PERSIST_KEY, JSON.stringify(data))
      } catch {
        // localStorage full or unavailable
      }
    }, 500)
  })

  return unsub
}

/** Clear persisted data */
export function clearPersistedData(): void {
  try { localStorage.removeItem(PERSIST_KEY) } catch { /* ok */ }
}
