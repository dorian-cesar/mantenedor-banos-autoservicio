"use client"

import useSWR from "swr"
import { useState } from "react"
import { fetchWithAuth } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus, Users } from "lucide-react"
import { UserTable } from "@/components/users/user-table"
import { UserCreateDialog } from "@/components/users/user-create-dialog"

export default function UsersPage() {
  const { data: users, isLoading, mutate } = useSWR("/api/users", fetchWithAuth)
  const [searchTerm, setSearchTerm] = useState("")
  const [createOpen, setCreateOpen] = useState(false)

  const filteredUsers = users?.filter(
    (u: any) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header con ícono y botón */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
            <p className="mt-2 text-muted-foreground">Gestiona los usuarios del sistema</p>
          </div>
        </div>

        {/* Botón crear usuario */}
        <Button
          onClick={() => setCreateOpen(true)}
          className="cursor-pointer hover:bg-primary/90 transition-colors"
          title="Crear nuevo usuario"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Administra usuarios, roles y estados</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 cursor-text"
            />
          </div>

          {/* Tabla o carga */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <UserTable users={filteredUsers} onUpdate={() => mutate()} />
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No se encontraron usuarios
            </p>
          )}
        </CardContent>
      </Card>

      {/* Diálogo crear usuario */}
      <UserCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => mutate()}
      />
    </div>
  )
}