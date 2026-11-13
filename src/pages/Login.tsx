import {
  BookOpen,
  LockKeyhole,
  User,
} from 'lucide-react'

import {
  useState,
  type FormEvent,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router'

import { useAuth } from '../context/useAuth'

function Login() {
  const navigate =
    useNavigate()

  const {
    iniciarSesion,
  } = useAuth()

  const [usuario, setUsuario] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [
    procesando,
    setProcesando,
  ] = useState(false)

  const manejarInicioSesion =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault()

      const usuarioLimpio =
        usuario.trim()

      const passwordLimpio =
        password.trim()

      if (
        !usuarioLimpio ||
        !passwordLimpio
      ) {
        setError(
          'Ingresa tu usuario y contraseña.',
        )

        return
      }

      try {
        setProcesando(true)
        setError('')

        await iniciarSesion(
          usuarioLimpio,
          passwordLimpio,
        )

        navigate(
          '/admin',
          {
            replace: true,
          },
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudo iniciar sesión.',
        )
      } finally {
        setProcesando(false)
      }
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
          onSubmit={
            manejarInicioSesion
          }
          className="login-form"
        >
          <label>
            Usuario

            <div className="login-input">
              <User size={18} />

              <input
                type="text"
                value={usuario}
                disabled={
                  procesando
                }
                autoComplete="username"
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
              <LockKeyhole
                size={18}
              />

              <input
                type="password"
                value={password}
                disabled={
                  procesando
                }
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={
              procesando
            }
          >
            {procesando
              ? 'Ingresando...'
              : 'Ingresar'}
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