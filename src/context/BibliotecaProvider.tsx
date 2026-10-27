import {
  useState,
  type ReactNode,
} from 'react'

import { libros as librosIniciales } from '../data/libros'
import type { Libro } from '../types/Libro'

import {
  BibliotecaContext,
  type DatosLibroEditables,
  type EjemplarEncontrado,
  type EstadoEjemplar,
} from './BibliotecaContext'

interface BibliotecaProviderProps {
  children: ReactNode
}

export function BibliotecaProvider({
  children,
}: BibliotecaProviderProps) {
  const [libros, setLibros] =
    useState<Libro[]>(librosIniciales)

  const buscarEjemplarPorNea = (
    nea: string,
  ): EjemplarEncontrado | null => {
    const codigo =
      nea.trim().toLowerCase()

    for (const libro of libros) {
      const ejemplar =
        libro.ejemplares.find(
          (item) =>
            item.nea.toLowerCase() ===
            codigo,
        )

      if (ejemplar) {
        return {
          libro,
          nea: ejemplar.nea,
          estado: ejemplar.estado,
        }
      }
    }

    return null
  }

  const cambiarEstadoEjemplar = (
    nea: string,
    nuevoEstado: EstadoEjemplar,
  ) => {
    const existe =
      libros.some((libro) =>
        libro.ejemplares.some(
          (ejemplar) =>
            ejemplar.nea === nea,
        ),
      )

    if (!existe) {
      return false
    }

    setLibros((librosActuales) =>
      librosActuales.map((libro) => ({
        ...libro,

        ejemplares:
          libro.ejemplares.map(
            (ejemplar) =>
              ejemplar.nea === nea
                ? {
                    ...ejemplar,
                    estado: nuevoEstado,
                  }
                : ejemplar,
          ),
      })),
    )

    return true
  }

  const actualizarLibro = (
    id: number,
    datos: DatosLibroEditables,
  ) => {
    const existe =
      libros.some(
        (libro) =>
          libro.id === id,
      )

    if (!existe) {
      return false
    }

    setLibros((librosActuales) =>
      librosActuales.map(
        (libro) =>
          libro.id === id
            ? {
                ...libro,
                ...datos,
              }
            : libro,
      ),
    )

    return true
  }

  return (
    <BibliotecaContext.Provider
      value={{
        libros,
        cambiarEstadoEjemplar,
        buscarEjemplarPorNea,
        actualizarLibro,
      }}
    >
      {children}
    </BibliotecaContext.Provider>
  )
}