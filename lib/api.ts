import { getToken } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    removeToken()
    window.location.href = "/login"
    throw new Error("No autorizado")
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error en la petición" }))
    throw new Error(error.message || "Error en la petición")
  }

  return response.json()
}

function removeToken() {
  localStorage.removeItem("token")
}
