import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import { ListadoExpertos } from './components/ListadoExpertos.jsx'
import { CrearExperto } from './components/CrearExperto.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ListadoExpertos/>
  </StrictMode>,
)
