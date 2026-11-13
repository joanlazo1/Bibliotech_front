import {
  fetchAutenticado,
} from './authFetch'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'

export interface ResultadoPortadaApi {
  ok: boolean
  message: string

  portada: {
    url: string

    fuente:
      | 'Google Books'
      | 'Open Library'
  }
}

export async function buscarPortadaAutomaticaApi(
  libroId: number,
): Promise<ResultadoPortadaApi> {
  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/portadas/libros/${libroId}/buscar`,
      {
        method: 'POST',
      },
    )

  const datos =
    await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        'No se pudo buscar la portada.',
    )
  }

  return datos
}
