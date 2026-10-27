import {
  Clock3,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

function Footer() {
  return (
    <footer className="site-footer" id="contacto">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src="/logo-santa-anita.png"
              alt="Municipalidad de Santa Anita"
            />
          </div>

          <p>
            Sistema de consulta de la Biblioteca Municipal de
            Santa Anita. Consulta de libros y ejemplares para
            lectura dentro de las instalaciones.
          </p>
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>

          <p>
            <MapPin size={17} />
            Dirección de la biblioteca
          </p>

          <p>
            <Clock3 size={17} />
            Horario de atención
          </p>

          <p>
            <Phone size={17} />
            Teléfono institucional
          </p>

          <p>
            <Mail size={17} />
            Correo institucional
          </p>
        </div>

        <div className="footer-section">
          <h3>Servicio</h3>

          <p>
            Los libros son de uso exclusivo dentro de la
            biblioteca. No se realizan préstamos
            domiciliarios.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Municipalidad Distrital de Santa Anita ·
        Biblioteca Municipal
      </div>
    </footer>
  )
}

export default Footer
