import { NavLink } from 'react-router'

function Navbar() {
  return (
    <nav className="main-navbar">
      <div className="container navbar-content">
        <div className="nav-links">
          <NavLink to="/" end>
            Inicio
          </NavLink>

          <NavLink to="/catalogo">
            Catálogo
          </NavLink>

          <a href="/#informacion">
            Información del servicio
          </a>

          <a href="/#contacto">
            Contacto
          </a>
        </div>

        <NavLink className="staff-link" to="/login">
          Acceso al personal
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
