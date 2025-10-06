"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { fetchWithAuth } from "@/lib/api"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User } from "@/types/user"

interface UserEditDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserEditDialogProps) {
  const [name, setName] = useState(user.name)
  const [lastName, setLastName] = useState(user.last_name || "")
  const [email, setEmail] = useState(user.email)
  const [roleId, setRoleId] = useState(user.role_id?.toString() || "")
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([])
  const [isActive, setIsActive] = useState(user.is_active)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 🔧 Importante: resincroniza el formulario cuando cambia el usuario o se abre el diálogo
  useEffect(() => {
    if (!open) return
    setName(user.name)
    setLastName(user.last_name || "")
    setEmail(user.email)
    setRoleId(user.role_id?.toString() || "")
    setIsActive(user.is_active)
  }, [user, open])

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await fetchWithAuth("/api/roles")
        setRoles(res || [])
      } catch (err) {
        console.error("Error al cargar roles:", err)
      }
    }
    if (open) loadRoles()
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await fetchWithAuth(`/api/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          last_name: lastName,
          email,
          role_id: Number(roleId),
          is_active: isActive,
        }),
      })

      toast({
        title: "Usuario actualizado",
        description: "Los cambios se guardaron correctamente",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al actualizar usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica la información del usuario
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="cursor-text mt-2"
            />
          </div>

          {/* Apellido */}
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="cursor-text mt-2"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="cursor-text mt-2"
            />
          </div>

          {/* Rol */}
          <div>
            <Label htmlFor="role">Rol *</Label>
            <Select
              value={roleId}
              onValueChange={setRoleId}
              required
            >
              <SelectTrigger
                id="role"
                className="cursor-pointer hover:bg-accent transition-colors mt-2"
              >
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem
                    key={r.id}
                    value={r.id.toString()}
                    className="cursor-pointer"
                  >
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Usuario activo</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              className="cursor-pointer"
            />
          </div>

          {/* Botones */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="cursor-pointer hover:bg-accent transition-colors"
              title="Cancelar"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !roleId}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
              title="Guardar cambios"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}