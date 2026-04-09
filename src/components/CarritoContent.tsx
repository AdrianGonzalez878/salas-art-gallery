'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import ProductCarousel from '@/components/ProductCarousel'
import { urlFor } from '@/lib/sanity'
import {
  computeShippingCost,
  COSTO_ENVIO_ESTANDAR_MXN,
  montoFaltanteParaEnvioGratis,
  UMBRAL_ENVIO_GRATIS_MXN,
} from '@/lib/shipping'
import type { Producto, Promocion } from '@/sanity/lib/types'

interface CarritoContentProps {
  productosMasVendidos: Producto[]
}

export default function CarritoContent({ productosMasVendidos }: CarritoContentProps) {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart()
  const [promociones, setPromociones] = useState<Promocion[]>([])

  useEffect(() => {
    fetch('/api/promociones')
      .then((r) => r.json())
      .then((data: Promocion[]) => setPromociones(data))
      .catch(() => {})
  }, [])

  const regaloActivo = promociones.find((p) => subtotal >= p.montoMinimo) ?? null
  const envioEstimado = computeShippingCost(subtotal)
  const faltaParaGratis = montoFaltanteParaEnvioGratis(subtotal)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center py-10 lg:py-12">
        <div className="w-full max-w-2xl lg:max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl bg-white p-8 sm:p-10 lg:p-12 xl:p-14 shadow-sm border border-gray-100">
            <div className="w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 lg:w-20 lg:h-20 mx-auto mb-5 lg:mb-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <svg className="w-9 h-9 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-2">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-7 lg:mb-7 text-base lg:text-lg max-w-lg mx-auto">Agrega piezas que te gusten y vuelve aquí para finalizar tu compra.</p>
            <Link
              href="/productos"
              className="inline-flex items-center justify-center px-8 py-3.5 lg:px-10 lg:py-3.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors text-base lg:text-lg"
            >
              Ver productos
            </Link>
          </div>
        </div>

        {/* Lo Más Vendido - ancho completo como en la página de inicio */}
        {productosMasVendidos.length > 0 && (
          <section className="w-full py-16 bg-white mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  LO MÁS VENDIDO
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Las joyas favoritas de nuestros clientes
                </p>
              </div>
            </div>
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <ProductCarousel productos={productosMasVendidos} />
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tu carrito</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{totalItems} producto{totalItems !== 1 ? 's' : ''}</p>
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-5 sm:p-6">
                <Link href={`/productos/${item.slug}`} className="relative w-[5.5rem] h-[5.5rem] sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                      </svg>
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/productos/${item.slug}`} className="font-medium text-gray-900 hover:text-gray-700 line-clamp-2">
                    {item.title}
                  </Link>
                  <p className="text-gray-600 mt-0.5">${item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-gray-500">1 unidad (pieza única)</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </li>
            ))}
            {regaloActivo && (
              <li className="flex gap-4 p-5 sm:p-6 bg-green-50/60">
                <div className="relative w-[5.5rem] h-[5.5rem] sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {regaloActivo.imagenBanner?.asset ? (
                    <Image
                      src={urlFor(regaloActivo.imagenBanner).width(192).quality(85).url()}
                      alt={regaloActivo.titulo}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🎁</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-green-800 line-clamp-2">{regaloActivo.titulo}</p>
                  <p className="text-green-600 mt-0.5 text-sm">Regalo incluido</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-green-700">$0</p>
                </div>
              </li>
            )}
          </ul>

          <div className="p-5 sm:p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-lg font-semibold text-gray-900">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-gray-600">Envío (estimado)</span>
              <span className="font-medium text-gray-900">
                {envioEstimado === 0 ? (
                  <span className="text-green-700">Gratis</span>
                ) : (
                  `$${envioEstimado.toLocaleString()}`
                )}
              </span>
            </div>
            {faltaParaGratis > 0 && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3 text-center">
                Te faltan <strong>${faltaParaGratis.toLocaleString()}</strong> para envío gratis
                (a partir de ${UMBRAL_ENVIO_GRATIS_MXN.toLocaleString()}).
              </p>
            )}
            <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Total estimado</span>
              <span className="text-xl font-bold text-gray-900">
                ${(subtotal + envioEstimado).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-center">
              Envío ${COSTO_ENVIO_ESTANDAR_MXN.toLocaleString()} en pedidos por debajo de{' '}
              ${UMBRAL_ENVIO_GRATIS_MXN.toLocaleString()}. IVA incluido en precios.
            </p>
            <div className="flex flex-col items-center gap-3 w-full max-w-sm sm:max-w-sm md:max-w-md mx-auto">
              <Link
                href="/carrito/checkout"
                className="w-full text-center px-6 py-3.5 md:px-8 md:py-4 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors text-base md:text-base"
              >
                Continuar al checkout
              </Link>
              <Link
                href="/productos"
                className="w-full text-center px-6 py-3.5 md:px-8 md:py-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-base md:text-base"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lo Más Vendido - ancho completo como en la página de inicio */}
      {productosMasVendidos.length > 0 && (
        <section className="w-full py-16 bg-white mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">LO MÁS VENDIDO</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Las joyas favoritas de nuestros clientes</p>
            </div>
          </div>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <ProductCarousel productos={productosMasVendidos} />
          </div>
        </section>
      )}
    </div>
  )
}
