import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'
import App from './pages/App.jsx'

//!Aquí es la inyección de root
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <BrowserRouter>
    
    <App />

    </BrowserRouter>
  </StrictMode>,
)
