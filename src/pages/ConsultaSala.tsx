import {
  ArrowLeft,
  BookOpen,
  LogOut,
  Search,
  UserRound,
} from 'lucide-react'

import {
  useState,
  type FormEvent,
} from 'react'

import { Link } from 'react-router'

import { useBiblioteca } from '../context/useBiblioteca'

import {
  agregarEjemplarConsultaApi,
  finalizarConsultaApi,
  iniciarConsultaApi,
  marcarEjemplarDisponibleApi,
  obtenerConsultaApi,
  type ConsultaDetalleApi,
} from '../services/bibliotecaApi'

type TipoIdentificacion =
  | 'Carné de biblioteca'
  | 'DNI'

function ConsultaSala() {
  const {
    buscarEjemplarPorNea,
    recargarCatalogo,
  } = useBiblioteca()

  const [
    tipoIdentificacion,
    setTipoIdentificacion,
  ] = useState<TipoIdentificacion>(
    'Carné de biblioteca',
  )

  const [
    numeroIdentificacion,
    setNumeroIdentificacion,
  ] = useState('')

  const [
    consulta,
    setConsulta,
  ] =
    useState<ConsultaDetalleApi | null>(
      null,
    )

  const [nea, setNea] =
    useState('')

  const [
    neaEncontrado,
    setNeaEncontrado,
  ] = useState<string | null>(null)

  const [mensaje, setMensaje] =
    useState('')

  const [procesando, setProcesando] =
    useState(false)

  const resultado =
    neaEncontrado
      ? buscarEjemplarPorNea(
          neaEncontrado,
        )
      : null

  const consultaActiva =
    consulta?.consulta.estado ===
    'Activa'

  const ejemplaresEnUso =
    consulta?.ejemplares.filter(
      (ejemplar) =>
        ejemplar.activo_en_consulta,
    ) ?? []

  const recargarConsulta =
    async (
      consultaId:
        | string
        | number,
    ) => {
      const datos =
        await obtenerConsultaApi(
          consultaId,
        )

      setConsulta(datos)
    }

  const iniciarConsulta = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const identificacion =
      numeroIdentificacion.trim()

    if (!identificacion) {
      setMensaje(
        'Ingresa el número de identificación del usuario.',
      )
      return
    }

    if (
      tipoIdentificacion ===
        'DNI' &&
      !/^\d{8}$/.test(
        identificacion,
      )
    ) {
      setMensaje(
        'El DNI debe contener 8 dígitos.',
      )
      return
    }

    try {
      setProcesando(true)
      setMensaje('')

      const tipoApi =
        tipoIdentificacion ===
        'DNI'
          ? 'DNI'
          : 'CARNET'

      const consultaIniciada =
        await iniciarConsultaApi(
          tipoApi,
          identificacion,
        )

      await recargarConsulta(
        consultaIniciada.id,
      )

      setMensaje(
        'Consulta iniciada correctamente.',
      )
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar la consulta.',
      )
    } finally {
      setProcesando(false)
    }
  }

  const buscarEjemplar = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const codigo =
      nea.trim()

    if (!codigo) {
      setNeaEncontrado(null)

      setMensaje(
        'Ingresa un código NEA.',
      )

      return
    }

    const ejemplar =
      buscarEjemplarPorNea(
        codigo,
      )

    if (!ejemplar) {
      setNeaEncontrado(null)

      setMensaje(
        'No se encontró un ejemplar con ese código NEA.',
      )

      return
    }

    setNeaEncontrado(
      ejemplar.nea,
    )

    setMensaje('')
  }

  const agregarEjemplar =
    async () => {
      if (
        !resultado ||
        !consulta
      ) {
        return
      }

      if (
        resultado.estado !==
        'Disponible'
      ) {
        setMensaje(
          `El ejemplar NEA ${resultado.nea} ya se encuentra en uso.`,
        )

        return
      }

      try {
        setProcesando(true)

        await agregarEjemplarConsultaApi(
          consulta.consulta.id,
          resultado.nea,
        )

        await recargarCatalogo()

        await recargarConsulta(
          consulta.consulta.id,
        )

        setNea('')
        setNeaEncontrado(null)

        setMensaje(
          `El ejemplar NEA ${resultado.nea} fue agregado a la consulta.`,
        )
      } catch (error) {
        setMensaje(
          error instanceof Error
            ? error.message
            : 'No se pudo agregar el ejemplar.',
        )
      } finally {
        setProcesando(false)
      }
    }

  const marcarComoDisponible =
    async (
      codigoNea: string,
    ) => {
      if (!consulta) {
        return
      }

      try {
        setProcesando(true)

        await marcarEjemplarDisponibleApi(
          codigoNea,
        )

        await recargarCatalogo()

        await recargarConsulta(
          consulta.consulta.id,
        )

        setMensaje(
          `El ejemplar NEA ${codigoNea} fue marcado como disponible.`,
        )
      } catch (error) {
        setMensaje(
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar el ejemplar.',
        )
      } finally {
        setProcesando(false)
      }
    }

  const finalizarConsulta =
    async () => {
      if (!consulta) {
        return
      }

      try {
        setProcesando(true)

        await finalizarConsultaApi(
          consulta.consulta.id,
        )

        await recargarCatalogo()

        setConsulta(null)
        setNumeroIdentificacion('')
        setNea('')
        setNeaEncontrado(null)

        setMensaje(
          'Consulta finalizada correctamente.',
        )
      } catch (error) {
        setMensaje(
          error instanceof Error
            ? error.message
            : 'No se pudo finalizar la consulta.',
        )
      } finally {
        setProcesando(false)
      }
    }

  return (
    <main className="room-page">
      <div className="room-container">
        <Link
          to="/admin"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Volver al panel
        </Link>

        <div className="room-heading">
          <div className="room-icon">
            <BookOpen size={28} />
          </div>

          <div>
            <h1>
              Consulta en sala
            </h1>

            <p>
              Registro de usuarios y
              ejemplares utilizados dentro
              de la biblioteca.
            </p>
          </div>
        </div>

        {!consultaActiva ? (
          <section className="room-user-card">
            <div className="room-card-title">
              <div className="room-user-icon">
                <UserRound
                  size={22}
                />
              </div>

              <div>
                <h2>
                  Identificación del
                  usuario
                </h2>

                <p>
                  Registra al usuario
                  antes de iniciar la
                  consulta.
                </p>
              </div>
            </div>

            <form
              className="room-user-form"
              onSubmit={
                iniciarConsulta
              }
            >
              <div className="room-user-fields">
                <label className="room-user-field">
                  <span>
                    Tipo de identificación
                  </span>

                  <select
                    value={
                      tipoIdentificacion
                    }
                    disabled={
                      procesando
                    }
                    onChange={(
                      event,
                    ) => {
                      setTipoIdentificacion(
                        event.target
                          .value as TipoIdentificacion,
                      )

                      setNumeroIdentificacion(
                        '',
                      )

                      setMensaje('')
                    }}
                  >
                    <option value="Carné de biblioteca">
                      Carné de biblioteca
                    </option>

                    <option value="DNI">
                      DNI
                    </option>
                  </select>
                </label>

                <label className="room-user-field">
                  <span>
                    {tipoIdentificacion ===
                    'DNI'
                      ? 'Número de DNI'
                      : 'Número de carné'}
                  </span>

                  <input
                    type="text"
                    placeholder={
                      tipoIdentificacion ===
                      'DNI'
                        ? 'Ej. 12345678'
                        : 'Ej. 000245'
                    }
                    value={
                      numeroIdentificacion
                    }
                    disabled={
                      procesando
                    }
                    maxLength={
                      tipoIdentificacion ===
                      'DNI'
                        ? 8
                        : 20
                    }
                    onChange={(
                      event,
                    ) =>
                      setNumeroIdentificacion(
                        event.target
                          .value,
                      )
                    }
                  />
                </label>
              </div>

              <button
                type="submit"
                className="room-start-button"
                disabled={
                  procesando
                }
              >
                {procesando
                  ? 'Procesando...'
                  : 'Iniciar consulta'}
              </button>
            </form>
          </section>
        ) : (
          <>
            <section className="room-active-user">
              <div>
                <div className="room-active-user-icon">
                  <UserRound
                    size={21}
                  />
                </div>

                <div>
                  <span>
                    Consulta activa
                  </span>

                  <strong>
                    {
                      tipoIdentificacion
                    }{' '}
                    {
                      numeroIdentificacion
                    }
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="room-finish-button"
                disabled={
                  procesando
                }
                onClick={
                  finalizarConsulta
                }
              >
                <LogOut size={17} />
                Finalizar consulta
              </button>
            </section>

            <section className="room-search-card">
              <h2>
                Buscar ejemplar
              </h2>

              <p>
                Ingresa el código NEA
                del ejemplar físico.
              </p>

              <form
                onSubmit={
                  buscarEjemplar
                }
                className="room-search"
              >
                <div>
                  <Search
                    size={19}
                  />

                  <input
                    type="search"
                    placeholder="Ej. 10001"
                    value={nea}
                    disabled={
                      procesando
                    }
                    onChange={(
                      event,
                    ) =>
                      setNea(
                        event.target
                          .value,
                      )
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    procesando
                  }
                >
                  Buscar
                </button>
              </form>
            </section>

            {resultado && (
              <section className="room-result">
                <div>
                  <span>
                    Libro
                  </span>

                  <strong>
                    {
                      resultado.libro
                        .titulo
                    }
                  </strong>

                  <p>
                    {
                      resultado.libro
                        .autor
                    }
                  </p>
                </div>

                <div>
                  <span>
                    Código NEA
                  </span>

                  <strong>
                    {
                      resultado.nea
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Estado actual
                  </span>

                  <strong
                    className={
                      resultado.estado ===
                      'Disponible'
                        ? 'green-text'
                        : 'orange-text'
                    }
                  >
                    {
                      resultado.estado
                    }
                  </strong>
                </div>

                {resultado.estado ===
                'Disponible' ? (
                  <button
                    type="button"
                    className="room-action-button"
                    disabled={
                      procesando
                    }
                    onClick={
                      agregarEjemplar
                    }
                  >
                    Agregar a consulta
                  </button>
                ) : (
                  <button
                    type="button"
                    className="room-action-button"
                    disabled={
                      procesando
                    }
                    onClick={() =>
                      marcarComoDisponible(
                        resultado.nea,
                      )
                    }
                  >
                    Marcar como disponible
                  </button>
                )}
              </section>
            )}

            <section className="room-current-section">
              <div className="room-current-heading">
                <div>
                  <h2>
                    Ejemplares en uso
                  </h2>

                  <p>
                    Libros registrados
                    actualmente para esta
                    consulta.
                  </p>
                </div>

                <span className="room-current-count">
                  {
                    ejemplaresEnUso.length
                  }
                </span>
              </div>

              {ejemplaresEnUso.length ===
              0 ? (
                <div className="room-current-empty">
                  <BookOpen
                    size={24}
                  />

                  <p>
                    El usuario todavía
                    no tiene ejemplares
                    registrados.
                  </p>
                </div>
              ) : (
                <div className="room-current-list">
                  {ejemplaresEnUso.map(
                    (ejemplar) => (
                      <article
                        className="room-current-item"
                        key={
                          ejemplar.nea
                        }
                      >
                        <div>
                          <strong>
                            {
                              ejemplar.titulo
                            }
                          </strong>

                          <p>
                            {
                              ejemplar.autor
                            }
                          </p>

                          <span>
                            NEA{' '}
                            {
                              ejemplar.nea
                            }
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={
                            procesando
                          }
                          onClick={() =>
                            marcarComoDisponible(
                              ejemplar.nea,
                            )
                          }
                        >
                          Marcar como
                          disponible
                        </button>
                      </article>
                    ),
                  )}
                </div>
              )}
            </section>
          </>
        )}

        {mensaje && (
          <div className="room-message">
            {mensaje}
          </div>
        )}
      </div>
    </main>
  )
}

export default ConsultaSala
