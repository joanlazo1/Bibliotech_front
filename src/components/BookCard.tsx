import { BookOpen, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import type { Libro } from '../types/Libro'

interface BookCardProps {
  book: Libro
}

function BookCard({ book }: BookCardProps) {
  const totalEjemplares = book.ejemplares.length

  const disponibles = book.ejemplares.filter(
    (ejemplar) => ejemplar.estado === 'Disponible',
  ).length

  return (
    <Link
      to={`/libro/${book.id}`}
      className="book-card-link"
    >
      <article className="book-card">
        {book.portada ? (
          <div className="book-cover">
            <img
              src={book.portada}
              alt={`Portada de ${book.titulo}`}
            />
          </div>
        ) : (
          <div
            className={`book-cover generated-cover ${book.color ?? 'blue'}`}
          >
            <span className="book-category-cover">
              {book.categoria.toUpperCase()}
            </span>

            <div className="generated-book-content">
              <BookOpen size={25} />

              <h3>{book.titulo}</h3>

              <p>{book.autor}</p>
            </div>

            <span className="library-mark">
              BIBLIOTECA MUNICIPAL
            </span>
          </div>
        )}

        <div className="book-info">
          <h3>{book.titulo}</h3>

          <p className="book-author">
            {book.autor}
          </p>

          <span className="category-badge">
            {book.categoria}
          </span>

          <div className="book-location">
            <MapPin size={16} />

            <span>
              {book.ubicacion}
            </span>
          </div>

          <div className="book-availability">
            <span className="available">
              <span className="green-dot" />

              {disponibles}{' '}
              {disponibles === 1
                ? 'disponible'
                : 'disponibles'}
            </span>

            <span>
              {totalEjemplares}{' '}
              {totalEjemplares === 1
                ? 'ejemplar'
                : 'ejemplares'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default BookCard
