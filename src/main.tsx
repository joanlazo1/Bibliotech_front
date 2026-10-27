import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import './index.css'
import App from './App'

import { BibliotecaProvider } from './context/BibliotecaProvider'

createRoot(
  document.getElementById('root')!,
).render(
  <StrictMode>
    <BrowserRouter>
      <BibliotecaProvider>
        <App />
      </BibliotecaProvider>
    </BrowserRouter>
  </StrictMode>,
)