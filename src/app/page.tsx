import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { productosMasVendidosQuery, productosMasNuevosQuery, heroQuery, sobreNosotrosQuery, seccionesDestacadasQuery, productosPorCategoriaQuery, postsInstagramQuery, shopTheLookQuery } from '@/sanity/lib/queries'
import type { Producto, Hero, SobreNosotros, SeccionDestacada, PostInstagram, ShopTheLook } from '@/sanity/lib/types'
import ProductCarousel from '@/components/ProductCarousel'
import AboutSection from '@/components/AboutSection'
import AnimateInView from '@/components/AnimateInView'
import FeaturedCategorySection from '@/components/FeaturedCategorySection'
import HeroCarousel from '@/components/HeroCarousel'
import InstagramSection from '@/components/InstagramSection'
import ShopTheLookSection from '@/components/ShopTheLookSection'
import StarCategoryShortcuts from '@/components/StarCategoryShortcuts'

export const metadata: Metadata = {
  title: 'Salas Art Gallery | Galería de arte contemporáneo',
  description:
    'Descubre obras de arte contemporáneo en Salas Art Gallery: pintura, escultura y fotografía de artistas seleccionados. Compra piezas únicas en línea.',
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

      {/* ── Atajos a categorías estrella ─────────────────────── */}
      <StarCategoryShortcuts />

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
        <AnimateInView as="section" className="pt-12 pb-16 bg-white">
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
        </AnimateInView>
      )}

      {/* ── Lo Más Nuevo ─────────────────────────────────────── */}
      {productosMasNuevosList.length > 0 && (
        <AnimateInView as="section" className="pt-12 pb-16 bg-gray-50">
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
        </AnimateInView>
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
