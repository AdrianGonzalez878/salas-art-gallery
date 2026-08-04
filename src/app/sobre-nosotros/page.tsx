import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { sobreNosotrosQuery } from '@/sanity/lib/queries'
import type { SobreNosotros } from '@/sanity/lib/types'
import type { Metadata } from 'next'
import GaleriaCarousel from '@/components/GaleriaCarousel'
import AnimateInView from '@/components/AnimateInView'

export const metadata: Metadata = {
  title: 'Nuestra Historia',
  description:
    'Conoce la historia de Salas Art Gallery: una galería dedicada al arte contemporáneo, con obras de artistas seleccionados en pintura, escultura y fotografía.',
  keywords: [
    'historia Salas Art Gallery',
    'galería de arte',
    'arte contemporáneo',
    'artistas contemporáneos',
    'galería de arte México',
  ],
  alternates: {
    canonical: '/sobre-nosotros',
  },
}

export default async function SobreNosotrosPage() {
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
                  alt={data.imagenBanner.alt || 'Salas Art Gallery'}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 1280px, 100vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-violet-950/90 via-violet-950/40 to-transparent" />

              {/* Hero text */}
              <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-14 lg:px-20 pb-10 sm:pb-14 md:pb-18 lg:pb-20">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200 mb-4">
                    Casa de arte en Oaxaca
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[0.95] mb-3 sm:mb-4">
                    {data?.titulo || 'Salas Art Gallery'}
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

      {/* ── Hitos de la galería ───────────────────────────────── */}
      {data?.estadisticas && data.estadisticas.length > 0 && (
        <AnimateInView as="section" className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.estadisticas.length === 1 ? (
              <div className="py-10 sm:py-12 text-center">
                <p className="font-display text-5xl sm:text-6xl font-light text-violet-950 leading-none">
                  {data.estadisticas[0].numero}
                </p>
              </div>
            ) : (
              <div
                className={`grid divide-x divide-gray-100 ${
                  data.estadisticas.length === 2
                    ? 'grid-cols-2'
                    : data.estadisticas.length === 3
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : 'grid-cols-2 md:grid-cols-4'
                }`}
              >
                {data.estadisticas.map((stat, idx) => (
                  <div key={idx} className="py-8 px-6 text-center">
                    <p className="font-display text-3xl sm:text-4xl font-light text-violet-950">
                      {stat.numero}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
                  <div className="w-8 h-px bg-violet-500" />
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                    El espacio
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
                    alt: img.alt || `Salas Art Gallery ${idx + 1}`,
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-5">Casa de arte</p>
            <h2 className="font-display text-3xl font-light text-gray-900 mb-4">Salas Art Gallery</h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              Galería de arte contemporáneo. Pronto podrás conocer más de nuestra historia aquí.
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800 transition-colors"
            >
              Ver obras
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </AnimateInView>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <AnimateInView as="section" className="py-16 bg-violet-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300 mb-5">Visita con cita previa</p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-3">
            Conoce el lugar donde el arte sucede
          </h2>
          <p className="text-violet-100/70 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Agenda una visita para recorrer la galería y descubrir las obras en persona.
          </p>
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-violet-950 font-semibold rounded-full hover:bg-violet-100 transition-colors text-sm sm:text-base"
          >
            Agendar una visita
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </AnimateInView>

      {/* ── Forma de trabajar ─────────────────────────────────── */}
      <AnimateInView as="section" className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-violet-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                Nuestra mirada
              </span>
              <div className="w-8 h-px bg-violet-500" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-gray-900">
              Un lugar para encontrarse con el arte
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
                title: 'Artistas colaboradores',
                desc: 'Construimos relaciones cercanas con artistas contemporáneos y sus procesos.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Obras con presencia',
                desc: 'Reunimos piezas que invitan a mirar con calma, dialogar y habitar el espacio.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
                  </svg>
                ),
                title: 'Acompañamiento personal',
                desc: 'Te orientamos para que descubras una obra que conecte con tu mirada y tu espacio.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-700 mb-4">
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
