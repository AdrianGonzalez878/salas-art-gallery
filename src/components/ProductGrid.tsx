import type { Producto } from '@/sanity/lib/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  productos: Producto[]
}

export default function ProductGrid({ productos }: ProductGridProps) {
  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        </div>
        <p className="text-gray-900 font-semibold text-lg mb-1">Sin resultados</p>
        <p className="text-gray-500 text-sm">No se encontraron productos con ese criterio.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {productos.map((producto) => (
        <ProductCard key={producto._id} producto={producto} />
      ))}
    </div>
  )
}


