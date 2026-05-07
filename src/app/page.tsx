import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { productosMasVendidosQuery, productosMasNuevosQuery, heroQuery, sobreNosotrosQuery, seccionesDestacadasQuery, productosPorCategoriaQuery, postsInstagramQuery, shopTheLookQuery } from '@/sanity/lib/queries'
import type { Producto, Hero, SobreNosotros, SeccionDestacada, PostInstagram, ShopTheLook } from '@/sanity/lib/types'
import ProductCarousel from '@/components/ProductCarousel'
import AboutSection from '@/components/AboutSection'
import FeaturedCategorySection from '@/components/FeaturedCategorySection'
import HeroCarousel from '@/components/HeroCarousel'
import InstagramSection from '@/components/InstagramSection'
import ShopTheLookSection from '@/components/ShopTheLookSection'

export const metadata: Metadata = {
  title: 'Conchita Plata | Joyería artesanal en plata · Oaxaca',
  description:
    'Descubre joyería artesanal en plata .925 de Oaxaca: filigrana oaxaqueña, ámbar, marquesita, dijes, collares, aretes y pulseras con diseños únicos hechos a mano. Envío gratis a partir de $999.',
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  // Obtener productos más vendidos, más nuevos, hero, sobre nosotros, secciones destacadas, posts de Instagram y shop the look
  const [productosMasVendidos, productosMasNuevos, hero, sobreNosotros, seccionesDestacadas, postsInstagram, shopTheLook] = await Promise.all([
    sanityFetch<Producto[]>(productosMasVendidosQuery),
    sanityFetch<Producto[]>(productosMasNuevosQuery),
    sanityFetch<Hero | null>(heroQuery),
    sanityFetch<SobreNosotros | null>(sobreNosotrosQuery),
    sanityFetch<SeccionDestacada[]>(seccionesDestacadasQuery),
    sanityFetch<PostInstagram[]>(postsInstagramQuery),
    sanityFetch<ShopTheLook | null>(shopTheLookQuery),
  ])
  
  // Para cada sección destacada, obtener sus productos
  const seccionesConProductos = await Promise.all(
    seccionesDestacadas.map(async (seccion) => {
      const productos = await sanityFetch<Producto[]>(
        productosPorCategoriaQuery,
        { categoria: seccion.categoria }
      )
      return { seccion, productos: productos.slice(0, 8) }
    })
  )
  
  // Tomar los primeros 8 de cada categoría
  const productosMasVendidosList = productosMasVendidos.slice(0, 8)
  const productosMasNuevosList = productosMasNuevos.slice(0, 8)

  // Valores por defecto si no hay hero activo
  const heroData = hero || {
    titulo: 'Joyería Excepcional',
    subtitulo: 'Descubre nuestra colección única de anillos, collares, aretes y más. Cada pieza está diseñada con pasión y atención al detalle.',
    imagenesCarrusel: [],
    textoBotonPrincipal: 'Ver Productos',
    hrefBotonPrincipal: '/productos',
    textoBotonSecundario: 'Explorar Categorías',
    hrefBotonSecundario: '/productos?categoria=anillos',
    mostrarBadge: false,
  }

  // Generar URLs de las imágenes del carrusel en el servidor
  const imagenesCarrusel = heroData.imagenesCarrusel
    ?.filter((slide) => slide?.imagenDesktop && slide?.imagenMobile) // Solo slides con ambas imágenes
    .map((slide) => ({
      urlDesktop: urlFor(slide.imagenDesktop).width(1920).quality(95).url(),
      urlMobile: urlFor(slide.imagenMobile).width(1080).quality(95).url(),
      alt: slide.alt || 'Hero image',
    })) || []

  // Generar URLs de las imágenes de Instagram en el servidor
  const instagramImageUrls = postsInstagram.map((post) =>
    urlFor(post.imagen).width(400).height(400).quality(90).url()
  )

  // Generar URLs de Shop the Look en el servidor
  const shopTheLookData = shopTheLook ? {
    ...shopTheLook,
    imagenModeloUrl: urlFor(shopTheLook.imagenModelo).width(1200).quality(95).url(),
    productosConImagenes: shopTheLook.productos.map((item) => ({
      producto: item.producto,
      posicionX: item.posicionX,
      posicionY: item.posicionY,
      imagenUrl: urlFor(item.producto.imagenPrincipal).width(600).quality(90).url(),
    })),
  } : null

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden h-screen">
        {imagenesCarrusel.length > 0 && (
          <HeroCarousel imagenes={imagenesCarrusel} />
        )}
        <div className="relative z-30 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Línea decorativa ámbar */}
            <div className="flex justify-center">
              <div className="w-12 h-0.5 bg-amber-400" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl animate-fadeIn leading-tight">
              {heroData.titulo}
            </h1>
            {heroData.subtitulo && (
              <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-lg animate-fadeInUp font-light leading-relaxed">
                {heroData.subtitulo}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <Link
                href={heroData.hrefBotonPrincipal || '/productos'}
                className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-semibold rounded-lg text-black bg-yellow-400 hover:bg-yellow-500 hover:scale-105 transition-all shadow-2xl"
              >
                {heroData.textoBotonPrincipal || 'Ver Productos'}
              </Link>
              <Link
                href={heroData.hrefBotonSecundario || '/productos?categoria=anillo'}
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-lg font-semibold rounded-lg text-white hover:bg-white/10 hover:scale-105 transition-all shadow-2xl backdrop-blur-sm"
              >
                {heroData.textoBotonSecundario || 'Explorar Categorías'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust band ───────────────────────────────────────── */}
      <section className="py-8 sm:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {[
              { icon: 'M5 13l4 4L19 7', label: 'Calidad Garantizada', desc: 'Cada pieza verificada y sellada en plata .925' },
              { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', label: 'Envío Rápido', desc: 'Empaque seguro y entrega en todo México' },
              { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', label: 'Hecho con Amor', desc: 'Piezas únicas diseñadas con pasión' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center rounded-2xl p-4 sm:p-6 border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-50 flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d={icon} />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 leading-tight mb-1">{label}</h3>
                <p className="hidden sm:block text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop the Look ────────────────────────────────────── */}
      {shopTheLookData && (
        <ShopTheLookSection
          data={shopTheLookData}
          imagenModeloUrl={shopTheLookData.imagenModeloUrl}
          productosConImagenes={shopTheLookData.productosConImagenes}
        />
      )}

      {/* ── Lo Más Vendido ───────────────────────────────────── */}
      {productosMasVendidosList.length > 0 && (
        <section className="pt-12 pb-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">Colección</span>
                <div className="w-8 h-0.5 bg-amber-400" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Lo Más Vendido</h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-md">Las joyas favoritas de nuestras clientas</p>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <ProductCarousel productos={productosMasVendidosList} />
          </div>
        </section>
      )}

      {/* ── Lo Más Nuevo ─────────────────────────────────────── */}
      {productosMasNuevosList.length > 0 && (
        <section className="pt-12 pb-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">Nuevos Ingresos</span>
                <div className="w-8 h-0.5 bg-amber-400" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Lo Más Nuevo</h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-md">Descubre las últimas incorporaciones a la colección</p>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <ProductCarousel productos={productosMasNuevosList} />
          </div>
          <div className="text-center mt-10">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Ver todos los productos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* ── Sobre Nosotros ───────────────────────────────────── */}
      {sobreNosotros && (
        <AboutSection data={sobreNosotros} />
      )}

      {/* ── Secciones Destacadas ─────────────────────────────── */}
      {seccionesConProductos.map(({ seccion, productos }) => (
        <FeaturedCategorySection
          key={seccion._id}
          seccion={seccion}
          productos={productos}
        />
      ))}

      {/* ── Instagram Feed ───────────────────────────────────── */}
      {postsInstagram && postsInstagram.length > 0 && (
        <InstagramSection posts={postsInstagram} imageUrls={instagramImageUrls} />
      )}
    </div>
  )
}
