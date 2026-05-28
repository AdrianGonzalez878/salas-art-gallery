import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { sobreNosotrosQuery } from '@/sanity/lib/queries'
import type { SobreNosotros } from '@/sanity/lib/types'
import type { Metadata } from 'next'
import GaleriaCarousel from '@/components/GaleriaCarousel'
import AnimateInView from '@/components/AnimateInView'
import TestimonialsSection from '@/components/TestimonialsSection'

export const metadata: Metadata = {
  title: 'Nuestra Historia | Joyería artesanal en plata de Oaxaca',
  description:
    'Conoce la historia de Conchita Plata: artesanos oaxaqueños especializados en filigrana, ámbar, marquesita y plata .925. Décadas creando joyería única hecha a mano en Oaxaca, México.',
  keywords: [
    'historia Conchita Plata',
    'artesanos joyería Oaxaca',
    'filigrana oaxaqueña artesanal',
    'joyería ámbar Oaxaca',
    'marquesita plata Oaxaca',
    'plata .925 artesanal México',
  ],
  alternates: {
    canonical: '/sobre-conchita-plata',
  },
}

export default async function SobreConchitaPlataPage() {
  const data = await sanityFetch<SobreNosotros | null>(sobreNosotrosQuery)

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── Hero banner ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="w-full lg:max-w-7xl lg:mx-auto lg:px-4 xl:px-8 lg:pt-4">
          <div className="relative w-full overflow-hidden rounded-none lg:rounded-2xl">
            <div className="relative w-full min-h-[340px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[660px] bg-gray-100">
              {data?.imagenBanner?.asset ? (
                <Image
                  src={urlFor(data.imagenBanner).width(1920).quality(90).url()}
                  alt={data.imagenBanner.alt || 'Conchita Plata'}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 1280px, 100vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />

              {/* Hero text */}
              <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-14 lg:px-20 pb-10 sm:pb-14 md:pb-18 lg:pb-20">
                <div className="max-w-3xl">
                  {/* Decorative line */}
                  <div className="w-10 h-0.5 bg-amber-400 mb-4 sm:mb-5" />
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3 sm:mb-4">
                    {data?.titulo || 'Conchita Plata'}
                  </h1>
                  {data?.subtitulo && (
                    <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
                      {data.subtitulo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Estadísticas ─────────────────────────────────────── */}
      {data?.estadisticas && data.estadisticas.length > 0 && (
        <AnimateInView as="section" className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {data.estadisticas.map((stat, idx) => (
                <div key={idx} className="py-8 px-6 text-center">
                  <p className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                    {stat.numero}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">{stat.etiqueta}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimateInView>
      )}

      {/* ── Historia + galería ───────────────────────────────── */}
      {data ? (
        <AnimateInView as="section" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

              {/* Historia */}
              <div className="order-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                    Nuestra historia
                  </span>
                </div>

                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                  <p className="whitespace-pre-line">{data.historia}</p>
                </div>

              </div>

              {/* Galería carrusel */}
              {data.galeria && data.galeria.length > 0 && (
                <GaleriaCarousel
                  imagenes={data.galeria.map((img, idx) => ({
                    url: urlFor(img).width(900).quality(90).url(),
                    alt: img.alt || `Conchita Plata ${idx + 1}`,
                  }))}
                />
              )}
            </div>
          </div>
        </AnimateInView>
      ) : (
        /* Sin contenido en Sanity */
        <AnimateInView as="section" className="py-24">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-10 h-0.5 bg-amber-400 mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Conchita Plata</h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              Tu tienda de joyería de confianza. Piezas únicas en plata, diseñadas con pasión
              y dedicación. Pronto podrás conocer más de nuestra historia aquí.
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Ver productos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </AnimateInView>
      )}

      <TestimonialsSection />

      {/* ── CTA ──────────────────────────────────────────────── */}
      <AnimateInView as="section" className="py-14 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-10 h-0.5 bg-amber-400 mx-auto mb-6" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Encuentra tu pieza perfecta
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Explora nuestra colección completa de joyería artesanal en plata .925 y encuentra la pieza que te enamore.
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-gray-900 font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm sm:text-base"
          >
            Ver toda la colección
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </AnimateInView>

      {/* ── Valores / cierre ─────────────────────────────────── */}
      <AnimateInView as="section" className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Por qué elegirnos
              </span>
              <div className="w-8 h-0.5 bg-amber-400" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
              Nuestra promesa contigo
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Plata genuina',
                desc: 'Todas nuestras piezas son elaboradas en plata .925, certificadas y de alta calidad.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Hecho con amor',
                desc: 'Cada pieza lleva consigo la dedicación y el cuidado de nuestras artesanas.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
                  </svg>
                ),
                title: 'Envío seguro',
                desc: 'Tu pedido llega protegido y con seguimiento. Gratis a partir de $999.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateInView>

    </div>
  )
}
