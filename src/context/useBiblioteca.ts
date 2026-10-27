import { useContext } from 'react'
import { BibliotecaContext } from './BibliotecaContext'

export function useBiblioteca() {
  const context =
    useContext(BibliotecaContext)

  if (!context) {
    throw new Error(
      'useBiblioteca debe utilizarse dentro de BibliotecaProvider',
    )
  }

  return context
}
