import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { ReduxProvider } from './provider/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider>
      <App />
    </ReduxProvider>
  </StrictMode>,
)
