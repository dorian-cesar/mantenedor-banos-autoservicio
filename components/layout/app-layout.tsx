"use client"

import type React from "react"

import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { useAuthStore } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
