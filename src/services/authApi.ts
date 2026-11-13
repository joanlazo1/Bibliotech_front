const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'

export interface UsuarioAdmin {
  id: string
  usuario: string
  nombre: string
}

interface LoginResponse {
  ok: boolean
  message: string
  token: string
  usuario: UsuarioAdmin
}

interface SesionResponse {
  ok: boolean
  usuario: UsuarioAdmin
}

async function leerRespuesta(
  respuesta: Response,
) {
  const datos =
    await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        'Ocurrió un error.',
    )
  }

  return datos
}

export async function loginApi(
  usuario: string,
  password: string,
): Promise<LoginResponse> {
  const respuesta =
    await fetch(
      `${API_URL}/api/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          usuario,
          password,
        }),
      },
    )

  return await leerRespuesta(
    respuesta,
  )
}

export async function obtenerSesionApi(
  token: string,
): Promise<SesionResponse> {
  const respuesta =
    await fetch(
      `${API_URL}/api/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    )

  return await leerRespuesta(
    respuesta,
  )
}
