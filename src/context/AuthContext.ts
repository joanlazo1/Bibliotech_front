import {
  createContext,
} from 'react'

import type {
  UsuarioAdmin,
} from '../services/authApi'

export interface AuthContextType {
  usuario: UsuarioAdmin | null
  token: string | null
  autenticado: boolean
  cargando: boolean

  iniciarSesion: (
    usuario: string,
    password: string,
  ) => Promise<void>

  cerrarSesion: () => void
}

export const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined)
