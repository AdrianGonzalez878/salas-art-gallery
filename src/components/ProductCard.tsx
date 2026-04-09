import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { Producto } from '@/sanity/lib/types'

interface ProductCardProps {
  producto: Producto
}

export default function ProductCard({ producto }: ProductCardProps) {
  const imageUrl = producto.imagenPrincipal
    ? urlFor(producto.imagenPrincipal).width(600).quality(90).url()
    : '/placeholder.jpg'

  // Calcular precio final si tiene descuento
  let precioFinal = producto.precio
  let descuentoLabel = null
  
  if (producto.tieneDescuento && producto.tipoDescuento && producto.valorDescuento) {
    if (producto.tipoDescuento === 'porcentaje') {
      precioFinal = producto.precio * (1 - producto.valorDescuento / 100)
      descuentoLabel = `${producto.valorDescuento}% OFF`
    } else if (producto.tipoDescuento === 'monto') {
      precioFinal = Math.max(0, producto.precio - producto.valorDescuento)
      descuentoLabel = `$${producto.valorDescuento} OFF`
    }
  }

  return (
    <Link
      href={`/productos/${producto.slug.current}`}
      className="group flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Imagen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 shrink-0">
        <Image
          src={imageUrl}
          alt={producto.imagenPrincipal?.alt || producto.titulo}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {/* Badge de descuento */}
        {descuentoLabel && (
          <div className="absolute top-2.5 left-2.5 bg-amber-400 text-gray-900 px-2.5 py-1 rounded-lg font-bold text-xs shadow-sm">
            {descuentoLabel}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <p className="text-[11px] text-gray-400 capitalize mb-1">{producto.categoria}</p>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-auto line-clamp-2 group-hover:text-amber-700 transition-colors leading-snug">
          {producto.titulo}
        </h3>

        <div className="flex items-end justify-between gap-2 mt-3">
          <div className="flex flex-col">
            {producto.tieneDescuento ? (
              <>
                <span className="text-xs text-gray-400 line-through leading-none mb-0.5">
                  ${producto.precio.toLocaleString()}
                </span>
                <span className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                  ${Math.round(precioFinal).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                ${producto.precio.toLocaleString()}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0 group-hover:bg-amber-400 group-hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}



