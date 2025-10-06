"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { fetchWithAuth } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface Service {
  id: string
  nombre: string
  precio?: number
  activo?: boolean
}

interface ServiceEditDialogProps {
  service: Service
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ServiceEditDialog({ service, open, onOpenChange, onSuccess }: ServiceEditDialogProps) {
  const [nombre, setNombre] = useState(service.nombre)
  const [precio, setPrecio] = useState(service.precio?.toString() || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await fetchWithAuth(`/api/servicios/${service.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nombre,
          precio: precio ? Number.parseFloat(precio) : undefined,
        }),
      })

      toast({
        title: "Servicio actualizado",
        description: "El servicio se ha actualizado correctamente",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar servicio",
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
          <DialogTitle>Editar Servicio</DialogTitle>
          <DialogDescription>Modifica la información del servicio</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="cursor-text mt-2"
              />
            </div>
            <div>
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="cursor-text mt-2"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
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
              disabled={isLoading}
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