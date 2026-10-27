import type { Libro } from '../types/Libro'

export const libros: Libro[] = [
  {
    id: 1,
    titulo: 'El mito de Sísifo',
    autor: 'Albert Camus',
    categoria: 'Filosofía',
    editorial: 'Alianza Editorial',
    anio: 2012,
    ubicacion: 'Segundo piso – Estante E-07',
    color: 'cyan',
    ejemplares: [
      {
        nea: '1001',
        estado: 'Disponible',
      },
      {
        nea: '1002',
        estado: 'Disponible',
      },
    ],
  },

  {
    id: 2,
    titulo: 'Cuentos andinos',
    autor: 'Ana María Machado',
    categoria: 'Infantil',
    editorial: 'Editorial Norma',
    anio: 2015,
    ubicacion: 'Sala infantil – Estante I-02',
    color: 'red',
    ejemplares: [
      {
        nea: '2001',
        estado: 'Disponible',
      },
      {
        nea: '2002',
        estado: 'Disponible',
      },
      {
        nea: '2003',
        estado: 'Disponible',
      },
      {
        nea: '2004',
        estado: 'Disponible',
      },
      {
        nea: '2005',
        estado: 'Disponible',
      },
    ],
  },

  {
    id: 3,
    titulo: 'Introducción a la algoritmia',
    autor: 'Thomas Cormen',
    categoria: 'Tecnología',
    editorial: 'MIT Press',
    anio: 2009,
    ubicacion: 'Segundo piso – Estante D-04',
    color: 'orange',
    ejemplares: [
      {
        nea: '3001',
        estado: 'Disponible',
      },
      {
        nea: '3002',
        estado: 'Disponible',
      },
    ],
  },

  {
    id: 4,
    titulo: 'El código Da Vinci',
    autor: 'Dan Brown',
    categoria: 'Literatura',
    editorial: 'Planeta',
    anio: 2003,
    ubicacion: 'Segundo piso – Estante A-20',
    color: 'blue',
    ejemplares: [
      {
        nea: '4001',
        estado: 'Disponible',
      },
      {
        nea: '4002',
        estado: 'Disponible',
      },
      {
        nea: '4003',
        estado: 'Disponible',
      },
    ],
  },

  {
    id: 5,
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    categoria: 'Literatura',
    editorial: 'Espasa',
    anio: 2010,
    ubicacion: 'Segundo piso – Estante A-01',
    color: 'orange',
    ejemplares: [
      {
        nea: '5001',
        estado: 'Disponible',
      },
      {
        nea: '5002',
        estado: 'Disponible',
      },
    ],
  },

  {
    id: 6,
    titulo: 'Historia del Perú',
    autor: 'María Rostworowski',
    categoria: 'Historia',
    editorial: 'IEP',
    anio: 2018,
    ubicacion: 'Primer piso – Estante B-01',
    color: 'blue',
    ejemplares: [
      {
        nea: '6001',
        estado: 'Disponible',
      },
      {
        nea: '6002',
        estado: 'Disponible',
      },
      {
        nea: '6003',
        estado: 'Disponible',
      },
    ],
  },

  {
    id: 7,
    titulo: 'El origen de las especies',
    autor: 'Charles Darwin',
    categoria: 'Ciencia',
    editorial: 'Penguin',
    anio: 2009,
    ubicacion: 'Primer piso – Estante C-08',
    color: 'orange',
    ejemplares: [
      {
        nea: '7001',
        estado: 'Disponible',
      },
    ],
  },

  {
    id: 8,
    titulo: 'Breve historia del tiempo',
    autor: 'Stephen Hawking',
    categoria: 'Ciencia',
    editorial: 'Crítica',
    anio: 2011,
    ubicacion: 'Primer piso – Estante C-03',
    color: 'blue',
    ejemplares: [
      {
        nea: '8001',
        estado: 'Disponible',
      },
      {
        nea: '8002',
        estado: 'Disponible',
      },
    ],
  },

  {
    id: 9,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    categoria: 'Literatura',
    editorial: 'Sudamericana',
    anio: 2007,
    ubicacion: 'Segundo piso – Estante A-12',
    color: 'cyan',
    ejemplares: [
      {
        nea: '9001',
        estado: 'Disponible',
      },
      {
        nea: '9002',
        estado: 'Disponible',
      },
      {
        nea: '9003',
        estado: 'Disponible',
      },
    ],
  },

  {
    id: 10,
    titulo: 'El Principito',
    autor: 'Antoine de Saint-Exupéry',
    categoria: 'Literatura',
    editorial: 'Salamandra',
    anio: 2015,
    ubicacion: 'Segundo piso – Estante A-05',
    color: 'blue',
    ejemplares: [
      {
        nea: '10001',
        estado: 'Disponible',
      },
      {
        nea: '10002',
        estado: 'Disponible',
      },
      {
        nea: '10003',
        estado: 'En uso',
      },
      {
        nea: '10004',
        estado: 'Disponible',
      },
    ],
  },
]
