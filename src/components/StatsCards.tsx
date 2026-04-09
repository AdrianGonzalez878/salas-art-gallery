import type { Estadisticas } from '@/sanity/lib/types'

interface StatsCardsProps {
  estadisticas: Estadisticas
}

const iconVentasTotales = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-4-4l4 4 4-4M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>
)

const iconVentasHoy = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const iconTotalPedidos = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
  </svg>
)

const iconPedidosHoy = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

const iconPendientes = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const iconEnProceso = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const iconEnviados = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
)

const iconEntregados = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

export default function StatsCards({ estadisticas }: StatsCardsProps) {
  const cards = [
    {
      title: 'Ventas Totales',
      value: `$${estadisticas.ventasTotales.toLocaleString('es-MX')}`,
      icon: iconVentasTotales,
      accent: 'border-amber-400',
      bg: 'bg-amber-50',
    },
    {
      title: 'Ventas de Hoy',
      value: `$${(estadisticas.ventasHoy ?? 0).toLocaleString('es-MX')}`,
      icon: iconVentasHoy,
      accent: 'border-amber-400',
      bg: 'bg-amber-50',
    },
    {
      title: 'Total de Pedidos',
      value: estadisticas.totalPedidos.toString(),
      icon: iconTotalPedidos,
      accent: 'border-amber-400',
      bg: 'bg-amber-50',
    },
    {
      title: 'Pedidos de Hoy',
      value: (estadisticas.pedidosHoy ?? 0).toString(),
      icon: iconPedidosHoy,
      accent: 'border-amber-400',
      bg: 'bg-amber-50',
    },
    {
      title: 'Pendientes',
      value: estadisticas.pedidosPendientes.toString(),
      icon: iconPendientes,
      accent: 'border-amber-400',
      bg: 'bg-amber-50',
    },
    {
      title: 'En Proceso',
      value: estadisticas.pedidosProcesando.toString(),
      icon: iconEnProceso,
      accent: 'border-amber-400',
      bg: 'bg-amber-50',
    },
    {
      title: 'Enviados',
      value: estadisticas.pedidosEnviados.toString(),
      icon: iconEnviados,
      accent: 'border-amber-400',
      bg: 'bg-amber-50',
    },
    {
      title: 'Entregados',
      value: estadisticas.pedidosEntregados.toString(),
      icon: iconEntregados,
      accent: 'border-amber-400',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 border-l-4 ${card.accent} flex items-center gap-4`}
        >
          <div className={`${card.bg} text-amber-600 rounded-lg p-3 flex-shrink-0`}>
            {card.icon}
          </div>
          <div className="min-w-0">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide truncate">
              {card.title}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
