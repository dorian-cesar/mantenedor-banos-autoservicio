"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/hooks/use-auth"
import { getToken, getMe } from "@/lib/auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    async function checkAuth() {
      const token = getToken()

      // Si estamos en login y hay token, redirigir al dashboard
      if (pathname === "/login" && token) {
        try {
          const user = await getMe(token)
          setUser(user)
          router.push("/dashboard")
          return
        } catch {
          localStorage.removeItem("token")
        }
      }

      // Si no estamos en login y no hay token, redirigir al login
      if (pathname !== "/login" && !token) {
        setLoading(false)
        router.push("/login")
        return
      }

      // Si hay token, verificar que sea válido
      if (token && pathname !== "/login") {
        try {
          const user = await getMe(token)
          setUser(user)
        } catch {
          localStorage.removeItem("token")
          router.push("/login")
        }
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router, setUser, setLoading])

  return <>{children}</>
}
