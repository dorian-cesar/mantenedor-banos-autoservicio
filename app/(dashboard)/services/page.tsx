"use client"

import useSWR from "swr"
import { fetchWithAuth } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { ServiceTable } from "@/components/services/service-table"
import { ServiceCreateDialog } from "@/components/services/service-create-dialog"
import { Search, Plus } from "lucide-react"
import { useState } from "react"

export default function ServicesPage() {
  const { data: services, isLoading, mutate } = useSWR("/api/servicios", fetchWithAuth)
  const [searchTerm, setSearchTerm] = useState("")
  const [createOpen, setCreateOpen] = useState(false)

  const filteredServices = services?.filter(
    (service: { nombre: string }) =>
      service.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Servicios</h1>
          <p className="mt-2 text-muted-foreground">Gestiona los servicios del sistema</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Servicio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Servicios</CardTitle>
          <CardDescription>Crea, edita y elimina servicios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o descripción..."
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
          ) : filteredServices && filteredServices.length > 0 ? (
            <ServiceTable services={filteredServices} onUpdate={() => mutate()} />
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">No se encontraron servicios</p>
          )}
        </CardContent>
      </Card>

      <ServiceCreateDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={() => mutate()} />
    </div>
  )
}
