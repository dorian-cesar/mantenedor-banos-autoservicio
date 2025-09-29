"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  email: string
  nombre?: string
  rol?: string
  createdAt?: string
}

interface UserDetailDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del Usuario</DialogTitle>
          <DialogDescription>Información completa del usuario</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">ID</Label>
            <p className="text-sm font-medium text-foreground">{user.id}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <p className="text-sm font-medium text-foreground">{user.email}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Nombre</Label>
            <p className="text-sm font-medium text-foreground">{user.nombre || "-"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Rol</Label>
            <p className="text-sm font-medium text-foreground">{user.rol || "Usuario"}</p>
          </div>
          {user.createdAt && (
            <div>
              <Label className="text-muted-foreground">Fecha de Registro</Label>
              <p className="text-sm font-medium text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
