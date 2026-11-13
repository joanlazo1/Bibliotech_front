import {
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  LogOut,
  Search,
  Upload,
  Users,
  X,
} from 'lucide-react'

import {
  useState,
  type ChangeEvent,
} from 'react'

import { Link } from 'react-router'

import { useBiblioteca } from '../context/useBiblioteca'
import { useAuth } from '../context/useAuth'

import {
  confirmarExcelApi,
  previsualizarExcelApi,
  type ConfirmacionImportacion,
  type PreviewImportacion,
} from '../services/importacionesApi'

function PanelAdmin() {
  const {
    libros,
    recargarCatalogo,
  } = useBiblioteca()

  const {
    cerrarSesion,
  } = useAuth()

  const [
    archivoSeleccionado,
    setArchivoSeleccionado,
  ] = useState<File | null>(
    null,
  )

  const [
    preview,
    setPreview,
  ] =
    useState<PreviewImportacion | null>(
      null,
    )

  const [
    resultadoImportacion,
    setResultadoImportacion,
  ] =
    useState<ConfirmacionImportacion | null>(
      null,
    )

  const [
    analizando,
    setAnalizando,
  ] = useState(false)

  const [
    importando,
    setImportando,
  ] = useState(false)

  const [
    errorImportacion,
    setErrorImportacion,
  ] = useState('')

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

  const seleccionarExcel =
    async (
      event:
        ChangeEvent<HTMLInputElement>,
    ) => {
      const archivo =
        event.target.files?.[0]

      if (!archivo) {
        return
      }

      try {
        setAnalizando(true)
        setErrorImportacion('')
        setPreview(null)

        setResultadoImportacion(
          null,
        )

        setArchivoSeleccionado(
          archivo,
        )

        const resultado =
          await previsualizarExcelApi(
            archivo,
          )

        setPreview(
          resultado,
        )
      } catch (error) {
        setArchivoSeleccionado(
          null,
        )

        setErrorImportacion(
          error instanceof Error
            ? error.message
            : 'No se pudo analizar el archivo.',
        )
      } finally {
        setAnalizando(false)

        event.target.value = ''
      }
    }

  const cancelarImportacion =
    () => {
      if (importando) {
        return
      }

      setPreview(null)

      setArchivoSeleccionado(
        null,
      )

      setErrorImportacion('')
    }

  const confirmarImportacion =
    async () => {
      if (!archivoSeleccionado) {
        setErrorImportacion(
          'No se encontró el archivo seleccionado.',
        )

        return
      }

      try {
        setImportando(true)

        setErrorImportacion('')

        const resultado =
          await confirmarExcelApi(
            archivoSeleccionado,
          )

        setResultadoImportacion(
          resultado,
        )

        setPreview(null)

        setArchivoSeleccionado(
          null,
        )

        await recargarCatalogo()
      } catch (error) {
        setErrorImportacion(
          error instanceof Error
            ? error.message
            : 'No se pudo importar el inventario.',
        )
      } finally {
        setImportando(false)
      }
    }

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
            onClick={
              cerrarSesion
            }
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
            <BookOpen
              size={21}
            />

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
                Actualiza los registros
                de Bibliotech.
              </p>
            </div>
          </div>

          <div className="admin-actions">
            <article className="admin-action-card">
              <div className="admin-action-icon">
                <Upload
                  size={25}
                />
              </div>

              <h3>
                Importar archivo Excel
              </h3>

              <p>
                Carga una nueva versión
                del inventario
                proporcionado por la
                biblioteca.
              </p>

              <label className="file-upload-button">
                {analizando
                  ? 'Analizando...'
                  : 'Seleccionar Excel'}

                <input
                  type="file"
                  accept=".xlsx,.xlsb"
                  disabled={
                    analizando ||
                    importando
                  }
                  onChange={
                    seleccionarExcel
                  }
                />
              </label>

              {errorImportacion &&
                !preview && (
                  <p className="import-error">
                    {
                      errorImportacion
                    }
                  </p>
                )}
            </article>

            <article className="admin-action-card">
              <div className="admin-action-icon">
                <Search
                  size={25}
                />
              </div>

              <h3>
                Buscar y editar
                registros
              </h3>

              <p>
                Consulta la información
                de libros y ejemplares
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
                <Users
                  size={25}
                />
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

      {preview && (
        <div className="manage-modal-backdrop">
          <section className="import-preview-modal">
            <div className="manage-modal-header">
              <div>
                <h2>
                  Vista previa de
                  importación
                </h2>

                <p>
                  {preview.archivo}
                </p>
              </div>

              <button
                type="button"
                className="manage-close-button"
                disabled={
                  importando
                }
                onClick={
                  cancelarImportacion
                }
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="import-preview-content">
              <div className="import-summary-grid">
                <article>
                  <strong>
                    {
                      preview.resumen
                        .filasInventario
                    }
                  </strong>

                  <span>
                    Filas detectadas
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      preview.resumen
                        .ejemplaresImportables
                    }
                  </strong>

                  <span>
                    Ejemplares
                    importables
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      preview.resumen
                        .fichasEstimadas
                    }
                  </strong>

                  <span>
                    Fichas estimadas
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      preview.resumen
                        .neaDuplicados
                    }
                  </strong>

                  <span>
                    NEA duplicados
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      preview.resumen
                        .neaVacios
                    }
                  </strong>

                  <span>
                    NEA vacíos
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      preview.resumen
                        .aniosInvalidos
                    }
                  </strong>

                  <span>
                    Años para revisar
                  </span>
                </article>
              </div>

              <div className="import-preview-section">
                <h3>
                  Calidad de datos
                </h3>

                <div className="import-quality-list">
                  <span>
                    Años válidos:{' '}
                    <strong>
                      {
                        preview.resumen
                          .aniosValidos
                      }
                    </strong>
                  </span>

                  <span>
                    Años sin dato:{' '}
                    <strong>
                      {
                        preview.resumen
                          .aniosSinDato
                      }
                    </strong>
                  </span>

                  <span>
                    Autores vacíos:{' '}
                    <strong>
                      {
                        preview.resumen
                          .autoresVacios
                      }
                    </strong>
                  </span>

                  <span>
                    Editoriales vacías:{' '}
                    <strong>
                      {
                        preview.resumen
                          .editorialesVacias
                      }
                    </strong>
                  </span>

                  <span>
                    Estados físicos
                    vacíos:{' '}
                    <strong>
                      {
                        preview.resumen
                          .estadosFisicosVacios
                      }
                    </strong>
                  </span>
                </div>
              </div>

              <div className="import-preview-section">
                <h3>
                  Observaciones
                </h3>

                <p>
                  {
                    preview.totalObservaciones
                  }{' '}
                  observaciones
                  detectadas.
                </p>

                {preview.observaciones
                  .slice(0, 10)
                  .map(
                    (
                      observacion,
                      index,
                    ) => (
                      <div
                        className="import-observation"
                        key={`${observacion.tipo}-${index}`}
                      >
                        <strong>
                          {
                            observacion.tipo
                          }
                        </strong>

                        <span>
                          {
                            observacion.detalle
                          }
                        </span>
                      </div>
                    ),
                  )}

                {preview.totalObservaciones >
                  10 && (
                  <p className="import-more">
                    Se muestran las
                    primeras 10
                    observaciones.
                  </p>
                )}
              </div>

              <div className="import-preview-warning">
                Los registros con NEA
                duplicado o vacío no se
                importarán
                automáticamente.
              </div>

              {errorImportacion && (
                <p className="import-error">
                  {
                    errorImportacion
                  }
                </p>
              )}
            </div>

            <div className="import-preview-actions">
              <button
                type="button"
                className="manage-cancel-button"
                disabled={
                  importando
                }
                onClick={
                  cancelarImportacion
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="import-confirm-button"
                disabled={
                  importando
                }
                onClick={
                  confirmarImportacion
                }
              >
                {importando
                  ? 'Importando...'
                  : `Confirmar ${preview.resumen.ejemplaresImportables} ejemplares`}
              </button>
            </div>
          </section>
        </div>
      )}

      {resultadoImportacion && (
        <div className="manage-modal-backdrop">
          <section className="import-preview-modal import-result-modal">
            <div className="manage-modal-header">
              <div>
                <h2>
                  Importación completada
                </h2>

                <p>
                  El inventario fue
                  procesado por
                  Bibliotech.
                </p>
              </div>

              <button
                type="button"
                className="manage-close-button"
                onClick={() =>
                  setResultadoImportacion(
                    null,
                  )
                }
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="import-preview-content">
              <div className="import-success-box">
                <CheckCircle2
                  size={28}
                />

                <div>
                  <strong>
                    Inventario importado
                    correctamente
                  </strong>

                  <span>
                    Los registros ya se
                    encuentran guardados
                    en Supabase.
                  </span>
                </div>
              </div>

              <div className="import-result-grid">
                <article>
                  <strong>
                    {
                      resultadoImportacion
                        .resultado
                        .fichasDetectadas
                    }
                  </strong>

                  <span>
                    Fichas detectadas
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      resultadoImportacion
                        .resultado
                        .librosCreados
                    }
                  </strong>

                  <span>
                    Fichas nuevas
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      resultadoImportacion
                        .resultado
                        .ejemplaresCreados
                    }
                  </strong>

                  <span>
                    Ejemplares nuevos
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      resultadoImportacion
                        .resultado
                        .ejemplaresActualizados
                    }
                  </strong>

                  <span>
                    Ejemplares
                    actualizados
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      resultadoImportacion
                        .resultado
                        .registrosOmitidos
                    }
                  </strong>

                  <span>
                    Registros omitidos
                  </span>
                </article>

                <article>
                  <strong>
                    {
                      resultadoImportacion
                        .resultado
                        .observaciones
                    }
                  </strong>

                  <span>
                    Observaciones
                  </span>
                </article>
              </div>
            </div>

            <div className="import-preview-actions">
              <button
                type="button"
                className="import-confirm-button"
                onClick={() =>
                  setResultadoImportacion(
                    null,
                  )
                }
              >
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default PanelAdmin
