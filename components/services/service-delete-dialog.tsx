"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { fetchWithAuth } from "@/lib/api"
import { Loader2, Trash2 } from "lucide-react"

interface ServiceDeleteDialogProps {
  service: { id: string; nombre: string }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ServiceDeleteDialog({ service, open, onOpenChange, onSuccess }: ServiceDeleteDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    try {
      await fetchWithAuth(`/api/servicios/${service.id}`, { method: "DELETE" })
      toast({
        title: "Servicio eliminado",
        description: `El servicio "${service.nombre}" ha sido eliminado correctamente.`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : "Error desconocido al eliminar el servicio",
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
          <DialogTitle>Eliminar Servicio</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar el servicio{" "}
            <span className="font-semibold">{service.nombre}</span>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="cursor-pointer hover:bg-accent transition-colors"
            title="Cancelar eliminación"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="cursor-pointer hover:bg-destructive/90 transition-colors"
            title="Confirmar eliminación"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}