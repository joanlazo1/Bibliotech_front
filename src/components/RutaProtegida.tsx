import {
  Navigate,
  Outlet,
} from 'react-router'

import {
  useAuth,
} from '../context/useAuth'

function RutaProtegida() {
  const {
    autenticado,
    cargando,
  } = useAuth()

  if (cargando) {
    return (
      <main
        style={{
          padding: '40px',
          textAlign:
            'center',
        }}
      >
        Verificando sesión...
      </main>
    )
  }

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return <Outlet />
}

export default RutaProtegida
