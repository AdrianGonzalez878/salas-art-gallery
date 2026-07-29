import type { Producto } from '@/sanity/lib/types'
import AnimateInView from '@/components/AnimateInView'
import ProductCarousel from './ProductCarousel'

const MAX_PRODUCTOS = 4

interface TePodriaGustarSectionProps {
  productos: Producto[]
}

export default function TePodriaGustarSection({ productos }: TePodriaGustarSectionProps) {
  const list = productos.slice(0, MAX_PRODUCTOS)
  if (list.length === 0) return null

  return (
    <AnimateInView as="section" className="py-12 sm:py-16 bg-[#f7f6f8] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7 sm:mb-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-2">
            Sigue explorando
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-light text-gray-900">
            Obras que podrían interesarte
          </h2>
        </div>
        <ProductCarousel productos={list} />
      </div>
    </AnimateInView>
  )
}
