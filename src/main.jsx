import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/aurora.css'
import './styles/aurora-motion.css'
import './styles/aurora-mobile.css'
import 'katex/dist/katex.min.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// PWA: registra el service worker (solo en producción) para poder instalar la app y abrirla más rápido
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('Service worker no registrado:', err));
  });
}