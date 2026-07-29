'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import ProductCarousel from '@/components/ProductCarousel'
import type { Producto } from '@/sanity/lib/types'

interface CarritoContentProps {
  productosDestacados: Producto[]
}

export default function CarritoContent({ productosDestacados }: CarritoContentProps) {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f6f8] text-gray-900 py-10 sm:py-16">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
            <div className="bg-violet-950 p-8 sm:p-12 lg:p-14 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300 mb-5">
                Tu selección
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-light leading-tight mb-4">
                Aún no has elegido una obra
              </h1>
              <p className="max-w-md text-sm sm:text-base leading-relaxed text-violet-100/75">
                Explora la colección de Salas Art Gallery y guarda las piezas que conecten con tu espacio.
              </p>
              <Link
                href="/productos"
                className="inline-flex mt-8 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet-950 hover:bg-violet-100 transition-colors"
              >
                Explorar obras <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-violet-50 flex items-center justify-center text-violet-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-light text-gray-900 mb-3">Tu carrito está listo</h2>
              <p className="max-w-sm text-sm leading-relaxed text-gray-600">
                Cuando encuentres una obra que te interese, agrégala aquí para continuar con tu solicitud o compra.
              </p>
              <Link
                href="/galeria"
                className="mt-6 text-sm font-semibold text-violet-800 hover:text-violet-950 underline underline-offset-4 decoration-violet-300 hover:decoration-violet-800 transition-colors"
              >
                ¿Prefieres verla en persona? Agenda una visita
              </Link>
            </div>
          </div>
        </div>

        {/* Obras destacadas */}
        {productosDestacados.length > 0 && (
          <section className="w-full py-10 sm:py-12 bg-[#f7f6f8] border-y border-gray-100 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-7">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-2">
                  Sigue explorando
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-light text-gray-900 mb-2">
                  Obras destacadas
                </h2>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto">Piezas seleccionadas por la galería</p>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ProductCarousel productos={productosDestacados} />
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f6f8] text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-14 sm:pb-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-2">Tu selección</p>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-gray-900">Obras en tu carrito</h1>
          <p className="text-gray-600 mt-2 text-sm">{totalItems} obra{totalItems !== 1 ? 's' : ''} seleccionada{totalItems !== 1 ? 's' : ''}</p>
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 p-4 sm:gap-4 sm:p-6">
                <Link href={`/productos/${item.slug}`} className="relative h-20 w-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
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
                  <Link href={`/productos/${item.slug}`} className="text-sm sm:text-base font-medium text-gray-900 hover:text-violet-800 line-clamp-2">
                    {item.title}
                  </Link>
                  <p className="text-sm sm:text-base text-gray-600 mt-0.5">${item.price.toLocaleString()}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <span className="text-xs sm:text-sm text-gray-500">Pieza única</span>
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
                  <p className="text-sm sm:text-base font-semibold text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-5 sm:p-6 border-t border-violet-100 bg-violet-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-lg font-semibold text-gray-900">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Total de obras</span>
              <span className="text-xl font-bold text-gray-900">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-center">
              Los costos y opciones de entrega se confirmarán al completar tu solicitud.
            </p>
            <div className="flex flex-col items-center gap-3 w-full max-w-sm sm:max-w-sm md:max-w-md mx-auto">
              <Link
                href="/carrito/checkout"
                className="w-full text-center px-6 py-3.5 md:px-8 md:py-4 rounded-full bg-violet-700 text-white font-semibold hover:bg-violet-800 transition-colors text-base md:text-base"
              >
                Continuar al checkout
              </Link>
              <Link
                href="/productos"
                className="w-full text-center px-6 py-3.5 md:px-8 md:py-4 rounded-full border border-violet-200 bg-white text-violet-800 font-medium hover:bg-violet-50 transition-colors text-base md:text-base"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Obras destacadas */}
      {productosDestacados.length > 0 && (
        <section className="w-full py-10 sm:py-12 bg-[#f7f6f8] border-y border-gray-100 mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-7">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-2">
                Sigue explorando
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-gray-900 mb-2">Obras destacadas</h2>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">Piezas seleccionadas por la galería</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductCarousel productos={productosDestacados} />
          </div>
        </section>
      )}
    </div>
  )
}
