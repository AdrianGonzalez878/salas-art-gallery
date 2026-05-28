import Image from 'next/image'
import Link from 'next/link'
import AnimateInView from '@/components/AnimateInView'
import { urlFor } from '@/lib/sanity'
import type { SeccionDestacada, Producto } from '@/sanity/lib/types'
import ProductCarousel from './ProductCarousel'

interface FeaturedCategorySectionProps {
  seccion: SeccionDestacada
  productos: Producto[]
}

export default function FeaturedCategorySection({
  seccion,
  productos,
}: FeaturedCategorySectionProps) {
  const bannerUrl = urlFor(seccion.imagenBanner)
    .width(1920)
    .quality(90)
    .url()

  // Determinar alineación del texto
  const textAlign =
    seccion.posicionTextoBanner === 'left'
      ? 'text-left justify-start'
      : seccion.posicionTextoBanner === 'right'
      ? 'text-right justify-end'
      : 'text-center justify-center'

  return (
    <AnimateInView as="section" className="pt-0 pb-16 bg-white border-t border-gray-100">
      {/* Banner full-width */}
      <div className="relative overflow-hidden mb-12">
        <div className="relative h-[260px] sm:h-[320px] md:h-[400px] lg:h-[560px] xl:h-[680px] bg-gray-900">
          <Image
            src={bannerUrl}
            alt={seccion.imagenBanner.alt || seccion.titulo}
            fill
            className="object-cover"
            sizes="100vw"
            priority={seccion.orden === 1}
          />
          {seccion.textoBanner && (
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
          )}
          {seccion.textoBanner && (
            <div className="absolute inset-0 flex items-end">
              <div className={`max-w-7xl mx-auto w-full px-6 sm:px-10 md:px-16 lg:px-24 py-8 md:py-12 lg:py-16 flex ${textAlign}`}>
                <div>
                  <div className="w-8 h-0.5 bg-amber-400 mb-4" />
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-xl">
                    {seccion.textoBanner}
                  </h2>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cabecera de sección */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">Categoría</span>
            <div className="w-8 h-0.5 bg-amber-400" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{seccion.titulo}</h2>
          {seccion.descripcion && (
            <p className="text-gray-500 max-w-2xl text-sm sm:text-base">{seccion.descripcion}</p>
          )}
        </div>
      </div>

      {productos.length > 0 ? (
        <>
          <div className="px-4 sm:px-6 lg:px-8">
            <ProductCarousel productos={productos} />
          </div>
          {seccion.mostrarBoton && (
            <div className="text-center mt-8">
              <Link
                href={`/productos?categoria=${seccion.categoria}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Ver todos los {seccion.titulo}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">No hay productos disponibles en esta categoría</p>
        </div>
      )}
    </AnimateInView>
  )
}
