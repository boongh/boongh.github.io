import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DummyProjApp from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DummyProjApp />
  </StrictMode>,
)
