import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Admin from './pages/Admin.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <main className="flex-1 pb-16">
        <Admin />
      </main>
    </div>
  </StrictMode>,
)
