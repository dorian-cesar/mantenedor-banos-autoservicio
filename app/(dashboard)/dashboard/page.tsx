"use client"

import useSWR from "swr"
import { fetchWithAuth } from "@/lib/api"
import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Settings, TrendingUp, Activity, CreditCard } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export default function DashboardPage() {
  const { data: users, isLoading: usersLoading } = useSWR("/api/users", fetchWithAuth)
  const { data: services, isLoading: servicesLoading } = useSWR("/api/servicios", fetchWithAuth)
  const { data: ventas, isLoading: loadingVentas } = useSWR("/api/ventas", fetchWithAuth)

  const totalUsers = users?.length || 0
  const totalServices = services?.length || 0
  const recentUsers = users?.slice(0, 5) || []
  const ventasData = ventas?.data || []

  // Total de ventas (CLP)
  const totalVentas = ventasData.reduce((acc: number, v: any) => acc + (v.monto || 0), 0)

  // === Formato CLP ===
  const formatCLP = (value: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value)

  // === Datos agrupados para gráficos ===
  const ventasPorMes = useMemo(() => {
    const mapa = new Map()
    ventasData.forEach((v: any) => {
      const date = new Date(v.creado_en)
      const mes = date.toLocaleString("es-CL", { month: "long" })
      const año = date.getFullYear()
      const clave = `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${año}`
      const monto = Number(v.monto) || 0
      mapa.set(clave, (mapa.get(clave) || 0) + monto)
    })

    // Ordenar cronológicamente
    return Array.from(mapa.entries())
      .sort((a, b) => {
        const [mesA, añoA] = a[0].split(" ")
        const [mesB, añoB] = b[0].split(" ")
        const dateA = new Date(`${mesA} 1, ${añoA}`)
        const dateB = new Date(`${mesB} 1, ${añoB}`)
        return dateA.getTime() - dateB.getTime()
      })
      .map(([mes, total]) => ({ mes, total }))
  }, [ventasData])

  const ventasPorServicio = useMemo(() => {
    const mapa = new Map()
    ventasData.forEach((v: any) => {
      const nombre = v.servicio?.nombre || "Desconocido"
      const monto = Number(v.monto) || 0
      mapa.set(nombre, (mapa.get(nombre) || 0) + monto)
    })
    return Array.from(mapa.entries()).map(([name, value]) => ({
      name,
      value,
    }))
  }, [ventasData])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Resumen general del sistema</p>
      </div>

      {/* === Tarjetas de resumen === */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Usuarios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">Usuarios registrados</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Servicios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalServices}</div>
                <p className="text-xs text-muted-foreground">Servicios activos</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ventas Totales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingVentas ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCLP(totalVentas)}</div>
                <p className="text-xs text-muted-foreground">Monto total vendido</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* === Gráficos === */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Línea: ventas por día */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Mes</CardTitle>
            <CardDescription>Evolución mensual del total de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingVentas ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ventasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip formatter={(v) => formatCLP(Number(v))} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Torta: ventas por servicio */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Tipo de Servicio</CardTitle>
            <CardDescription>Distribución de ingresos por servicio</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingVentas ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ventasPorServicio}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent as number) * 100).toFixed(0)}%`
                      }
                    >
                      {ventasPorServicio.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCLP(Number(v))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* === Usuarios Recientes === */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Recientes</CardTitle>
          <CardDescription>Últimos usuarios registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user: { id: string; email: string; nombre?: string }) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.nombre || "Usuario"}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  No hay usuarios recientes
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}