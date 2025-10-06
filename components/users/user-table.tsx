"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import { UserEditDialog } from "./user-edit-dialog"
import { UserDeleteDialog } from "./user-delete-dialog"
import { UserDetailDialog } from "./user-detail-dialog"
import type { User } from "@/types/user"

interface UserTableProps {
  users: User[]
  onUpdate: () => void
}

export function UserTable({ users, onUpdate }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setDeleteOpen(true)
  }

  const handleDetail = (user: User) => {
    setSelectedUser(user)
    setDetailOpen(true)
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {/* Nombre clickable → abre detalle */}
                <TableCell
                  onClick={() => handleDetail(user)}
                  className="cursor-pointer hover:underline text-foreground"
                >
                  {user.name} {user.last_name || ""}
                </TableCell>

                {/* Email */}
                <TableCell>{user.email}</TableCell>

                {/* Rol */}
                <TableCell>{user.role?.name || "—"}</TableCell>

                {/* Estado */}
                <TableCell>
                  <Badge variant={user.is_active ? "default" : "destructive"}>
                    {user.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>

                {/* Fecha creación */}
                <TableCell>{new Date(user.created_at).toLocaleDateString("es-CL")}</TableCell>

                {/* Acciones */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                      className="cursor-pointer hover:bg-accent"
                      title="Editar usuario"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user)}
                      className="cursor-pointer hover:bg-accent"
                      title="Eliminar usuario"
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

      {/* Diálogos */}
      {selectedUser && (
        <>
          <UserEditDialog
            user={selectedUser}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSuccess={onUpdate}
          />
          <UserDeleteDialog
            user={selectedUser}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onSuccess={onUpdate}
          />
          <UserDetailDialog
            user={selectedUser}
            open={detailOpen}
            onOpenChange={setDetailOpen}
          />
        </>
      )}
    </>
  )
}