"use client"

import useSWR from "swr"
import { useState } from "react"
import { fetchWithAuth } from "@/lib/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search, Shield, Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function RolesPage() {
  const { data: roles, isLoading, mutate } = useSWR("/api/roles", fetchWithAuth)
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [editRole, setEditRole] = useState<any>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete dialog (como en service-delete-dialog)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleOpenDelete = (role: any) => {
    setDeleteTarget(role)
    setDeleteOpen(true)
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
        toast({ title: "Rol actualizado", description: `Se actualizó "${name}".` })
      } else {
        await fetchWithAuth("/api/roles", {
          method: "POST",
          body: JSON.stringify({ name }),
        })
        toast({ title: "Rol creado", description: `Se creó "${name}".` })
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

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await fetchWithAuth(`/api/roles/${deleteTarget.id}`, { method: "DELETE" })
      toast({
        title: "Rol eliminado",
        description: `El rol "${deleteTarget.name}" ha sido eliminado correctamente.`,
      })
      setDeleteOpen(false)
      setDeleteTarget(null)
      mutate()
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : "No se pudo eliminar el rol",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
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

      {/* Tabla de roles (mismo patrón visual que service-table) */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Roles</CardTitle>
          <CardDescription>Administra los roles registrados</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Buscador (igual estilo al de servicios) */}
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
            <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Nombre
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Fecha de creación
                    </TableHead>
                    <TableHead className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role: any) => (
                    <TableRow
                      key={role.id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="px-6 py-4 text-sm text-foreground">
                        {role.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(role.created_at).toLocaleDateString("es-CL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          {/* Botón Editar (icon-only ghost, igual a servicios) */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(role)}
                            className="cursor-pointer hover:bg-primary/10"
                            title="Editar rol"
                            aria-label="Editar rol"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* Botón Eliminar (icon-only ghost, igual a servicios) */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(role)}
                            className="cursor-pointer hover:bg-destructive/10"
                            title="Eliminar rol"
                            aria-label="Eliminar rol"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No se encontraron roles registrados
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dialog Crear/Editar (patrón como service-create/edit-dialog) */}
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

      {/* Delete Dialog (patrón como service-delete-dialog) */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar rol</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de que deseas eliminar el rol{" "}
              <span className="font-medium text-foreground">
                “{deleteTarget?.name}”
              </span>
              ? Esta acción no se puede deshacer.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}