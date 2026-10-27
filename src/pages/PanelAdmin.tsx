import {
  BookOpen,
  FileSpreadsheet,
  LogOut,
  Search,
  Upload,
  Users,
} from 'lucide-react'

import { Link } from 'react-router'

import { useBiblioteca } from '../context/useBiblioteca'

function PanelAdmin() {
  const { libros } =
    useBiblioteca()

  const totalLibros =
    libros.length

  const totalEjemplares =
    libros.reduce(
      (total, libro) =>
        total +
        libro.ejemplares.length,
      0,
    )

  const disponibles =
    libros.reduce(
      (total, libro) =>
        total +
        libro.ejemplares.filter(
          (ejemplar) =>
            ejemplar.estado ===
            'Disponible',
        ).length,
      0,
    )

  const enUso =
    totalEjemplares -
    disponibles

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <img
              src="/logo-santa-anita.png"
              alt="Municipalidad de Santa Anita"
            />

            <div>
              <strong>
                Bibliotech
              </strong>

              <span>
                Panel administrativo
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="admin-exit"
          >
            <LogOut size={18} />
            Salir
          </Link>
        </div>
      </header>

      <div className="admin-container">
        <div className="admin-heading">
          <div>
            <h1>
              Panel administrativo
            </h1>

            <p>
              Gestión del catálogo de la
              Biblioteca Municipal.
            </p>
          </div>

          <Link
            to="/consulta-sala"
            className="primary-admin-button"
          >
            <Users size={18} />
            Consulta en sala
          </Link>
        </div>

        <section className="admin-stats">
          <article>
            <BookOpen size={21} />

            <div>
              <strong>
                {totalLibros}
              </strong>

              <span>
                Fichas bibliográficas
              </span>
            </div>
          </article>

          <article>
            <FileSpreadsheet
              size={21}
            />

            <div>
              <strong>
                {totalEjemplares}
              </strong>

              <span>
                Ejemplares
              </span>
            </div>
          </article>

          <article>
            <span className="admin-green-dot" />

            <div>
              <strong>
                {disponibles}
              </strong>

              <span>
                Disponibles
              </span>
            </div>
          </article>

          <article>
            <span className="admin-orange-dot" />

            <div>
              <strong>
                {enUso}
              </strong>

              <span>
                En uso
              </span>
            </div>
          </article>
        </section>

        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2>
                Gestión del catálogo
              </h2>

              <p>
                Actualiza y administra los
                registros de Bibliotech.
              </p>
            </div>
          </div>

          <div className="admin-actions">
            <article className="admin-action-card">
              <div className="admin-action-icon">
                <Upload size={25} />
              </div>

              <h3>
                Importar archivo Excel
              </h3>

              <p>
                Carga una nueva versión del
                inventario proporcionado por
                la biblioteca.
              </p>

              <label className="file-upload-button">
                Seleccionar Excel

                <input
                  type="file"
                  accept=".xlsx,.xls"
                />
              </label>
            </article>

            <article className="admin-action-card">
              <div className="admin-action-icon">
                <Search size={25} />
              </div>

              <h3>
                Buscar y editar registros
              </h3>

              <p>
                Consulta la información de
                libros y ejemplares
                registrados.
              </p>

              <Link
                to="/admin/catalogo"
                className="admin-action-link"
              >
                Gestionar catálogo
              </Link>
            </article>

            <article className="admin-action-card">
              <div className="admin-action-icon">
                <Users size={25} />
              </div>

              <h3>
                Consulta en sala
              </h3>

              <p>
                Registra los ejemplares
                utilizados dentro de la
                biblioteca.
              </p>

              <Link
                to="/consulta-sala"
                className="admin-action-link"
              >
                Abrir módulo
              </Link>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}

export default PanelAdmin
