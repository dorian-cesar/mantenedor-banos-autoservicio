"use client"

import useSWR from "swr"
import { fetchWithAuth } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search, Plus, ShoppingCart, CreditCard } from "lucide-react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"

export default function VentasPage() {
  const { data: ventas, isLoading, mutate } = useSWR("/api/ventas", fetchWithAuth)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filtro
  const filteredVentas = ventas?.data?.filter(
    (venta: any) =>
      venta.servicio?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.metodo_pago?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.usuario?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCLP = (value: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value)

  
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
            <p className="mt-2 text-muted-foreground">Gestiona las ventas registradas del sistema</p>
          </div>
        </div>
      </div>

      {/* Lista de ventas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Ventas</CardTitle>
            <CardDescription>Visualiza todas las transacciones realizadas</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por servicio, usuario o método de pago..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredVentas && filteredVentas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVentas.map((venta: any) => (
                  <TableRow key={venta.id}>
                    <TableCell>{venta.servicio?.nombre}</TableCell>
                    <TableCell>{formatCLP(venta.monto)}</TableCell>
                    <TableCell className="capitalize">{venta.metodo_pago}</TableCell>
                    <TableCell>{venta.usuario?.name || "Anon"}</TableCell>
                    <TableCell>{new Date(venta.creado_en).toLocaleString("es-CL")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No se encontraron ventas registradas
            </p>
          )}
        </CardContent>
      </Card>      
    </div>
  )
}
