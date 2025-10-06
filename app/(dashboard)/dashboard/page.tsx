"use client"

import useSWR from "swr"
import { fetchWithAuth } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Settings, TrendingUp, Activity } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DashboardStats {
  totalUsers: number
  totalServices: number
  recentUsers: Array<{ id: string; email: string; createdAt: string }>
  popularServices: Array<{ id: string; nombre: string; usageCount: number }>
}

const chartConfig = {
  usageCount: {
    label: "Uso",
    color: "hsl(var(--chart-1))",
  },
}

export default function DashboardPage() {
  const { data: users, isLoading: usersLoading } = useSWR("/api/users", fetchWithAuth)
  const { data: services, isLoading: servicesLoading } = useSWR("/api/servicios", fetchWithAuth)
  const { data: ventas, isLoading: loadingVentas } = useSWR("/api/ventas", fetchWithAuth)
  const { data: logs, isLoading: loadingLogs } = useSWR("/api/logs", fetchWithAuth)

  const totalUsers = users?.length || 0
  const totalServices = services?.length || 0
  const recentUsers = users?.slice(0, 5) || []

  const formatCLP = (value: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value)

  const totalVentas = ventas?.data?.reduce((acc: number, v: any) => acc + v.monto, 0) || 0

  // Simular datos de servicios populares para el gráfico
  const chartData =
    services?.slice(0, 5).map((service: { nombre: string }, index: number) => ({
      name: service.nombre,
      usageCount: Math.floor(Math.random() * 100) + 20,
    })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Resumen general del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">vs. mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">Nuevos usuarios</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios Más Usados</CardTitle>
            <CardDescription>Top 5 servicios por uso</CardDescription>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="usageCount" fill="var(--color-usageCount)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
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
                  <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.nombre || "Usuario"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentUsers.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">No hay usuarios recientes</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ==== NUEVOS BLOQUES ==== */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Ventas */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>Últimas transacciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingVentas ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <>
                <p className="text-lg font-semibold mb-4">Total vendido: {formatCLP(totalVentas)}</p>
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
                    {ventas?.data?.slice(0, 5).map((v: any) => (
                      <TableRow key={v.id}>
                        <TableCell>{v.servicio?.nombre}</TableCell>
                        <TableCell>{formatCLP(v.monto)}</TableCell>
                        <TableCell>{v.metodo_pago}</TableCell>
                        <TableCell>{v.usuario?.name || "Anon"}</TableCell>
                        <TableCell>{new Date(v.creado_en).toLocaleString("es-CL")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs de API</CardTitle>
            <CardDescription>Últimos registros de actividad</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLogs ? (
              <Skeleton className="h-20 w-full" />
            ) : logs?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Tiempo (ms)</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.slice(0, 5).map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.user_email}</TableCell>
                      <TableCell>{log.endpoint}</TableCell>
                      <TableCell>{log.method}</TableCell>
                      <TableCell>{log.status_code}</TableCell>
                      <TableCell>{log.response_time_ms}</TableCell>
                      <TableCell>{new Date(log.created_at).toLocaleString("es-CL")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-6">No hay logs recientes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}