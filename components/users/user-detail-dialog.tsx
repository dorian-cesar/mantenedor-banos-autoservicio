"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { User } from "@/types/user"
import { Badge } from "@/components/ui/badge"

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
            <Label className="text-muted-foreground">Nombre completo</Label>
            <p className="text-sm font-medium text-foreground">
              {user.name} {user.last_name || ""}
            </p>
          </div>

          <div>
            <Label className="text-muted-foreground">Email</Label>
            <p className="text-sm font-medium text-foreground">{user.email}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Rol</Label>
            <p className="text-sm font-medium text-foreground">{user.role?.nombre || "Usuario"}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Estado</Label>
            <Badge variant={user.is_active ? "default" : "destructive"}>
              {user.is_active ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          <div>
            <Label className="text-muted-foreground">Fecha de registro</Label>
            <p className="text-sm font-medium text-foreground">
              {new Date(user.created_at).toLocaleDateString("es-CL")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
