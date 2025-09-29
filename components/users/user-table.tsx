"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { UserDetailDialog } from "./user-detail-dialog"
import { UserEditDialog } from "./user-edit-dialog"
import { UserDeleteDialog } from "./user-delete-dialog"

interface User {
  id: string
  email: string
  nombre?: string
  rol?: string
  createdAt?: string
}

interface UserTableProps {
  users: User[]
  onUpdate: () => void
}

export function UserTable({ users, onUpdate }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleViewDetail = (user: User) => {
    setSelectedUser(user)
    setDetailOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setDeleteOpen(true)
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-card-foreground">Email</TableHead>
              <TableHead className="text-card-foreground">Nombre</TableHead>
              <TableHead className="text-card-foreground">Rol</TableHead>
              <TableHead className="text-right text-card-foreground">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-card-foreground">{user.email}</TableCell>
                <TableCell className="text-card-foreground">{user.nombre || "-"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.rol || "Usuario"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewDetail(user)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalle</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
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

      {selectedUser && (
        <>
          <UserDetailDialog user={selectedUser} open={detailOpen} onOpenChange={setDetailOpen} />
          <UserEditDialog user={selectedUser} open={editOpen} onOpenChange={setEditOpen} onSuccess={onUpdate} />
          <UserDeleteDialog user={selectedUser} open={deleteOpen} onOpenChange={setDeleteOpen} onSuccess={onUpdate} />
        </>
      )}
    </>
  )
}
