import {
  MapPin,
} from 'lucide-react'

import {
  Link,
} from 'react-router'

import type {
  Libro,
} from '../types/Libro'

import BookCover from './BookCover'

interface BookCardProps {
  book: Libro
}

function BookCard({
  book,
}: BookCardProps) {
  const totalEjemplares =
    book.ejemplares.length

  const disponibles =
    book.ejemplares.filter(
      (ejemplar) =>
        ejemplar.estado ===
        'Disponible',
    ).length

  return (
    <Link
      to={`/libro/${book.id}`}
      className="book-card-link"
    >
      <article className="book-card">
        <BookCover
          titulo={
            book.titulo
          }
          autor={
            book.autor
          }
          categoria={
            book.categoria
          }
          portada={
            book.portada
          }
        />

        <div className="book-card-content">
          <h3>
            {book.titulo}
          </h3>

          <p className="book-author">
            {book.autor}
          </p>

          <span className="category-badge">
            {book.categoria}
          </span>

          <div className="book-location">
            <MapPin size={14} />

            <span>
              {book.ubicacion ||
                'Ubicación no registrada'}
            </span>
          </div>
        </div>

        <div className="book-card-footer">
          <span
            className={
              disponibles > 0
                ? 'book-available'
                : 'book-unavailable'
            }
          >
            <span className="availability-dot" />

            {disponibles === 1
              ? '1 disponible'
              : `${disponibles} disponibles`}
          </span>

          <span className="book-copy-total">
            {totalEjemplares ===
            1
              ? '1 ejemplar'
              : `${totalEjemplares} ejemplares`}
          </span>
        </div>
      </article>
    </Link>
  )
}

export default BookCard
