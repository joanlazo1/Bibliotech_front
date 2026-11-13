import {
  StrictMode,
} from 'react'

import {
  createRoot,
} from 'react-dom/client'

import {
  BrowserRouter,
} from 'react-router'

import './index.css'

import App from './App'

import {
  BibliotecaProvider,
} from './context/BibliotecaProvider'

import {
  AuthProvider,
} from './context/AuthProvider'

createRoot(
  document.getElementById(
    'root',
  )!,
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BibliotecaProvider>
          <App />
        </BibliotecaProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)