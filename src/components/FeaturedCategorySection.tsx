import Image from 'next/image'
import Link from 'next/link'
import AnimateInView from '@/components/AnimateInView'
import { urlFor } from '@/lib/sanity'
import type { SeccionDestacada, Producto } from '@/sanity/lib/types'
import ProductCarousel from './ProductCarousel'

interface FeaturedCategorySectionProps {
  seccion: SeccionDestacada
  productos: Producto[]
  variant?: 'dark' | 'light'
}

export default function FeaturedCategorySection({
  seccion,
  productos,
  variant = 'light',
}: FeaturedCategorySectionProps) {
  const isDark = variant === 'dark'
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
    <AnimateInView as="section" className="relative isolate pt-0 pb-16 border-t border-gray-100">
      {/* Banner full-width */}
      <div className="relative overflow-hidden mb-12 bg-white">
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

      <div className="relative py-12 sm:py-16">
        <div
          className={`absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 ${
            isDark ? 'bg-violet-950' : 'bg-[#f7f6f8]'
          }`}
          aria-hidden
        />

        {/* Cabecera de sección */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-0.5 ${isDark ? 'bg-violet-400' : 'bg-violet-500'}`} />
              <span
                className={`text-xs font-semibold uppercase tracking-widest ${
                  isDark ? 'text-violet-300' : 'text-violet-700'
                }`}
              >
                Categoría
              </span>
              <div className={`w-8 h-0.5 ${isDark ? 'bg-violet-400' : 'bg-violet-500'}`} />
            </div>
            <h2
              className={`font-display text-3xl sm:text-4xl font-light mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {seccion.titulo}
            </h2>
            {seccion.descripcion && (
              <p
                className={`max-w-2xl text-sm sm:text-base ${
                  isDark ? 'text-violet-100/75' : 'text-gray-600'
                }`}
              >
                {seccion.descripcion}
              </p>
            )}
          </div>
        </div>

        {productos.length > 0 ? (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ProductCarousel productos={productos} />
            </div>
            {seccion.mostrarBoton && (
              <div className="flex justify-center mt-8">
                <Link
                  href={`/productos?categoria=${seccion.categoria}`}
                  className={`inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-full transition-colors ${
                    isDark
                      ? 'bg-white text-violet-950 hover:bg-violet-100'
                      : 'bg-violet-700 text-white hover:bg-violet-800'
                  }`}
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
            <p className={`text-center text-sm ${isDark ? 'text-violet-200/60' : 'text-gray-400'}`}>
              No hay productos disponibles en esta categoría
            </p>
          </div>
        )}
      </div>
    </AnimateInView>
  )
}
