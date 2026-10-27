import {
  ArrowRight,
  BookOpen,
  CircleCheckBig,
  MapPin,
} from 'lucide-react'

import { Link } from 'react-router'

import BookCard from '../components/BookCard'
import SearchBar from '../components/SearchBar'
import ServiceCard from '../components/ServiceCard'
import { useBiblioteca } from '../context/useBiblioteca'

function Home() {
  const { libros } = useBiblioteca()

  // Por ahora mostramos los primeros 4.
  // Cuando tengamos la base de datos podremos ordenar
  // realmente por fecha de incorporación.
  const librosRecientes = libros.slice(0, 4)

  return (
    <>
      <section className="hero-section">
        <div className="container hero-content">
          <span className="hero-label">
            BIBLIOTECA MUNICIPAL
          </span>

          <h1>
            Catálogo en línea de la
            <br />
            <span>
              Biblioteca de Santa Anita
            </span>
          </h1>

          <p>
            Consulta la disponibilidad de libros y
            ejemplares en tiempo real para su lectura
            dentro de nuestras instalaciones.
          </p>

          <SearchBar />
        </div>
      </section>

      <section
        className="service-section"
        id="informacion"
      >
        <div className="container">
          <h2>
            Información del servicio
          </h2>

          <p className="section-description">
            La Biblioteca Municipal ofrece consulta de
            su colección bibliográfica dentro de las
            instalaciones.
          </p>

          <div className="service-grid">
            <ServiceCard
              icon={BookOpen}
              title="Consulta en sala"
              description="Los libros son de uso exclusivo dentro de la biblioteca. No se realizan préstamos domiciliarios."
            />

            <ServiceCard
              icon={CircleCheckBig}
              title="Disponibilidad en tiempo real"
              description="Consulta cuántos ejemplares hay disponibles antes de acercarte a la biblioteca."
            />

            <ServiceCard
              icon={MapPin}
              title="Ubicación por estante"
              description="Cada libro indica su ubicación física para facilitar su localización en sala."
            />
          </div>
        </div>
      </section>

      <section className="recent-section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <h2>
                Adquisiciones recientes
              </h2>

              <p>
                Lo último incorporado al catálogo
              </p>
            </div>

            <Link
              to="/catalogo"
              className="catalog-link"
            >
              Ver todo el catálogo
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="book-grid">
            {librosRecientes.map((libro) => (
              <BookCard
                key={libro.id}
                book={libro}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home