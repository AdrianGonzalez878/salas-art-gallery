import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { Pedido } from '@/sanity/lib/types'
import OrderStatusBadge from './OrderStatusBadge'

interface OrderCardProps {
  pedido: Pedido
}

export default function OrderCard({ pedido }: OrderCardProps) {
  const fecha = new Date(pedido._createdAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Mexico_City',
  })

  const primerProducto = pedido.productos[0]
  const imagenUrl = primerProducto?.producto?.imagenPrincipal
    ? urlFor(primerProducto.producto.imagenPrincipal).width(120).height(120).url()
    : null

  return (
    <Link
      href={`/admin/pedidos/${pedido._id}`}
      className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:border-amber-300 hover:shadow-md transition-all p-5"
    >
      {/* Row 1: número + estado + imagen */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-gray-900 font-mono">
              {pedido.numeroPedido}
            </h3>
            <OrderStatusBadge estado={pedido.estado} />
          </div>
          <p className="text-sm text-gray-600 truncate">{pedido.cliente.nombre}</p>
          <p className="text-xs text-gray-400 truncate">{pedido.cliente.email}</p>
        </div>
        {imagenUrl ? (
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-gray-200">
            <Image
              src={imagenUrl}
              alt={primerProducto.producto.titulo}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 ring-1 ring-amber-100">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
            </svg>
          </div>
        )}
      </div>

      {/* Row 2: fecha + productos + total */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {fecha}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {pedido.productos.length} producto{pedido.productos.length !== 1 ? 's' : ''}
          </span>
          <span className="text-base font-bold text-gray-900">
            ${pedido.total.toLocaleString('es-MX')}
          </span>
        </div>
      </div>

      {/* Indicador hover */}
      <div className="mt-2 flex items-center gap-1 text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Ver detalle</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
