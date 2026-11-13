import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  AuthContext,
} from './AuthContext'

import {
  loginApi,
  obtenerSesionApi,
  type UsuarioAdmin,
} from '../services/authApi'

interface AuthProviderProps {
  children: ReactNode
}

const TOKEN_KEY =
  'bibliotech_token'

const USER_KEY =
  'bibliotech_usuario'

function obtenerUsuarioGuardado():
UsuarioAdmin | null {
  const guardado =
    localStorage.getItem(
      USER_KEY,
    )

  if (!guardado) {
    return null
  }

  try {
    return JSON.parse(
      guardado,
    ) as UsuarioAdmin
  } catch {
    return null
  }
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [
    token,
    setToken,
  ] = useState<string | null>(
    () =>
      localStorage.getItem(
        TOKEN_KEY,
      ),
  )

  const [
    usuario,
    setUsuario,
  ] =
    useState<UsuarioAdmin | null>(
      obtenerUsuarioGuardado,
    )

  const [
    cargando,
    setCargando,
  ] = useState(
    () =>
      Boolean(
        localStorage.getItem(
          TOKEN_KEY,
        ),
      ),
  )

  useEffect(() => {
    if (!token) {
      return
    }

    let cancelado = false

    async function validarSesion() {
      try {
        const respuesta =
          await obtenerSesionApi(
            token as string,
          )

        if (!cancelado) {
          setUsuario(
            respuesta.usuario,
          )

          localStorage.setItem(
            USER_KEY,
            JSON.stringify(
              respuesta.usuario,
            ),
          )
        }
      } catch {
        if (!cancelado) {
          localStorage.removeItem(
            TOKEN_KEY,
          )

          localStorage.removeItem(
            USER_KEY,
          )

          setToken(null)
          setUsuario(null)
        }
      } finally {
        if (!cancelado) {
          setCargando(false)
        }
      }
    }

    void validarSesion()

    return () => {
      cancelado = true
    }
  }, [token])

  const iniciarSesion =
    async (
      nombreUsuario: string,
      password: string,
    ) => {
      const respuesta =
        await loginApi(
          nombreUsuario,
          password,
        )

      localStorage.setItem(
        TOKEN_KEY,
        respuesta.token,
      )

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(
          respuesta.usuario,
        ),
      )

      setToken(
        respuesta.token,
      )

      setUsuario(
        respuesta.usuario,
      )

      setCargando(false)
    }

  const cerrarSesion = () => {
    localStorage.removeItem(
      TOKEN_KEY,
    )

    localStorage.removeItem(
      USER_KEY,
    )

    setToken(null)
    setUsuario(null)
    setCargando(false)
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        autenticado:
          Boolean(
            token &&
            usuario,
          ),
        cargando,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
