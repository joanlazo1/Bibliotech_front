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

type TipoIdentificacion =
  | 'Carné de biblioteca'
  | 'DNI'

function ConsultaSala() {
  const {
    buscarEjemplarPorNea,
    cambiarEstadoEjemplar,
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
    consultaActiva,
    setConsultaActiva,
  ] = useState(false)

  const [nea, setNea] =
    useState('')

  const [
    neaEncontrado,
    setNeaEncontrado,
  ] = useState<string | null>(null)

  const [
    ejemplaresEnConsulta,
    setEjemplaresEnConsulta,
  ] = useState<string[]>([])

  const [mensaje, setMensaje] =
    useState('')

  const resultado = neaEncontrado
    ? buscarEjemplarPorNea(
        neaEncontrado,
      )
    : null

  const iniciarConsulta = (
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
      tipoIdentificacion === 'DNI' &&
      !/^\d{8}$/.test(
        identificacion,
      )
    ) {
      setMensaje(
        'El DNI debe contener 8 dígitos.',
      )
      return
    }

    setConsultaActiva(true)

    setMensaje(
      'Consulta iniciada correctamente.',
    )
  }

  const buscarEjemplar = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const codigo = nea.trim()

    if (!codigo) {
      setNeaEncontrado(null)

      setMensaje(
        'Ingresa un código NEA.',
      )

      return
    }

    const ejemplar =
      buscarEjemplarPorNea(codigo)

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

  const agregarEjemplar = () => {
    if (!resultado) {
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

    cambiarEstadoEjemplar(
      resultado.nea,
      'En uso',
    )

    setEjemplaresEnConsulta(
      (actuales) => [
        ...actuales,
        resultado.nea,
      ],
    )

    setMensaje(
      `El ejemplar NEA ${resultado.nea} fue agregado a la consulta.`,
    )

    setNea('')
    setNeaEncontrado(null)
  }

  const marcarComoDisponible = (
    codigoNea: string,
  ) => {
    cambiarEstadoEjemplar(
      codigoNea,
      'Disponible',
    )

    setEjemplaresEnConsulta(
      (actuales) =>
        actuales.filter(
          (codigo) =>
            codigo !== codigoNea,
        ),
    )

    setMensaje(
      `El ejemplar NEA ${codigoNea} fue marcado como disponible.`,
    )

    if (
      neaEncontrado === codigoNea
    ) {
      setNeaEncontrado(
        codigoNea,
      )
    }
  }

  const finalizarConsulta = () => {
    if (
      ejemplaresEnConsulta.length >
      0
    ) {
      setMensaje(
        'Debes marcar como disponibles todos los ejemplares de esta consulta antes de finalizarla.',
      )

      return
    }

    setConsultaActiva(false)

    setNumeroIdentificacion('')
    setNea('')
    setNeaEncontrado(null)

    setMensaje(
      'Consulta finalizada correctamente.',
    )
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
              >
                Iniciar consulta
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

                <button type="submit">
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
                    ejemplaresEnConsulta.length
                  }
                </span>
              </div>

              {ejemplaresEnConsulta.length ===
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
                  {ejemplaresEnConsulta.map(
                    (codigoNea) => {
                      const ejemplar =
                        buscarEjemplarPorNea(
                          codigoNea,
                        )

                      if (
                        !ejemplar
                      ) {
                        return null
                      }

                      return (
                        <article
                          className="room-current-item"
                          key={
                            codigoNea
                          }
                        >
                          <div>
                            <strong>
                              {
                                ejemplar
                                  .libro
                                  .titulo
                              }
                            </strong>

                            <p>
                              {
                                ejemplar
                                  .libro
                                  .autor
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
                            onClick={() =>
                              marcarComoDisponible(
                                codigoNea,
                              )
                            }
                          >
                            Marcar como
                            disponible
                          </button>
                        </article>
                      )
                    },
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