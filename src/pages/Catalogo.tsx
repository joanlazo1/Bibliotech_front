import {
  useMemo,
  useState,
  type FormEvent,
} from 'react'

import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import { useSearchParams } from 'react-router'

import BookCard from '../components/BookCard'
import { useBiblioteca } from '../context/useBiblioteca'

type FiltroDisponibilidad =
  | 'Todos'
  | 'Disponibles'
  | 'No disponibles'

function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function Catalogo() {
  const { libros } = useBiblioteca()

  const [searchParams, setSearchParams] =
    useSearchParams()

  const busquedaActual =
    searchParams.get('q') ?? ''

  const [textoInput, setTextoInput] =
    useState(busquedaActual)

  const [
    mostrarFiltros,
    setMostrarFiltros,
  ] = useState(false)

  const [
    categoriaFiltro,
    setCategoriaFiltro,
  ] = useState('Todas')

  const [
    disponibilidadFiltro,
    setDisponibilidadFiltro,
  ] =
    useState<FiltroDisponibilidad>(
      'Todos',
    )

  const categorias = useMemo(() => {
    return Array.from(
      new Set(
        libros.map(
          (libro) => libro.categoria,
        ),
      ),
    ).sort()
  }, [libros])

  const librosFiltrados = useMemo(() => {
    const textoBusqueda =
      normalizarTexto(busquedaActual)

    return libros.filter((libro) => {
      const coincideBusqueda =
        !textoBusqueda ||
        [
          libro.titulo,
          libro.autor,
          libro.categoria,
          libro.editorial,
          libro.ubicacion,
        ].some((campo) =>
          normalizarTexto(
            campo,
          ).includes(textoBusqueda),
        )

      const coincideCategoria =
        categoriaFiltro === 'Todas' ||
        libro.categoria ===
          categoriaFiltro

      const tieneDisponibles =
        libro.ejemplares.some(
          (ejemplar) =>
            ejemplar.estado ===
            'Disponible',
        )

      const coincideDisponibilidad =
        disponibilidadFiltro ===
          'Todos' ||
        (disponibilidadFiltro ===
          'Disponibles' &&
          tieneDisponibles) ||
        (disponibilidadFiltro ===
          'No disponibles' &&
          !tieneDisponibles)

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideDisponibilidad
      )
    })
  }, [
    libros,
    busquedaActual,
    categoriaFiltro,
    disponibilidadFiltro,
  ])

  const manejarBusqueda = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const texto = textoInput.trim()

    if (!texto) {
      setSearchParams({})
      return
    }

    setSearchParams({
      q: texto,
    })
  }

  const limpiarFiltros = () => {
    setCategoriaFiltro('Todas')
    setDisponibilidadFiltro('Todos')
  }

  const hayFiltrosActivos =
    categoriaFiltro !== 'Todas' ||
    disponibilidadFiltro !== 'Todos'

  return (
    <section className="catalog-page">
      <div className="container">
        <div className="catalog-title">
          <h1>Catálogo</h1>

          <p>
            {librosFiltrados.length}{' '}
            {librosFiltrados.length === 1
              ? 'libro encontrado'
              : 'libros encontrados'}
          </p>
        </div>

        <form
          className="catalog-toolbar"
          onSubmit={manejarBusqueda}
        >
          <div className="catalog-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Buscar por título, autor, categoría..."
              value={textoInput}
              onChange={(event) =>
                setTextoInput(
                  event.target.value,
                )
              }
              aria-label="Buscar libros"
            />
          </div>

          <button
            type="submit"
            className="catalog-search-button"
          >
            Buscar
          </button>

          <button
            type="button"
            className={
              mostrarFiltros ||
              hayFiltrosActivos
                ? 'filter-button active'
                : 'filter-button'
            }
            onClick={() =>
              setMostrarFiltros(
                (actual) => !actual,
              )
            }
          >
            <SlidersHorizontal
              size={18}
            />

            Filtros
          </button>
        </form>

        {mostrarFiltros && (
          <section className="catalog-filters">
            <div className="catalog-filter-field">
              <label htmlFor="categoria">
                Categoría
              </label>

              <select
                id="categoria"
                value={categoriaFiltro}
                onChange={(event) =>
                  setCategoriaFiltro(
                    event.target.value,
                  )
                }
              >
                <option value="Todas">
                  Todas las categorías
                </option>

                {categorias.map(
                  (categoria) => (
                    <option
                      value={categoria}
                      key={categoria}
                    >
                      {categoria}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="catalog-filter-field">
              <label htmlFor="disponibilidad">
                Disponibilidad
              </label>

              <select
                id="disponibilidad"
                value={
                  disponibilidadFiltro
                }
                onChange={(event) =>
                  setDisponibilidadFiltro(
                    event.target
                      .value as FiltroDisponibilidad,
                  )
                }
              >
                <option value="Todos">
                  Todos
                </option>

                <option value="Disponibles">
                  Con ejemplares disponibles
                </option>

                <option value="No disponibles">
                  Sin ejemplares disponibles
                </option>
              </select>
            </div>

            {hayFiltrosActivos && (
              <button
                type="button"
                className="clear-filters-button"
                onClick={limpiarFiltros}
              >
                <X size={16} />
                Limpiar filtros
              </button>
            )}
          </section>
        )}

        {hayFiltrosActivos && (
          <div className="active-filters-summary">
            <span>
              Filtros aplicados:
            </span>

            {categoriaFiltro !==
              'Todas' && (
              <strong>
                {categoriaFiltro}
              </strong>
            )}

            {disponibilidadFiltro !==
              'Todos' && (
              <strong>
                {disponibilidadFiltro ===
                'Disponibles'
                  ? 'Con disponibilidad'
                  : 'Sin disponibilidad'}
              </strong>
            )}
          </div>
        )}

        {librosFiltrados.length > 0 ? (
          <div className="book-grid">
            {librosFiltrados.map(
              (libro) => (
                <BookCard
                  key={libro.id}
                  book={libro}
                />
              ),
            )}
          </div>
        ) : (
          <div className="catalog-empty">
            <Search size={30} />

            <h2>
              No se encontraron libros
            </h2>

            <p>
              Intenta cambiar la búsqueda
              o los filtros seleccionados.
            </p>

            {hayFiltrosActivos && (
              <button
                type="button"
                className="clear-filters-button"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Catalogo
