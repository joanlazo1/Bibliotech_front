import {
  BookOpen,
  Brain,
  FlaskConical,
  GraduationCap,
  Landmark,
  Library,
  Monitor,
  Scale,
  ScrollText,
  Sparkles,
} from 'lucide-react'

interface BookCoverProps {
  titulo: string
  autor: string
  categoria: string
  portada?: string
}

interface Paleta {
  fondo1: string
  fondo2: string
  texto: string
  secundario: string
  acento: string
}

const paletas: Paleta[] = [
  {
    fondo1: '#23395B',
    fondo2: '#406E8E',
    texto: '#FFFFFF',
    secundario: '#DCE7F0',
    acento: '#E8C07D',
  },
  {
    fondo1: '#6D3D46',
    fondo2: '#9A5B64',
    texto: '#FFF9F7',
    secundario: '#F0DDE0',
    acento: '#E7C5A3',
  },
  {
    fondo1: '#385B51',
    fondo2: '#5F8377',
    texto: '#FAFFFC',
    secundario: '#DDEBE5',
    acento: '#D7C99B',
  },
  {
    fondo1: '#5B4B73',
    fondo2: '#7B6994',
    texto: '#FFF9FF',
    secundario: '#E8E0EE',
    acento: '#D6B7D8',
  },
  {
    fondo1: '#674B37',
    fondo2: '#91705A',
    texto: '#FFF9F2',
    secundario: '#EADFD5',
    acento: '#E8C58B',
  },
  {
    fondo1: '#35465A',
    fondo2: '#63758A',
    texto: '#FFFFFF',
    secundario: '#DDE4EA',
    acento: '#B9C9D8',
  },
  {
    fondo1: '#7A5632',
    fondo2: '#B0783E',
    texto: '#FFFDF8',
    secundario: '#F1E4D4',
    acento: '#EAC87B',
  },
  {
    fondo1: '#31596B',
    fondo2: '#4E8292',
    texto: '#F7FCFF',
    secundario: '#D9E9EE',
    acento: '#C4D8C4',
  },
]

function crearHash(
  texto: string,
) {
  let hash = 0

  for (
    let i = 0;
    i < texto.length;
    i += 1
  ) {
    hash =
      (hash << 5) -
      hash +
      texto.charCodeAt(i)

    hash |= 0
  }

  return Math.abs(hash)
}

function normalizarCategoria(
  categoria: string,
) {
  return categoria
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .toLowerCase()
}

function obtenerIcono(
  categoria: string,
) {
  const texto =
    normalizarCategoria(
      categoria,
    )

  if (
    texto.includes('literatura')
  ) {
    return <BookOpen size={27} />
  }

  if (
    texto.includes('historia')
  ) {
    return <Landmark size={27} />
  }

  if (
    texto.includes('ciencia')
  ) {
    return (
      <FlaskConical size={27} />
    )
  }

  if (
    texto.includes(
      'tecnologia',
    ) ||
    texto.includes(
      'computacion',
    )
  ) {
    return <Monitor size={27} />
  }

  if (
    texto.includes('derecho')
  ) {
    return <Scale size={27} />
  }

  if (
    texto.includes(
      'psicologia',
    )
  ) {
    return <Brain size={27} />
  }

  if (
    texto.includes(
      'educacion',
    )
  ) {
    return (
      <GraduationCap
        size={27}
      />
    )
  }

  if (
    texto.includes(
      'enciclop',
    )
  ) {
    return <Library size={27} />
  }

  if (
    texto.includes('tesis')
  ) {
    return (
      <ScrollText size={27} />
    )
  }

  return <Sparkles size={27} />
}

function obtenerIniciales(
  titulo: string,
) {
  const palabras =
    titulo
      .trim()
      .split(/\s+/)
      .filter(
        (palabra) =>
          palabra.length > 2,
      )

  return palabras
    .slice(0, 2)
    .map(
      (palabra) =>
        palabra[0]?.toUpperCase(),
    )
    .join('')
}

function BookCover({
  titulo,
  autor,
  categoria,
  portada,
}: BookCoverProps) {
  /*
    Si tenemos portada real,
    siempre tiene prioridad.
  */
  if (portada) {
    return (
      <div className="bt-cover bt-cover-real">
        <img
          src={portada}
          alt={`Portada de ${titulo}`}
          loading="lazy"
        />
      </div>
    )
  }

  /*
    La combinación depende del libro.

    Por eso:
    - diferentes libros = diferentes diseños
    - al actualizar la página no cambia
  */
  const hash =
    crearHash(
      `${titulo}-${autor}`,
    )

  const paleta =
    paletas[
      hash %
        paletas.length
    ]

  const diseno =
    hash % 6

  const iniciales =
    obtenerIniciales(
      titulo,
    ) || 'B'

  const estilos =
    {
      '--bt-fondo-1':
        paleta.fondo1,

      '--bt-fondo-2':
        paleta.fondo2,

      '--bt-texto':
        paleta.texto,

      '--bt-secundario':
        paleta.secundario,

      '--bt-acento':
        paleta.acento,
    } as React.CSSProperties

  return (
    <div
      className={`bt-cover bt-cover-generated bt-cover-design-${diseno}`}
      style={estilos}
    >
      <div className="bt-cover-shape bt-shape-one" />

      <div className="bt-cover-shape bt-shape-two" />

      <div className="bt-cover-shape bt-shape-three" />

      <div className="bt-cover-inner">
        <div className="bt-cover-top">
          <span className="bt-cover-category">
            {categoria}
          </span>
        </div>

        <div className="bt-cover-main">
          <div className="bt-cover-symbol">
            {diseno === 2 ||
            diseno === 5
              ? iniciales
              : obtenerIcono(
                  categoria,
                )}
          </div>

          <h4>
            {titulo}
          </h4>

          <p>
            {autor ||
              'Autor desconocido'}
          </p>
        </div>

        <div className="bt-cover-bottom">
          Biblioteca Municipal de Santa Anita
        </div>
      </div>
    </div>
  )
}

export default BookCover

