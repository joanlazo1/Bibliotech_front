import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type { Libro } from '../types/Libro'

import {
  BibliotecaContext,
  type DatosLibroEditables,
  type EjemplarEncontrado,
  type EstadoEjemplar,
} from './BibliotecaContext'

import {
  obtenerCatalogoApi,
} from '../services/bibliotecaApi'

interface BibliotecaProviderProps {
  children: ReactNode
}

export function BibliotecaProvider({
  children,
}: BibliotecaProviderProps) {
  const [libros, setLibros] =
    useState<Libro[]>([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const recargarCatalogo =
    useCallback(async () => {
      try {
        setCargando(true)

        const catalogo =
          await obtenerCatalogoApi()

        setLibros(catalogo)
        setError('')
      } catch (error) {
        console.error(
          'Error cargando catálogo:',
          error,
        )

        setError(
          'No se pudo conectar con el servidor de Bibliotech.',
        )
      } finally {
        setCargando(false)
      }
    }, [])

  useEffect(() => {
    let cancelado = false

    async function cargarCatalogoInicial() {
      try {
        const catalogo =
          await obtenerCatalogoApi()

        if (!cancelado) {
          setLibros(catalogo)
          setError('')
        }
      } catch (error) {
        console.error(
          'Error cargando catálogo:',
          error,
        )

        if (!cancelado) {
          setError(
            'No se pudo conectar con el servidor de Bibliotech.',
          )
        }
      } finally {
        if (!cancelado) {
          setCargando(false)
        }
      }
    }

    void cargarCatalogoInicial()

    return () => {
      cancelado = true
    }
  }, [])

  const buscarEjemplarPorNea = (
    nea: string,
  ): EjemplarEncontrado | null => {
    const codigo =
      nea.trim().toLowerCase()

    for (const libro of libros) {
      const ejemplar =
        libro.ejemplares.find(
          (item) =>
            item.nea
              .toLowerCase() ===
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
      librosActuales.map(
        (libro) => ({
          ...libro,

          ejemplares:
            libro.ejemplares.map(
              (ejemplar) =>
                ejemplar.nea === nea
                  ? {
                      ...ejemplar,
                      estado:
                        nuevoEstado,
                    }
                  : ejemplar,
            ),
        }),
      ),
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

    setLibros(
      (librosActuales) =>
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
        cargando,
        error,
        recargarCatalogo,
        cambiarEstadoEjemplar,
        buscarEjemplarPorNea,
        actualizarLibro,
      }}
    >
      {children}
    </BibliotecaContext.Provider>
  )
}
