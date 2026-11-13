import {
  ArrowLeft,
  BookOpen,
  MapPin,
  Pencil,
  Search,
  X,
} from 'lucide-react'

import {
  useMemo,
  useState,
  type FormEvent,
} from 'react'

import { Link } from 'react-router'

import { useBiblioteca } from '../context/useBiblioteca'

import {
  actualizarEjemplarApi,
  actualizarLibroApi,
} from '../services/bibliotecaApi'

import PortadaAutomatica from '../components/PortadaAutomatica'

function normalizarTexto(
  texto: string,
) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .trim()
}

function GestionCatalogo() {
  const {
    libros,
    recargarCatalogo,
  } = useBiblioteca()

  const [busqueda, setBusqueda] =
    useState('')

  const [
    libroEditando,
    setLibroEditando,
  ] = useState<number | null>(
    null,
  )

  const [
    ejemplarEditando,
    setEjemplarEditando,
  ] = useState<{
    libroId: number
    nea: string
    estado:
      | 'Disponible'
      | 'En uso'
  } | null>(null)

  const [titulo, setTitulo] =
    useState('')

  const [autor, setAutor] =
    useState('')

  const [categoria, setCategoria] =
    useState('')

  const [editorial, setEditorial] =
    useState('')

  const [anio, setAnio] =
    useState('')

  const [
    estadoFisico,
    setEstadoFisico,
  ] = useState('')

  const [
    ubicacionEjemplar,
    setUbicacionEjemplar,
  ] = useState('')

  const [mensaje, setMensaje] =
    useState('')

  const [guardando, setGuardando] =
    useState(false)

  const libroSeleccionado =
    libroEditando !== null
      ? libros.find(
          (libro) =>
            libro.id ===
            libroEditando,
        )
      : undefined

  const librosFiltrados =
    useMemo(() => {
      const texto =
        normalizarTexto(
          busqueda,
        )

      if (!texto) {
        return libros
      }

      return libros.filter(
        (libro) => {
          const campos = [
            libro.titulo,
            libro.autor,
            libro.categoria,
            libro.editorial,
            libro.ubicacion,
            String(libro.anio),

            ...libro.ejemplares.map(
              (ejemplar) =>
                ejemplar.nea,
            ),
          ]

          return campos.some(
            (campo) =>
              normalizarTexto(
                campo,
              ).includes(texto),
          )
        },
      )
    }, [
      busqueda,
      libros,
    ])

  const abrirEdicionLibro = (
    id: number,
  ) => {
    const libro =
      libros.find(
        (item) =>
          item.id === id,
      )

    if (!libro) {
      return
    }

    setLibroEditando(
      libro.id,
    )

    setTitulo(
      libro.titulo,
    )

    setAutor(
      libro.autor,
    )

    setCategoria(
      libro.categoria,
    )

    setEditorial(
      libro.editorial,
    )

    setAnio(
      String(libro.anio),
    )

    setMensaje('')
  }

  const cerrarEdicionLibro =
    () => {
      setLibroEditando(null)
      setMensaje('')
    }

  const abrirEdicionEjemplar = (
    libroId: number,
    nea: string,
  ) => {
    const libro =
      libros.find(
        (item) =>
          item.id === libroId,
      )

    const ejemplar =
      libro?.ejemplares.find(
        (item) =>
          item.nea === nea,
      )

    if (!ejemplar) {
      return
    }

    setEjemplarEditando({
      libroId,
      nea:
        ejemplar.nea,
      estado:
        ejemplar.estado,
    })

    setEstadoFisico(
      ejemplar.estadoFisico ??
        '',
    )

    setUbicacionEjemplar(
      ejemplar.ubicacion ??
        '',
    )

    setMensaje('')
  }

  const cerrarEdicionEjemplar =
    () => {
      setEjemplarEditando(null)
      setMensaje('')
    }

  const guardarCambiosLibro =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault()

      if (
        libroEditando === null
      ) {
        return
      }

      if (
        !titulo.trim() ||
        !autor.trim() ||
        !categoria.trim() ||
        !editorial.trim() ||
        !anio.trim()
      ) {
        setMensaje(
          'Completa todos los campos antes de guardar.',
        )

        return
      }

      const anioNumero =
        Number(anio)

      if (
        !Number.isInteger(
          anioNumero,
        ) ||
        anioNumero < 1000 ||
        anioNumero > 2100
      ) {
        setMensaje(
          'Ingresa un año válido.',
        )

        return
      }

      try {
        setGuardando(true)
        setMensaje('')

        await actualizarLibroApi(
          libroEditando,
          {
            titulo:
              titulo.trim(),

            autor:
              autor.trim(),

            categoria:
              categoria.trim(),

            editorial:
              editorial.trim(),

            anio:
              anioNumero,

            portada_url:
              libroSeleccionado
                ?.portada ??
              null,
          },
        )

        await recargarCatalogo()

        setMensaje(
          'Los cambios fueron guardados correctamente.',
        )
      } catch (error) {
        setMensaje(
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar el libro.',
        )
      } finally {
        setGuardando(false)
      }
    }

  const guardarCambiosEjemplar =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault()

      if (!ejemplarEditando) {
        return
      }

      if (
        !ubicacionEjemplar.trim()
      ) {
        setMensaje(
          'Ingresa la ubicación del ejemplar.',
        )

        return
      }

      try {
        setGuardando(true)
        setMensaje('')

        await actualizarEjemplarApi(
          ejemplarEditando.nea,
          {
            libro_id:
              ejemplarEditando.libroId,

            nea:
              ejemplarEditando.nea,

            estado_disponibilidad:
              ejemplarEditando.estado,

            estado_fisico:
              estadoFisico.trim() ||
              null,

            ubicacion:
              ubicacionEjemplar.trim(),
          },
        )

        await recargarCatalogo()

        setMensaje(
          'El ejemplar fue actualizado correctamente.',
        )
      } catch (error) {
        setMensaje(
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar el ejemplar.',
        )
      } finally {
        setGuardando(false)
      }
    }

  return (
    <main className="manage-page">
      <div className="manage-container">
        <Link
          to="/admin"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Volver al panel
        </Link>

        <div className="manage-heading">
          <div>
            <h1>
              Gestión del catálogo
            </h1>

            <p>
              Busca y revisa las fichas
              bibliográficas registradas
              en Bibliotech.
            </p>
          </div>

          <span className="manage-total">
            {libros.length}{' '}
            fichas
          </span>
        </div>

        <section className="manage-search-card">
          <div className="manage-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Buscar por título, autor, NEA, editorial..."
              value={busqueda}
              onChange={(event) =>
                setBusqueda(
                  event.target.value,
                )
              }
            />
          </div>
        </section>

        <div className="manage-results-header">
          <span>
            {
              librosFiltrados.length
            }{' '}
            {librosFiltrados.length ===
            1
              ? 'resultado'
              : 'resultados'}
          </span>
        </div>

        {librosFiltrados.length ===
        0 ? (
          <div className="manage-empty">
            <Search size={28} />

            <h2>
              No se encontraron
              registros
            </h2>

            <p>
              Intenta buscar con otro
              título, autor o código
              NEA.
            </p>
          </div>
        ) : (
          <div className="manage-list">
            {librosFiltrados.map(
              (libro) => {
                const disponibles =
                  libro.ejemplares.filter(
                    (ejemplar) =>
                      ejemplar.estado ===
                      'Disponible',
                  ).length

                return (
                  <article
                    className="manage-book-card"
                    key={libro.id}
                  >
                    <div className="manage-book-main">
                      <div className="manage-book-icon">
                        <BookOpen
                          size={22}
                        />
                      </div>

                      <div className="manage-book-info">
                        <span className="category-badge">
                          {
                            libro.categoria
                          }
                        </span>

                        <h2>
                          {
                            libro.titulo
                          }
                        </h2>

                        <p className="manage-author">
                          {
                            libro.autor
                          }
                        </p>

                        <div className="manage-book-meta">
                          <span>
                            {
                              libro.editorial
                            }
                          </span>

                          <span>
                            {
                              libro.anio
                            }
                          </span>

                          <span>
                            <MapPin
                              size={14}
                            />

                            {
                              libro.ubicacion
                            }
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="manage-edit-button"
                        onClick={() =>
                          abrirEdicionLibro(
                            libro.id,
                          )
                        }
                      >
                        <Pencil
                          size={16}
                        />

                        Editar ficha
                      </button>
                    </div>

                    <div className="manage-copies">
                      <div className="manage-copy-summary">
                        <strong>
                          {
                            libro
                              .ejemplares
                              .length
                          }
                        </strong>

                        <span>
                          Ejemplares
                        </span>
                      </div>

                      <div className="manage-copy-summary">
                        <strong className="green-text">
                          {
                            disponibles
                          }
                        </strong>

                        <span>
                          Disponibles
                        </span>
                      </div>

                      <div className="manage-nea-list">
                        {libro.ejemplares.map(
                          (
                            ejemplar,
                          ) => (
                            <button
                              type="button"
                              className={
                                ejemplar.estado ===
                                'Disponible'
                                  ? 'manage-nea manage-nea-button available'
                                  : 'manage-nea manage-nea-button used'
                              }
                              key={
                                ejemplar.nea
                              }
                              onClick={() =>
                                abrirEdicionEjemplar(
                                  libro.id,
                                  ejemplar.nea,
                                )
                              }
                            >
                              NEA{' '}
                              {
                                ejemplar.nea
                              }
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </article>
                )
              },
            )}
          </div>
        )}
      </div>

      {libroEditando !== null && (
        <div className="manage-modal-backdrop">
          <section className="manage-modal">
            <div className="manage-modal-header">
              <div>
                <h2>
                  Editar ficha
                </h2>

                <p>
                  Actualiza los datos
                  bibliográficos del libro.
                </p>
              </div>

              <button
                type="button"
                className="manage-close-button"
                onClick={
                  cerrarEdicionLibro
                }
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="manage-form"
              onSubmit={
                guardarCambiosLibro
              }
            > {libroSeleccionado && (
            <PortadaAutomatica
            libroId={
              libroSeleccionado.id
            }
            portadaActual={
              libroSeleccionado.portada
            }
            onActualizada={
              recargarCatalogo
            }
          />
        )}

              <label className="manage-field manage-field-full">
                <span>
                  Título
                </span>

                <input
                  type="text"
                  value={titulo}
                  disabled={
                    guardando
                  }
                  onChange={(event) =>
                    setTitulo(
                      event.target
                        .value,
                    )
                  }
                />
              </label>

              <label className="manage-field manage-field-full">
                <span>
                  Autor
                </span>

                <input
                  type="text"
                  value={autor}
                  disabled={
                    guardando
                  }
                  onChange={(event) =>
                    setAutor(
                      event.target
                        .value,
                    )
                  }
                />
              </label>

              <label className="manage-field">
                <span>
                  Categoría
                </span>

                <input
                  type="text"
                  value={categoria}
                  disabled={
                    guardando
                  }
                  onChange={(event) =>
                    setCategoria(
                      event.target
                        .value,
                    )
                  }
                />
              </label>

              <label className="manage-field">
                <span>
                  Editorial
                </span>

                <input
                  type="text"
                  value={editorial}
                  disabled={
                    guardando
                  }
                  onChange={(event) =>
                    setEditorial(
                      event.target
                        .value,
                    )
                  }
                />
              </label>

              <label className="manage-field">
                <span>
                  Año
                </span>

                <input
                  type="number"
                  min="1000"
                  max="2100"
                  value={anio}
                  disabled={
                    guardando
                  }
                  onChange={(event) =>
                    setAnio(
                      event.target
                        .value,
                    )
                  }
                />
              </label>

              <div className="manage-field">
                <span>
                  Ubicación
                </span>

                <input
                  type="text"
                  value={
                    libroSeleccionado
                      ?.ubicacion ??
                    ''
                  }
                  disabled
                />

                <small>
                  La ubicación se
                  administra por cada
                  ejemplar NEA.
                </small>
              </div>

              {mensaje && (
                <div className="manage-message">
                  {mensaje}
                </div>
              )}

              <div className="manage-form-actions">
                <button
                  type="button"
                  className="manage-cancel-button"
                  disabled={
                    guardando
                  }
                  onClick={
                    cerrarEdicionLibro
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="manage-save-button"
                  disabled={
                    guardando
                  }
                >
                  {guardando
                    ? 'Guardando...'
                    : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {ejemplarEditando && (
        <div className="manage-modal-backdrop">
          <section className="manage-modal manage-copy-modal">
            <div className="manage-modal-header">
              <div>
                <h2>
                  Editar ejemplar
                </h2>

                <p>
                  Actualiza los datos del
                  ejemplar físico.
                </p>
              </div>

              <button
                type="button"
                className="manage-close-button"
                onClick={
                  cerrarEdicionEjemplar
                }
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="manage-form"
              onSubmit={
                guardarCambiosEjemplar
              }
            >
              <label className="manage-field">
                <span>
                  Código NEA
                </span>

                <input
                  type="text"
                  value={
                    ejemplarEditando.nea
                  }
                  disabled
                />
              </label>

              <label className="manage-field">
                <span>
                  Disponibilidad
                </span>

                <input
                  type="text"
                  value={
                    ejemplarEditando.estado
                  }
                  disabled
                />

                <small>
                  La disponibilidad se
                  controla desde Consulta
                  en Sala.
                </small>
              </label>

              <label className="manage-field manage-field-full">
                <span>
                  Estado físico
                </span>

                <input
                  type="text"
                  placeholder="Ej. Bueno"
                  value={
                    estadoFisico
                  }
                  disabled={
                    guardando
                  }
                  onChange={(event) =>
                    setEstadoFisico(
                      event.target
                        .value,
                    )
                  }
                />
              </label>

              <label className="manage-field manage-field-full">
                <span>
                  Ubicación
                </span>

                <input
                  type="text"
                  placeholder="Ej. Segundo piso A-05"
                  value={
                    ubicacionEjemplar
                  }
                  disabled={
                    guardando
                  }
                  onChange={(event) =>
                    setUbicacionEjemplar(
                      event.target
                        .value,
                    )
                  }
                />
              </label>

              {mensaje && (
                <div className="manage-message">
                  {mensaje}
                </div>
              )}

              <div className="manage-form-actions">
                <button
                  type="button"
                  className="manage-cancel-button"
                  disabled={
                    guardando
                  }
                  onClick={
                    cerrarEdicionEjemplar
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="manage-save-button"
                  disabled={
                    guardando
                  }
                >
                  {guardando
                    ? 'Guardando...'
                    : 'Guardar ejemplar'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default GestionCatalogo
