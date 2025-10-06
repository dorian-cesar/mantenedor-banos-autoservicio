"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { ServiceEditDialog } from "./service-edit-dialog"
import { ServiceDeleteDialog } from "./service-delete-dialog"

interface Service {
  id: string
  nombre: string
  precio?: number
  activo?: boolean
}

interface ServiceTableProps {
  services: Service[]
  onUpdate: () => void
}

export function ServiceTable({ services, onUpdate }: ServiceTableProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setEditOpen(true)
  }

  const handleDelete = (service: Service) => {
    setSelectedService(service)
    setDeleteOpen(true)
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-card-foreground">Nombre</TableHead>
              <TableHead className="text-card-foreground">Precio</TableHead>
              <TableHead className="text-right text-card-foreground">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium text-card-foreground">{service.nombre}</TableCell>
                <TableCell className="text-card-foreground">
                  {service.precio ? `$${service.precio.toFixed(0)}` : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedService && (
        <>
          <ServiceEditDialog
            service={selectedService}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSuccess={onUpdate}
          />
          <ServiceDeleteDialog
            service={selectedService}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onSuccess={onUpdate}
          />
        </>
      )}
    </>
  )
}