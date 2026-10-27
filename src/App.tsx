import {
  Route,
  Routes,
} from 'react-router'

import PublicLayout from './layouts/PublicLayout'

import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import DetalleLibro from './pages/DetalleLibro'
import Login from './pages/Login'
import PanelAdmin from './pages/PanelAdmin'
import ConsultaSala from './pages/ConsultaSala'
import GestionCatalogo from './pages/GestionCatalogo'

function App() {
  return (
    <Routes>
      <Route
        element={<PublicLayout />}
      >
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/catalogo"
          element={<Catalogo />}
        />

        <Route
          path="/libro/:id"
          element={<DetalleLibro />}
        />
      </Route>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/admin"
        element={<PanelAdmin />}
      />

      <Route
        path="/admin/catalogo"
        element={
          <GestionCatalogo />
        }
      />

      <Route
        path="/consulta-sala"
        element={
          <ConsultaSala />
        }
      />
    </Routes>
  )
}

export default App
