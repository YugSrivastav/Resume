import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/reset.css'
import './styles/font.css'
import './styles/variables.css'
import './styles/color.css'
import './styles/style.css'
import './styles/grid.css'
import './styles/media-queries.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
