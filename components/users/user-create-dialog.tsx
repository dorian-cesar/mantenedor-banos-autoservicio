"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { fetchWithAuth } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserCreateDialog({ open, onOpenChange, onSuccess }: UserCreateDialogProps) {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("")
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([])
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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
      await fetchWithAuth("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          last_name: lastName,
          email,
          password,
          role_id: Number(roleId),
          is_active: isActive,
        }),
      })
      toast({ title: "Usuario creado", description: "El usuario ha sido creado correctamente" })
      onSuccess()
      onOpenChange(false)
      setName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setRoleId("")
      setIsActive(true)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear usuario",
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
          <DialogTitle>Nuevo Usuario</DialogTitle>
          <DialogDescription>Completa los campos para crear un nuevo usuario</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="password">Contraseña *</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="role">Rol *</Label>
            <Select value={roleId} onValueChange={setRoleId} required>
              <SelectTrigger id="role" className="mt-2">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Usuario activo</Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} className="cursor-pointer" />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="cursor-pointer hover:bg-accent transition-colors"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !roleId}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Usuario"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}