export interface Ejemplar {
  nea: string
  estado: 'Disponible' | 'En uso'
  estadoFisico?: string
  ubicacion?: string
}

export interface Libro {
  id: number
  titulo: string
  autor: string
  categoria: string
  editorial: string
  anio: number
  portada?: string
  color?: 'cyan' | 'red' | 'orange' | 'blue'
  ubicacion: string
  ejemplares: Ejemplar[]
}
