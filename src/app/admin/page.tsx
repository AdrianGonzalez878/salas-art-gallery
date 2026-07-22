import { client } from '@/lib/sanity'
import { pedidosQuery, estadisticasQuery } from '@/sanity/lib/queries'
import type { Pedido, Estadisticas } from '@/sanity/lib/types'
import StatsCards from '@/components/StatsCards'
import OrderList from '@/components/OrderList'
import AdminLogoutButton from '@/components/AdminLogoutButton'

export default async function AdminPage() {
  const [pedidos, estadisticas] = await Promise.all([
    client.fetch<Pedido[]>(pedidosQuery),
    client.fetch<Estadisticas>(estadisticasQuery),
  ])

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const pedidosHoy = pedidos.filter((p) => new Date(p._createdAt) >= hoy)
  const ventasHoy = pedidosHoy
    .filter((p) => p.estado !== 'cancelado')
    .reduce((sum, p) => sum + p.total, 0)
  const ventasTotales = pedidos
    .filter((p) => p.estado !== 'cancelado')
    .reduce((sum, p) => sum + p.total, 0)

  const estadisticasCompletas: Estadisticas = {
    ...estadisticas,
    ventasTotales,
    ventasHoy,
    pedidosHoy: pedidosHoy.length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm tracking-wide">
              Salas Art Gallery <span className="text-gray-400 font-normal">/ Admin</span>
            </span>
          </div>
          <AdminLogoutButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona pedidos y monitorea el rendimiento de tu tienda
          </p>
        </div>

        {/* Estadísticas */}
        <StatsCards estadisticas={estadisticasCompletas} />

        {/* Lista de Pedidos */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Pedidos
              <span className="ml-2 text-sm font-normal text-gray-400">({pedidos.length})</span>
            </h2>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="En vivo" />
          </div>
          <div className="p-6">
            <OrderList pedidos={pedidos} />
          </div>
        </div>
      </div>
    </div>
  )
}
