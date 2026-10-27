import {
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarDays,
  MapPin,
} from 'lucide-react'

import { Link, useParams } from 'react-router'

import { useBiblioteca } from '../context/useBiblioteca'

function DetalleLibro() {
  const { id } = useParams()

  const { libros } = useBiblioteca()

  const libro = libros.find(
    (item) => item.id === Number(id),
  )

  if (!libro) {
    return (
      <section className="detail-page">
        <div className="container">
          <div className="book-not-found">
            <h1>Libro no encontrado</h1>

            <p>
              El libro que intentas consultar no existe.
            </p>

            <Link
              to="/catalogo"
              className="back-link"
            >
              <ArrowLeft size={17} />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const totalEjemplares =
    libro.ejemplares.length

  const disponibles =
    libro.ejemplares.filter(
      (ejemplar) =>
        ejemplar.estado === 'Disponible',
    ).length

  const enUso =
    libro.ejemplares.filter(
      (ejemplar) =>
        ejemplar.estado === 'En uso',
    ).length

  return (
    <section className="detail-page">
      <div className="container">
        <Link
          to="/catalogo"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Volver al catálogo
        </Link>

        <div className="book-detail">
          <div className="book-detail-cover">
            {libro.portada ? (
              <img
                src={libro.portada}
                alt={`Portada de ${libro.titulo}`}
              />
            ) : (
              <div
                className={`detail-generated-cover ${
                  libro.color ?? 'blue'
                }`}
              >
                <span className="book-category-cover">
                  {libro.categoria.toUpperCase()}
                </span>

                <div className="detail-cover-content">
                  <BookOpen size={34} />

                  <h2>
                    {libro.titulo}
                  </h2>

                  <p>
                    {libro.autor}
                  </p>
                </div>

                <span className="library-mark">
                  BIBLIOTECA MUNICIPAL
                </span>
              </div>
            )}
          </div>

          <div className="book-detail-info">
            <span className="category-badge">
              {libro.categoria}
            </span>

            <h1>
              {libro.titulo}
            </h1>

            <p className="detail-author">
              {libro.autor}
            </p>

            <div className="detail-metadata">
              <div>
                <Building2 size={18} />

                <span>
                  <strong>
                    Editorial
                  </strong>

                  {libro.editorial}
                </span>
              </div>

              <div>
                <CalendarDays size={18} />

                <span>
                  <strong>
                    Año
                  </strong>

                  {libro.anio}
                </span>
              </div>

              <div>
                <MapPin size={18} />

                <span>
                  <strong>
                    Ubicación
                  </strong>

                  {libro.ubicacion}
                </span>
              </div>
            </div>

            <div className="availability-summary">
              <div>
                <strong>
                  {totalEjemplares}
                </strong>

                <span>
                  Ejemplares
                </span>
              </div>

              <div>
                <strong className="green-text">
                  {disponibles}
                </strong>

                <span>
                  Disponibles
                </span>
              </div>

              <div>
                <strong className="orange-text">
                  {enUso}
                </strong>

                <span>
                  En uso
                </span>
              </div>
            </div>

            <div className="room-notice">
              <BookOpen size={20} />

              <div>
                <strong>
                  Consulta únicamente en sala
                </strong>

                <p>
                  Los ejemplares deben utilizarse
                  dentro de las instalaciones de
                  la biblioteca.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="copies-section">
          <h2>
            Ejemplares
          </h2>

          <p>
            Cada ejemplar físico se identifica
            mediante su código NEA y mantiene
            su propio estado de disponibilidad.
          </p>

          <div className="copies-list">
            {libro.ejemplares.map(
              (ejemplar) => (
                <div
                  className="copy-row"
                  key={ejemplar.nea}
                >
                  <div>
                    <span className="copy-label">
                      Código NEA
                    </span>

                    <strong>
                      {ejemplar.nea}
                    </strong>
                  </div>

                  <div>
                    <span className="copy-label">
                      Estado
                    </span>

                    <span
                      className={
                        ejemplar.estado ===
                        'Disponible'
                          ? 'copy-status available-status'
                          : 'copy-status used-status'
                      }
                    >
                      {ejemplar.estado}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </section>
  )
}

export default DetalleLibro
