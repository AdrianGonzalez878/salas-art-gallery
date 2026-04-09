import type { Producto } from '@/sanity/lib/types'
import ProductCarousel from './ProductCarousel'

const MAX_PRODUCTOS = 8

interface TePodriaGustarSectionProps {
  productos: Producto[]
}

export default function TePodriaGustarSection({ productos }: TePodriaGustarSectionProps) {
  const list = productos.slice(0, MAX_PRODUCTOS)
  if (list.length === 0) return null

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Te podría gustar
        </h2>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <ProductCarousel productos={list} />
      </div>
    </section>
  )
}
