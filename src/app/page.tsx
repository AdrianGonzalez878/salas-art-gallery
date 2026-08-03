import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { productosMasNuevosQuery, heroQuery, sobreNosotrosQuery, seccionesDestacadasQuery, productosPorEtiquetaQuery, exposicionesQuery, artistasQuery } from '@/sanity/lib/queries'
import type { Producto, Hero, SobreNosotros, SeccionDestacada, Exposicion, Artista } from '@/sanity/lib/types'
import ProductCarousel from '@/components/ProductCarousel'
import AboutSection from '@/components/AboutSection'
import AnimateInView from '@/components/AnimateInView'
import FeaturedCategorySection from '@/components/FeaturedCategorySection'
import HeroCarousel from '@/components/HeroCarousel'
import StarCategoryShortcuts from '@/components/StarCategoryShortcuts'
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
  // Obtener obras más nuevas, hero, artistas, sobre nosotros, secciones destacadas y exposiciones
  const [productosMasNuevos, hero, sobreNosotros, seccionesDestacadas, exposiciones, artistas] = await Promise.all([
    sanityFetch<Producto[]>(productosMasNuevosQuery),
    sanityFetch<Hero | null>(heroQuery),
    sanityFetch<SobreNosotros | null>(sobreNosotrosQuery),
    sanityFetch<SeccionDestacada[]>(seccionesDestacadasQuery),
    sanityFetch<Exposicion[]>(exposicionesQuery),
    sanityFetch<Artista[]>(artistasQuery),
  ])
  
  // Para cada sección destacada, obtener sus productos
  const seccionesConProductos = await Promise.all(
    seccionesDestacadas.map(async (seccion) => {
      const productos = await sanityFetch<Producto[]>(
        productosPorEtiquetaQuery,
        { etiqueta: seccion.etiqueta }
      )
      return { seccion, productos: productos.slice(0, 8) }
    })
  )
  
  const productosMasNuevosList = productosMasNuevos.slice(0, 8)

  // Valores por defecto si no hay hero activo
  const heroData = hero || {
    titulo: 'Salas Art Gallery',
    subtitulo: 'Casa de arte. Descubre obras de artistas seleccionados.',
    imagenesCarrusel: [],
    textoBotonPrincipal: 'Ver obras',
    hrefBotonPrincipal: '/productos',
    textoBotonSecundario: 'Agendar una visita',
    hrefBotonSecundario: '/galeria',
    mostrarBadge: false,
  }

  // Generar URLs de las imágenes del carrusel en el servidor
  /** Preview de video local: copia tus MP4 a public/videos/ y activa en .env.local */
  const heroVideoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO?.trim() || null
  const heroVideoSrcMobile = process.env.NEXT_PUBLIC_HERO_VIDEO_MOBILE?.trim() || null
  const hasHeroVideo = Boolean(heroVideoSrc || heroVideoSrcMobile)

  const imagenesCarrusel = heroData.imagenesCarrusel
    ?.filter((slide) => slide?.imagenDesktop && slide?.imagenMobile) // Solo slides con ambas imágenes
    .map((slide) => ({
      urlDesktop: urlFor(slide.imagenDesktop).width(1920).quality(95).url(),
      urlMobile: urlFor(slide.imagenMobile).width(1080).quality(95).url(),
      alt: slide.alt || 'Hero image',
    })) || []

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden h-[78svh]">
        {(imagenesCarrusel.length > 0 || hasHeroVideo) && (
          <HeroCarousel
            imagenes={imagenesCarrusel}
            videoSrc={heroVideoSrc}
            videoSrcMobile={heroVideoSrcMobile}
          />
        )}
        <div className="relative z-30 h-full flex flex-col items-center justify-end md:justify-center px-4 sm:px-6 lg:px-8 pb-10 md:pb-0 text-center">
          <div
            className={`max-w-5xl mx-auto space-y-4 md:space-y-8 ${
              hasHeroVideo ? 'animate-hero-content-delayed' : ''
            }`}
          >
            <h1
              className={`font-display text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-light text-white mb-3 md:mb-6 drop-shadow-lg sm:leading-[1.05] tracking-[0.04em] ${
                hasHeroVideo ? '' : 'animate-fadeIn'
              }`}
            >
              {heroData.titulo}
            </h1>
            {heroData.subtitulo && (
              <p
                className={`font-sans text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-5 md:mb-8 max-w-3xl mx-auto drop-shadow-md font-light leading-relaxed tracking-wide ${
                  hasHeroVideo ? '' : 'animate-fadeInUp'
                }`}
              >
                {heroData.subtitulo}
              </p>
            )}
            <div
              className={`flex flex-row gap-2.5 sm:gap-4 justify-center ${
                hasHeroVideo ? '' : 'animate-fadeInUp'
              }`}
              style={hasHeroVideo ? undefined : { animationDelay: '0.3s', animationFillMode: 'both' }}
            >
              <Link
                href={heroData.hrefBotonPrincipal || '/productos'}
                className="inline-flex flex-1 sm:flex-initial items-center justify-center min-w-0 px-4 py-3.5 sm:px-10 sm:py-5 border border-transparent text-sm sm:text-lg font-semibold rounded-lg text-black bg-yellow-400 hover:bg-yellow-500 sm:hover:scale-105 transition-all shadow-2xl"
              >
                {heroData.textoBotonPrincipal || 'Ver Productos'}
              </Link>
              <Link
                href={heroData.hrefBotonSecundario || '/galeria'}
                className="inline-flex flex-1 sm:flex-initial items-center justify-center min-w-0 px-4 py-3.5 sm:px-10 sm:py-5 border-2 border-white text-sm sm:text-lg font-semibold rounded-lg text-white hover:bg-white/10 sm:hover:scale-105 transition-all shadow-2xl backdrop-blur-sm"
              >
                {heroData.textoBotonSecundario || 'Agendar una visita'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="lg:mx-auto lg:max-w-[1440px] lg:border-x lg:border-gray-100">
        {/* ── Atajos a categorías estrella ─────────────────────── */}
        <StarCategoryShortcuts />

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
              <ProductCarousel productos={productosMasNuevosList} />
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

        {/* ── Secciones Destacadas ─────────────────────────────── */}
        {seccionesConProductos.map(({ seccion, productos }, index) => (
          <FeaturedCategorySection
            key={seccion._id}
            seccion={seccion}
            productos={productos}
            variant={index % 2 === 0 ? 'dark' : 'light'}
          />
        ))}

        {/* ── Agenda tu visita ─────────────────────────────────── */}
        <AnimateInView as="section" className="relative isolate py-14 sm:py-20 bg-white">
          <div
            className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[#f7f6f8]"
            aria-hidden
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-9 lg:gap-14 items-start">
              <div className="lg:col-span-2 pt-1">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-4">
                  Visita con cita previa
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-light leading-[1.05] text-gray-900 mb-4">
                  Conoce el lugar donde el arte sucede
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-gray-600 max-w-md">
                  Agenda una visita para recorrer la galería, descubrir las obras en persona y recibir atención personalizada.
                </p>
                <ul className="mt-7 space-y-3 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span className="text-violet-600" aria-hidden>•</span>
                    Horario confirmado directamente contigo
                  </li>
                  <li className="flex gap-3">
                    <span className="text-violet-600" aria-hidden>•</span>
                    Grupos de hasta 12 personas
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-3 rounded-2xl border border-violet-100 bg-white p-5 sm:p-8 shadow-sm">
                <VisitaGaleriaForm />
              </div>
            </div>
          </div>
        </AnimateInView>
      </div>
    </div>
  )
}
