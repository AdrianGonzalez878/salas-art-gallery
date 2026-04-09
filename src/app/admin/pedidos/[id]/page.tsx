import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity'
import { pedidoPorIdQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/lib/sanity'
import type { Pedido } from '@/sanity/lib/types'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import OrderStatusSelector from '@/components/OrderStatusSelector'
import Image from 'next/image'
import Link from 'next/link'

interface PedidoDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PedidoDetailPage({ params }: PedidoDetailPageProps) {
  const { id } = await params
  const pedido: Pedido | null = await client.fetch(pedidoPorIdQuery, { id })

  if (!pedido) notFound()

  const fecha = new Date(pedido._createdAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Mexico_City',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Panel
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-900 font-mono font-medium">{pedido.numeroPedido}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Hero del pedido */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="bg-gray-900 px-6 py-5 rounded-xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Número de pedido</p>
                <h1 className="text-xl font-bold text-white font-mono">{pedido.numeroPedido}</h1>
                <p className="text-gray-400 text-sm mt-1">{fecha}</p>
              </div>
              <OrderStatusBadge estado={pedido.estado} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs">Cambiar estado:</span>
              <OrderStatusSelector
                pedidoId={pedido._id}
                estadoActual={pedido.estado as Parameters<typeof OrderStatusSelector>[0]['estadoActual']}
              />
            </div>
          </div>
        </div>

        {/* Grid: cliente + dirección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Cliente */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              <div className="w-6 h-6 bg-amber-50 rounded-md flex items-center justify-center text-amber-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Cliente
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="w-24 text-gray-400 flex-shrink-0">Nombre</dt>
                <dd className="font-medium text-gray-900">{pedido.cliente.nombre}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 text-gray-400 flex-shrink-0">Email</dt>
                <dd className="text-gray-700 break-all">{pedido.cliente.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 text-gray-400 flex-shrink-0">Teléfono</dt>
                <dd className="text-gray-700">{pedido.cliente.telefono}</dd>
              </div>
            </dl>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              <div className="w-6 h-6 bg-amber-50 rounded-md flex items-center justify-center text-amber-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Dirección de envío
            </h2>
            <address className="not-italic text-sm text-gray-700 leading-relaxed space-y-0.5">
              <p>{pedido.direccionEnvio.calle}</p>
              <p>{pedido.direccionEnvio.colonia}, {pedido.direccionEnvio.ciudad}</p>
              <p>{pedido.direccionEnvio.estado}, CP {pedido.direccionEnvio.codigoPostal}</p>
              {pedido.direccionEnvio.pais && <p className="text-gray-400">{pedido.direccionEnvio.pais}</p>}
            </address>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            <div className="w-6 h-6 bg-amber-50 rounded-md flex items-center justify-center text-amber-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
              </svg>
            </div>
            Productos
            <span className="ml-1 text-xs font-normal text-gray-400">({pedido.productos.length})</span>
          </h2>
          <div className="space-y-3">
            {pedido.productos.map((item, index) => {
              const imagenUrl = item.producto?.imagenPrincipal
                ? urlFor(item.producto.imagenPrincipal).width(120).height(120).url()
                : null
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-50 rounded-lg p-3"
                >
                  {imagenUrl ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image src={imagenUrl} alt={item.producto.titulo} fill className="object-cover" sizes="64px" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{item.producto.titulo}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Cantidad: {item.cantidad}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      ${(item.precio * item.cantidad).toLocaleString('es-MX')}
                    </p>
                    <p className="text-xs text-gray-400">${item.precio.toLocaleString('es-MX')} c/u</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Resumen de pago */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            <div className="w-6 h-6 bg-amber-50 rounded-md flex items-center justify-center text-amber-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            Resumen de pago
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${pedido.subtotal.toLocaleString('es-MX')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span>{pedido.envio === 0 ? 'Gratis' : `$${pedido.envio.toLocaleString('es-MX')}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>${pedido.total.toLocaleString('es-MX')}</span>
            </div>
            {pedido.metodoPago && (
              <div className="flex justify-between text-gray-500 text-xs pt-1">
                <span>Método de pago</span>
                <span className="capitalize">{pedido.metodoPago}</span>
              </div>
            )}
          </div>
        </div>

        {/* Regalo incluido */}
        {pedido.regaloTitulo && (
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              <div className="w-6 h-6 bg-amber-50 rounded-md flex items-center justify-center text-amber-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              Regalo incluido
            </h2>
            <div className="flex items-center gap-4 bg-amber-50 rounded-lg p-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-amber-100 flex-shrink-0">
                {pedido.regaloImagenUrl ? (
                  <Image src={pedido.regaloImagenUrl} alt={pedido.regaloTitulo} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-amber-900 text-sm">{pedido.regaloTitulo}</p>
                <p className="text-xs text-amber-600 mt-0.5">Incluido en este pedido</p>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">$0.00</p>
              </div>
            </div>
          </div>
        )}

        {/* Notas */}
        {pedido.notas && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              <div className="w-6 h-6 bg-amber-50 rounded-md flex items-center justify-center text-amber-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              Notas del cliente
            </h2>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">{pedido.notas}</p>
          </div>
        )}
      </div>
    </div>
  )
}
