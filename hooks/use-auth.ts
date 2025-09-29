"use client"

import { create } from "zustand"
import type { User } from "@/lib/auth"

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    sessionStorage.removeItem("token")
    set({ user: null })
    window.location.href = "/login"
  },
}))
