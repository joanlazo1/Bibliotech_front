import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

interface SearchBarProps {
  placeholder?: string
  buttonText?: string
}

function SearchBar({
  placeholder = 'Buscar por título, autor o categoría...',
  buttonText = 'Buscar',
}: SearchBarProps) {
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  const manejarBusqueda = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const texto = busqueda.trim()

    if (!texto) {
      navigate('/catalogo')
      return
    }

    navigate(
      `/catalogo?q=${encodeURIComponent(texto)}`,
    )
  }

  return (
    <form
      className="hero-search"
      onSubmit={manejarBusqueda}
    >
      <div className="search-input-wrapper">
        <Search size={19} />

        <input
          type="search"
          placeholder={placeholder}
          value={busqueda}
          onChange={(event) =>
            setBusqueda(event.target.value)
          }
          aria-label="Buscar libros"
        />
      </div>

      <button type="submit">
        {buttonText}
      </button>
    </form>
  )
}

export default SearchBar
