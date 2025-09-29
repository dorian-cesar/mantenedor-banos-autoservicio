export interface User {
  id: string
  email: string
  name?: string
}

export interface AuthResponse {
  token: string
  user: User
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error al iniciar sesión" }))
    throw new Error(error.message || "Error al iniciar sesión")
  }

  const data: AuthResponse = await response.json()
  setToken(data.token) // guardar token inmediatamente
  return data
}

export async function getMe(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("No autorizado")
  }

  return response.json()
}

export function setToken(token: string) {
  sessionStorage.setItem("token", token)
}

export function getToken(): string | null {
  return sessionStorage.getItem("token")
}

export function removeToken() {
  sessionStorage.removeItem("token")
}
