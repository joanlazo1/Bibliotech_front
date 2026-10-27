import {
  BookOpen,
  LockKeyhole,
  User,
} from 'lucide-react'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

function Login() {
  const navigate = useNavigate()

  const [usuario, setUsuario] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const iniciarSesion = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (
      !usuario.trim() ||
      !password.trim()
    ) {
      setError(
        'Ingresa tu usuario y contraseña.',
      )

      return
    }

    setError('')

    // Temporal:
    // posteriormente será validado por el backend.
    navigate('/admin')
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <Link
          to="/"
          className="login-logo"
        >
          <img
            src="/logo-santa-anita.png"
            alt="Municipalidad de Santa Anita"
          />
        </Link>

        <div className="login-icon">
          <BookOpen size={28} />
        </div>

        <h1>
          Acceso al personal
        </h1>

        <p className="login-description">
          Ingresa tus credenciales para
          administrar Bibliotech.
        </p>

        <form
          onSubmit={iniciarSesion}
          className="login-form"
        >
          <label>
            Usuario

            <div className="login-input">
              <User size={18} />

              <input
                type="text"
                value={usuario}
                onChange={(event) =>
                  setUsuario(
                    event.target.value,
                  )
                }
                placeholder="Ingresa tu usuario"
              />
            </div>
          </label>

          <label>
            Contraseña

            <div className="login-input">
              <LockKeyhole size={18} />

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </label>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button type="submit">
            Ingresar
          </button>
        </form>

        <Link
          to="/"
          className="login-back"
        >
          Volver al catálogo
        </Link>
      </div>
    </main>
  )
}

export default Login