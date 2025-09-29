"use client"

import useSWR from "swr"
import { fetchWithAuth } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { UserTable } from "@/components/users/user-table"
import { Search } from "lucide-react"
import { useState } from "react"

export default function UsersPage() {
  const { data: users, isLoading, mutate } = useSWR("/api/users", fetchWithAuth)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users?.filter(
    (user: { email: string; nombre?: string }) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
        <p className="mt-2 text-muted-foreground">Gestiona los usuarios del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Visualiza, edita y elimina usuarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <UserTable users={filteredUsers} onUpdate={() => mutate()} />
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">No se encontraron usuarios</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
