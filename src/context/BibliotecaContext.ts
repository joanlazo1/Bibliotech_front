import { createContext } from 'react'
import type { Libro } from '../types/Libro'

export type EstadoEjemplar =
  | 'Disponible'
  | 'En uso'

export interface EjemplarEncontrado {
  libro: Libro
  nea: string
  estado: EstadoEjemplar
}

export interface DatosLibroEditables {
  titulo: string
  autor: string
  categoria: string
  editorial: string
  anio: number
  ubicacion: string
}

export interface BibliotecaContextType {
  libros: Libro[]

  cargando: boolean

  error: string

  recargarCatalogo:
    () => Promise<void>

  cambiarEstadoEjemplar: (
    nea: string,
    nuevoEstado: EstadoEjemplar,
  ) => boolean

  buscarEjemplarPorNea: (
    nea: string,
  ) => EjemplarEncontrado | null

  actualizarLibro: (
    id: number,
    datos: DatosLibroEditables,
  ) => boolean
}

export const BibliotecaContext =
  createContext<BibliotecaContextType | undefined>(
    undefined,
  )
