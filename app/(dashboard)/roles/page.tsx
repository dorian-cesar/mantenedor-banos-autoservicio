"use client"

import useSWR from "swr"
import { useState } from "react"
import { fetchWithAuth } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search, Shield, Plus, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function RolesPage() {
  const { data: roles, isLoading, mutate } = useSWR("/api/roles", fetchWithAuth)
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [editRole, setEditRole] = useState<any>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const filteredRoles = roles?.filter((r: any) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenCreate = () => {
    setEditRole(null)
    setName("")
    setOpenDialog(true)
  }

  const handleOpenEdit = (role: any) => {
    setEditRole(role)
    setName(role.name)
    setOpenDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editRole) {
        await fetchWithAuth(`/api/roles/${editRole.id}`, {
          method: "PUT",
          body: JSON.stringify({ name }),
        })
        toast({ title: "Rol actualizado", description: "El rol se actualizó correctamente" })
      } else {
        await fetchWithAuth("/api/roles", {
          method: "POST",
          body: JSON.stringify({ name }),
        })
        toast({ title: "Rol creado", description: "El nuevo rol se creó correctamente" })
      }
      setOpenDialog(false)
      mutate()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar el rol",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (roleId: number) => {
    if (!confirm("¿Seguro que deseas eliminar este rol?")) return
    try {
      await fetchWithAuth(`/api/roles/${roleId}`, { method: "DELETE" })
      toast({ title: "Rol eliminado", description: "El rol se eliminó correctamente" })
      mutate()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el rol",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Roles</h1>
            <p className="mt-2 text-muted-foreground">Gestiona los roles de usuario del sistema</p>
          </div>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Rol
        </Button>
      </div>

      {/* Tabla de roles */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Roles</CardTitle>
          <CardDescription>Administra los roles registrados</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar rol..."
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
          ) : filteredRoles && filteredRoles.length > 0 ? (
            <table className="w-full border border-border rounded-md">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2">Nombre</th>
                  <th className="text-left px-4 py-2">Fecha de creación</th>
                  <th className="text-right px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role: any) => (
                  <tr
                    key={role.id}
                    className="border-t border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-2">{role.name}</td>
                    <td className="px-4 py-2">
                      {new Date(role.created_at).toLocaleDateString("es-CL")}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(role)}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          title="Editar rol"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(role.id)}
                          className="cursor-pointer hover:bg-destructive/10 transition-colors"
                          title="Eliminar rol"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No se encontraron roles registrados
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dialog Crear/Editar */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRole ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del rol *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 cursor-text"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                disabled={isSubmitting}
                className="cursor-pointer hover:bg-accent transition-colors"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="cursor-pointer hover:bg-primary/90 transition-colors"
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}