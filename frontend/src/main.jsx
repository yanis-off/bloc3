import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// --- Supervision des erreurs (Sentry) ---
// Le DSN est injecté au build via VITE_SENTRY_DSN (comme VITE_API_URL).
// Si la variable est absente (ex: dev local sans DSN), Sentry reste inactif.
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE, // "development" ou "production"
    // Capture 100% des erreurs. tracesSampleRate non défini = pas de tracing perf
    // (on garde léger pour rester dans le quota gratuit).
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
