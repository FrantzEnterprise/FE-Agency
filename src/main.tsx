import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { hydrateStore, persistSubscribe } from './store/persistence'

// Hydrate localStorage data before first render
hydrateStore()

// Auto-save on every store change
persistSubscribe()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// deploy: build timestamp 1781327451
