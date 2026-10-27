import { Search } from 'lucide-react'
import { useState } from 'react'

function Header() {
  const [search, setSearch] = useState('')

  return (
    <>
      <header className="top-header">
        <div className="container header-content">
          <a className="municipal-logo" href="/">
            <img
              src="/logo-santa-anita.png"
              alt="Municipalidad de Santa Anita"
            />
          </a>

          <form
            className="header-search"
            onSubmit={(e) => {
              e.preventDefault()
              console.log(search)
            }}
          >
            <input
              type="text"
              placeholder="Buscar en la Biblioteca"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit" aria-label="Buscar">
              <Search size={19} />
            </button>
          </form>
        </div>
      </header>

      <div className="breadcrumb-bar">
        <div className="container breadcrumb">
          <a href="/">Inicio</a>
          <span>›</span>
          <span>Biblioteca Municipal</span>
        </div>
      </div>
    </>
  )
}

export default Header
