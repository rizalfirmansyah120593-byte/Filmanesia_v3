console.log('CSP is applied');
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { WatchlistProvider } from './context/WatchlistContext'
import './index.css'
import './lib/webmcp.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <WatchlistProvider>
        <App />
      </WatchlistProvider>
    </HelmetProvider>
  </StrictMode>,
)
