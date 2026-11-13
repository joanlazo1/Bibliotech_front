import type {
  Ejemplar,
  Libro,
} from '../types/Libro'

import {
  fetchAutenticado,
} from './authFetch'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'

interface ApiEjemplar {
  nea: string
  estado:
    | 'Disponible'
    | 'En uso'
  estadoFisico:
    | string
    | null
  ubicacion:
    | string
    | null
}

interface ApiLibro {
  id: number | string
  titulo: string
  autor: string
  categoria: string
  editorial:
    | string
    | null
  anio:
    | number
    | null
  portada:
    | string
    | null
  ubicacion: string
  ejemplares: ApiEjemplar[]
}

interface CatalogoResponse {
  ok: boolean
  total: number
  libros: ApiLibro[]
}

export interface ConsultaSalaApi {
  id: string

  tipo_identificacion:
    | 'CARNET'
    | 'DNI'

  numero_identificacion:
    string

  estado:
    | 'Activa'
    | 'Finalizada'

  fecha_inicio: string

  fecha_fin:
    | string
    | null
}

export interface EjemplarConsultaApi {
  id: string
  activo_en_consulta: boolean
  ejemplar_id: string
  nea: string

  estado_disponibilidad:
    | 'Disponible'
    | 'En uso'

  estado_fisico:
    | string
    | null

  ubicacion:
    | string
    | null

  libro_id: string
  titulo: string
  autor: string
}

export interface ConsultaDetalleApi {
  consulta:
    ConsultaSalaApi

  ejemplares:
    EjemplarConsultaApi[]
}

export interface DatosLibroApi {
  titulo: string
  autor: string
  categoria: string
  editorial: string
  anio: number

  portada_url?:
    | string
    | null
}

export interface DatosEjemplarApi {
  libro_id: number
  nea: string

  estado_disponibilidad:
    | 'Disponible'
    | 'En uso'

  estado_fisico:
    | string
    | null

  ubicacion:
    | string
    | null
}

function convertirEjemplar(
  ejemplar: ApiEjemplar,
): Ejemplar {
  return {
    nea:
      ejemplar.nea,

    estado:
      ejemplar.estado,

    estadoFisico:
      ejemplar.estadoFisico ??
      undefined,

    ubicacion:
      ejemplar.ubicacion ??
      undefined,
  }
}

function convertirLibro(
  libro: ApiLibro,
): Libro {
  return {
    id:
      Number(
        libro.id,
      ),

    titulo:
      libro.titulo,

    autor:
      libro.autor,

    categoria:
      libro.categoria,

    editorial:
      libro.editorial ??
      'Sin editorial',

    anio:
      libro.anio ?? 0,

    portada:
      libro.portada ??
      undefined,

    ubicacion:
      libro.ubicacion,

    ejemplares:
      libro.ejemplares.map(
        convertirEjemplar,
      ),
  }
}

async function leerRespuesta(
  respuesta: Response,
) {
  const datos =
    await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        'Ocurrió un error en el servidor.',
    )
  }

  return datos
}

/*
  PÚBLICO
*/
export async function obtenerCatalogoApi():
Promise<Libro[]> {
  const respuesta =
    await fetch(
      `${API_URL}/api/catalogo`,
    )

  if (!respuesta.ok) {
    throw new Error(
      'No se pudo cargar el catálogo.',
    )
  }

  const datos =
    (await respuesta.json()) as CatalogoResponse

  if (!datos.ok) {
    throw new Error(
      'La API no pudo obtener el catálogo.',
    )
  }

  return datos.libros.map(
    convertirLibro,
  )
}

/*
  PRIVADO
*/
export async function actualizarLibroApi(
  id: number,
  datos: DatosLibroApi,
): Promise<void> {
  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/libros/${id}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify(
            datos,
          ),
      },
    )

  await leerRespuesta(
    respuesta,
  )
}

export async function actualizarEjemplarApi(
  neaActual: string,
  datos: DatosEjemplarApi,
): Promise<void> {
  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/ejemplares/${encodeURIComponent(
        neaActual,
      )}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify(
            datos,
          ),
      },
    )

  await leerRespuesta(
    respuesta,
  )
}

export async function iniciarConsultaApi(
  tipoIdentificacion:
    | 'CARNET'
    | 'DNI',

  numeroIdentificacion: string,
): Promise<ConsultaSalaApi> {
  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/consultas/iniciar`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            tipo_identificacion:
              tipoIdentificacion,

            numero_identificacion:
              numeroIdentificacion,
          }),
      },
    )

  const datos =
    await leerRespuesta(
      respuesta,
    )

  return datos.consulta
}

export async function obtenerConsultaApi(
  id: string | number,
): Promise<ConsultaDetalleApi> {
  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/consultas/${id}`,
    )

  const datos =
    await leerRespuesta(
      respuesta,
    )

  return {
    consulta:
      datos.consulta,

    ejemplares:
      datos.ejemplares,
  }
}

export async function agregarEjemplarConsultaApi(
  consultaId:
    | string
    | number,

  nea: string,
): Promise<void> {
  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/consultas/${consultaId}/ejemplares`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            nea,
          }),
      },
    )

  await leerRespuesta(
    respuesta,
  )
}

export async function marcarEjemplarDisponibleApi(
  nea: string,
): Promise<void> {
  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/consultas/ejemplares/${encodeURIComponent(
        nea,
      )}/disponible`,
      {
        method: 'PUT',
      },
    )

  await leerRespuesta(
    respuesta,
  )
}

export async function finalizarConsultaApi(
  consultaId:
    | string
    | number,
): Promise<ConsultaSalaApi> {
  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/consultas/${consultaId}/finalizar`,
      {
        method: 'PUT',
      },
    )

  const datos =
    await leerRespuesta(
      respuesta,
    )

  return datos.consulta
}
