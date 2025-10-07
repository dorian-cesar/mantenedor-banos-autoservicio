"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { fetchWithAuth } from "@/lib/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export default function VentasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)

  // 🔹 Pequeño debounce para evitar demasiadas peticiones al escribir
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // 🔹 SWR obtiene ventas filtradas desde backend
  const { data: ventas, isLoading, mutate } = useSWR(
    `/api/ventas?search=${debouncedSearch}`,
    fetchWithAuth
  )

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Listado de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Buscar por usuario, IP, transacción, etc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>ID Transacción</TableHead>
                    <TableHead>Cód. Autorización</TableHead>
                    <TableHead>Cód. Comercio</TableHead>
                    <TableHead>IP AMOS</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Creado en</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ventas?.data?.length > 0 ? (
                    ventas.data.map((venta: any) => (
                      <TableRow key={venta.id}>
                        <TableCell>{venta.id}</TableCell>
                        <TableCell>{venta.usuario?.name || "—"}</TableCell>
                        <TableCell>{venta.usuario?.email || "—"}</TableCell>
                        <TableCell>{venta.servicio?.nombre || "—"}</TableCell>
                        <TableCell>${venta.monto?.toLocaleString() || "—"}</TableCell>
                        <TableCell className="capitalize">{venta.metodo_pago}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              venta.estado === "completado"
                                ? "bg-green-100 text-green-700"
                                : venta.estado === "pendiente"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {venta.estado}
                          </span>
                        </TableCell>
                        <TableCell>{venta.id_transaccion || "—"}</TableCell>
                        <TableCell>{venta.codigo_autorizacion || "—"}</TableCell>
                        <TableCell>{venta.codigo_comercio || "—"}</TableCell>
                        <TableCell>{venta.ip_amos || "—"}</TableCell>
                        <TableCell>{venta.ubicacion || "—"}</TableCell>
                        <TableCell>
                          {venta.creado_en
                            ? new Date(venta.creado_en).toLocaleString("es-CL", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center text-sm text-gray-500">
                        No se encontraron ventas.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}