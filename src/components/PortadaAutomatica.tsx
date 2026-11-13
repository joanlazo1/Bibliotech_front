import {
  Image,
  Search,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  buscarPortadaAutomaticaApi,
} from '../services/portadasApi'

interface PortadaAutomaticaProps {
  libroId: number

  portadaActual?:
    | string

  onActualizada:
    () => Promise<void>
}

function PortadaAutomatica({
  libroId,
  portadaActual,
  onActualizada,
}: PortadaAutomaticaProps) {
  const [
    buscando,
    setBuscando,
  ] = useState(false)

  const [
    mensaje,
    setMensaje,
  ] = useState('')

  const buscarPortada =
    async () => {
      try {
        setBuscando(true)
        setMensaje('')

        const resultado =
          await buscarPortadaAutomaticaApi(
            libroId,
          )

        await onActualizada()

        setMensaje(
          resultado.message,
        )
      } catch (error) {
        setMensaje(
          error instanceof Error
            ? error.message
            : 'No se pudo buscar la portada.',
        )
      } finally {
        setBuscando(false)
      }
    }

  return (
    <section className="auto-cover-section">
      <div className="auto-cover-preview">
        {portadaActual ? (
          <img
            src={portadaActual}
            alt="Portada actual"
          />
        ) : (
          <div className="auto-cover-empty">
            <Image size={28} />

            <span>
              Sin portada
            </span>
          </div>
        )}
      </div>

      <div className="auto-cover-info">
        <strong>
          Portada del libro
        </strong>

        <p>
          Bibliotech puede buscar una
          portada por título y autor.
        </p>

        <button
          type="button"
          disabled={
            buscando
          }
          onClick={
            buscarPortada
          }
        >
          <Search size={16} />

          {buscando
            ? 'Buscando...'
            : portadaActual
              ? 'Buscar otra portada'
              : 'Buscar portada automáticamente'}
        </button>

        {mensaje && (
          <span className="auto-cover-message">
            {mensaje}
          </span>
        )}
      </div>
    </section>
  )
}

export default PortadaAutomatica
