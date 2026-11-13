import {
  fetchAutenticado,
} from './authFetch'

export interface ResumenImportacion {
  filasInventario: number
  ejemplaresImportables: number
  neaVacios: number
  neaDuplicados: number
  filasDuplicadas: number
  fichasEstimadas: number
  autoresVacios: number
  editorialesVacias: number
  estadosFisicosVacios: number
  aniosValidos: number
  aniosSinDato: number
  aniosInvalidos: number
}

export interface ObservacionImportacion {
  tipo:
    | 'NEA_VACIO'
    | 'NEA_DUPLICADO'
    | 'ANIO_INVALIDO'

  fila?: number
  nea?: string
  detalle: string
}

export interface CategoriaImportacion {
  categoria: string
  cantidad: number
}

export interface PreviewImportacion {
  ok: boolean
  archivo: string
  resumen: ResumenImportacion
  categorias:
    CategoriaImportacion[]
  totalObservaciones: number
  observaciones:
    ObservacionImportacion[]
}

export interface ResultadoImportacion {
  filasProcesadas: number
  fichasDetectadas: number
  librosCreados: number
  librosReutilizados: number
  ejemplaresCreados: number
  ejemplaresActualizados: number
  registrosOmitidos: number
  observaciones: number
}

export interface ConfirmacionImportacion {
  ok: boolean
  message: string
  resultado:
    ResultadoImportacion
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'

export async function previsualizarExcelApi(
  archivo: File,
): Promise<PreviewImportacion> {
  const formulario =
    new FormData()

  formulario.append(
    'archivo',
    archivo,
  )

  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/importaciones/preview`,
      {
        method: 'POST',
        body: formulario,
      },
    )

  const datos =
    await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        'No se pudo analizar el archivo Excel.',
    )
  }

  return datos
}

export async function confirmarExcelApi(
  archivo: File,
): Promise<ConfirmacionImportacion> {
  const formulario =
    new FormData()

  formulario.append(
    'archivo',
    archivo,
  )

  const respuesta =
    await fetchAutenticado(
      `${API_URL}/api/importaciones/confirmar`,
      {
        method: 'POST',
        body: formulario,
      },
    )

  const datos =
    await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        'No se pudo importar el inventario.',
    )
  }

  return datos
}
