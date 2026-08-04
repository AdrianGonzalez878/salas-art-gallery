import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { productosMasNuevosQuery, heroQuery, sobreNosotrosQuery, exposicionesQuery, artistasQuery } from '@/sanity/lib/queries'
import type { Producto, Hero, SobreNosotros, Exposicion, Artista } from '@/sanity/lib/types'
import ProductGrid from '@/components/ProductGrid'
import AboutSection from '@/components/AboutSection'
import AnimateInView from '@/components/AnimateInView'
import HeroCarousel from '@/components/HeroCarousel'
import ExposicionesSection from '@/components/ExposicionesSection'
import ArtistasHomeSection from '@/components/ArtistasHomeSection'
import VisitaGaleriaForm from '@/components/VisitaGaleriaForm'

export const metadata: Metadata = {
  title: 'Salas Art Gallery | Galería de arte contemporáneo',
  description:
    'Descubre obras de arte contemporáneo en Salas Art Gallery: pintura, escultura y fotografía de artistas seleccionados. Compra piezas únicas en línea.',
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  // Obtener obras más nuevas, hero, artistas, sobre nosotros y exposiciones
  // (Secciones destacadas siguen en Sanity; por ahora no se muestran en home)
  const [productosMasNuevos, hero, sobreNosotros, exposiciones, artistas] = await Promise.all([
    sanityFetch<Producto[]>(productosMasNuevosQuery),
    sanityFetch<Hero | null>(heroQuery),
    sanityFetch<SobreNosotros | null>(sobreNosotrosQuery),
    sanityFetch<Exposicion[]>(exposicionesQuery),
    sanityFetch<Artista[]>(artistasQuery),
  ])

  // 4 filas × 4 columnas en desktop
  const productosMasNuevosList = productosMasNuevos.slice(0, 16)

  // Valores por defecto si no hay hero activo
  const heroData = hero || {
    titulo: 'Salas Art Gallery',
    subtitulo: 'Casa de arte. Descubre obras de artistas seleccionados.',
    tipoMedia: 'imagenes' as const,
    imagenesCarrusel: [],
    textoBotonPrincipal: 'Ver obras',
    hrefBotonPrincipal: '/productos',
    textoBotonSecundario: 'Agendar una visita',
    hrefBotonSecundario: '/galeria',
    mostrarBadge: false,
  }

  const tipoMedia = heroData.tipoMedia === 'video' ? 'video' : 'imagenes'

  const heroVideoSrc =
    tipoMedia === 'video' ? heroData.videoDesktopUrl?.trim() || null : null
  const heroVideoSrcMobile =
    tipoMedia === 'video'
      ? heroData.videoMobileUrl?.trim() || heroVideoSrc
      : null
  const hasHeroVideo = Boolean(heroVideoSrc || heroVideoSrcMobile)

  const posterFromSanity = (() => {
    if (!hasHeroVideo) return [] as { urlDesktop: string; urlMobile: string; alt: string }[]
    const desktop = heroData.posterDesktop?.asset
      ? urlFor(heroData.posterDesktop).width(1920).quality(90).url()
      : null
    const mobile = heroData.posterMobile?.asset
      ? urlFor(heroData.posterMobile).width(1080).quality(90).url()
      : desktop
    if (!desktop) return []
    return [
      {
        urlDesktop: desktop,
        urlMobile: mobile || desktop,
        alt: heroData.posterDesktop?.alt || heroData.titulo || 'Hero',
      },
    ]
  })()

  const imagenesCarrusel =
    tipoMedia === 'imagenes'
      ? heroData.imagenesCarrusel
          ?.filter((slide) => slide?.imagenDesktop && slide?.imagenMobile)
          .map((slide) => ({
            urlDesktop: urlFor(slide.imagenDesktop).width(1920).quality(95).url(),
            urlMobile: urlFor(slide.imagenMobile).width(1080).quality(95).url(),
            alt: slide.alt || 'Hero image',
          })) || []
      : posterFromSanity

  const hasHeroMedia = imagenesCarrusel.length > 0 || hasHeroVideo

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden h-[84svh] sm:h-[88svh] bg-neutral-900">
        {hasHeroMedia ? (
          <HeroCarousel
            imagenes={imagenesCarrusel}
            videoSrc={heroVideoSrc}
            videoSrcMobile={heroVideoSrcMobile}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-neutral-900 to-black" aria-hidden />
        )}
        <div className="relative z-30 h-full flex flex-col items-center justify-end px-5 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:justify-center md:pb-0 text-center">
          <div
            className={`max-w-4xl mx-auto ${
              hasHeroVideo ? 'animate-hero-content-delayed' : ''
            }`}
          >
            <h1
              className={`font-display text-[2.35rem] leading-[0.98] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-light text-white tracking-[0.02em] ${
                hasHeroVideo ? '' : 'animate-fadeIn'
              }`}
            >
              {heroData.titulo}
            </h1>
            {heroData.subtitulo && (
              <p
                className={`mt-4 sm:mt-5 font-sans text-[0.95rem] sm:text-lg md:text-xl text-white/80 max-w-xl mx-auto font-light leading-relaxed ${
                  hasHeroVideo ? '' : 'animate-fadeInUp'
                }`}
              >
                {heroData.subtitulo}
              </p>
            )}
            <div
              className={`mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center ${
                hasHeroVideo ? '' : 'animate-fadeInUp'
              }`}
              style={hasHeroVideo ? undefined : { animationDelay: '0.3s', animationFillMode: 'both' }}
            >
              <Link
                href={heroData.hrefBotonPrincipal || '/productos'}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white text-sm font-semibold text-gray-900 hover:bg-violet-50 transition-colors"
              >
                {heroData.textoBotonPrincipal || 'Ver obras'}
              </Link>
              <Link
                href={heroData.hrefBotonSecundario || '/galeria'}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/70 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {heroData.textoBotonSecundario || 'Agendar una visita'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="lg:mx-auto lg:max-w-[1440px] lg:border-x lg:border-gray-100">
        {/* ── Exposiciones ─────────────────────────────────────── */}
        {exposiciones.length > 0 && <ExposicionesSection exposiciones={exposiciones} />}

        {/* ── Artistas colaboradores ────────────────────────────── */}
        <ArtistasHomeSection artistas={artistas} />

        {/* ── Lo Más Nuevo ─────────────────────────────────────── */}
        {productosMasNuevosList.length > 0 && (
          <AnimateInView as="section" className="py-14 sm:py-20 bg-[#f7f6f8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8 sm:mb-10 border-b border-gray-200 pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-2">
                    Archivo reciente
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-light text-gray-900">
                    Lo más nuevo
                  </h2>
                </div>
                <p className="max-w-sm text-sm text-gray-600 leading-relaxed sm:text-right">
                  Las últimas obras incorporadas a la colección.
                </p>
              </div>
              <ProductGrid productos={productosMasNuevosList} mobileLimit={6} />
              <div className="mt-9 flex justify-center">
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-800 transition-colors"
                >
                  Explorar todas las obras
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </AnimateInView>
        )}

        {/* ── Sobre Nosotros ───────────────────────────────────── */}
        {sobreNosotros && (
          <AboutSection data={sobreNosotros} />
        )}

        {/* ── Agenda tu visita ─────────────────────────────────── */}
        <AnimateInView as="section" className="relative isolate py-14 sm:py-16 bg-[#f7f6f8]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-7 sm:mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-3">
                Visita con cita previa
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-gray-900 leading-tight">
                Agenda tu visita
              </h2>
              <p className="mt-3 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Recorre la galería en persona. Te confirmamos horario y detalles por correo.
              </p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white p-5 sm:p-8 shadow-sm">
              <VisitaGaleriaForm />
            </div>
          </div>
        </AnimateInView>
      </div>
    </div>
  )
}
