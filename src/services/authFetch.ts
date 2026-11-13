const TOKEN_KEY =
  'bibliotech_token'

export async function fetchAutenticado(
  url: string,
  opciones: RequestInit = {},
) {
  const token =
    localStorage.getItem(
      TOKEN_KEY,
    )

  if (!token) {
    throw new Error(
      'Debes iniciar sesión.',
    )
  }

  const headers =
    new Headers(
      opciones.headers,
    )

  headers.set(
    'Authorization',
    `Bearer ${token}`,
  )

  return fetch(
    url,
    {
      ...opciones,
      headers,
    },
  )
}
