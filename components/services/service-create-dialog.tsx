"use client"

import type React from "react"
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
import { useState } from "react"

interface ServiceCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ServiceCreateDialog({ open, onOpenChange, onSuccess }: ServiceCreateDialogProps) {
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [activo, setActivo] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await fetchWithAuth("/api/servicios", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          precio: precio ? Number.parseFloat(precio) : undefined,
          activo,
        }),
      })

      toast({
        title: "Servicio creado",
        description: "El servicio se ha creado correctamente",
      })
      onSuccess()
      onOpenChange(false)
      // Reset form
      setNombre("")
      setPrecio("")
      setActivo(true)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear servicio",
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
          <DialogTitle>Crear Servicio</DialogTitle>
          <DialogDescription>Agrega un nuevo servicio al sistema</DialogDescription>
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
                placeholder="Nombre del servicio"
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
                placeholder="$0"
                className="cursor-text mt-2"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="activo">Servicio activo</Label>
              <Switch id="activo" checked={activo} onCheckedChange={setActivo} className="cursor-pointer" />
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
              title="Crear servicio"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Servicio"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}