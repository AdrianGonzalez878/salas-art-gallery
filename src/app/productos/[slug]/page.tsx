import type { Metadata } from 'next'
import Image from 'next/image'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import { productoPorSlugQuery, productoMetadataQuery, productosRelacionadosQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/lib/sanity'
import { descuentoVigente, calcularPrecioFinal } from '@/lib/descuento'
import { labelCategoria, labelSubcategoria } from '@/lib/categorias'
import type { Producto } from '@/sanity/lib/types'
import ProductImageGallery from '@/components/ProductImageGallery'
import ProductBuyOptions from '@/components/ProductBuyOptions'
import ProductObraFicha from '@/components/ProductObraFicha'
import ProductShareButtons from '@/components/ProductShareButtons'
import MSIStaticBanner from '@/components/MSIStaticBanner'
import MSITicker from '@/components/MSITicker'
import TePodriaGustarSection from '@/components/TePodriaGustarSection'
import AnimateInView from '@/components/AnimateInView'
import TestimonialsSection from '@/components/TestimonialsSection'
import ProductViewTracker from '@/components/ProductViewTracker'

interface ProductoPageProps {
  params: Promise<{ slug: string }>
}

function metaDescription(titulo: string, artista?: string | null): string {
  const base = artista ? `${titulo} — ${artista}` : titulo
  return `${base} — obra disponible en Salas Art Gallery.`
}

export async function generateMetadata({ params }: ProductoPageProps): Promise<Metadata> {
  const { slug } = await params
  const producto = await sanityFetch<{
    titulo: string
    categoria: string
    subcategoria?: string
    artista?: { nombre?: string; slug?: { current: string } } | null
    precio: number
    tieneDescuento?: boolean
    tipoDescuento?: string
    valorDescuento?: number
    fechaInicioDescuento?: string
    fechaFinDescuento?: string
    imagenPrincipal?: { asset: { _ref: string }; alt?: string }
    slug: string
  } | null>(productoMetadataQuery, { slug })

  if (!producto) return {}

  const precioFinal = calcularPrecioFinal(
    producto.precio,
    producto.tieneDescuento,
    producto.tipoDescuento,
    producto.valorDescuento,
    producto.fechaInicioDescuento,
    producto.fechaFinDescuento,
  )

  const descripcionPlain = metaDescription(producto.titulo, producto.artista?.nombre)

  const ogImage = producto.imagenPrincipal
    ? urlFor(producto.imagenPrincipal).width(1200).height(630).url()
    : '/logo.png'

  const catLabel = labelCategoria(producto.categoria)
  const subLabel = labelSubcategoria(producto.subcategoria)

  return {
    title: `${producto.titulo}${producto.artista?.nombre ? ` — ${producto.artista.nombre}` : ''} | ${catLabel}`,
    description: descripcionPlain,
    keywords: [
      producto.titulo,
      catLabel,
      subLabel,
      producto.artista?.nombre,
      'Salas Art Gallery',
      'arte contemporáneo',
      'obra de arte',
    ].filter(Boolean) as string[],
    openGraph: {
      title: `${producto.titulo} — $${precioFinal.toLocaleString()} | Salas Art Gallery`,
      description: descripcionPlain,
      images: [{ url: ogImage, width: 1200, height: 630, alt: producto.titulo }],
      type: 'website',
    },
    alternates: {
      canonical: `/productos/${slug}`,
    },
  }
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params
  const producto: Producto | null = await sanityFetch(productoPorSlugQuery, {
    slug,
  })

  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const protocol = headersList.get('x-forwarded-proto') ?? 'http'
  const productUrl = host ? `${protocol}://${host}/productos/${slug}` : ''

  if (!producto || !producto.disponible) {
    notFound()
  }

  const relacionados = await sanityFetch<Producto[]>(productosRelacionadosQuery, {
    categoria: producto.categoria,
    excludeId: producto._id,
  })

  const descuentoActivo = descuentoVigente(
    producto.tieneDescuento,
    producto.fechaInicioDescuento,
    producto.fechaFinDescuento,
  )
  const precioFinal = calcularPrecioFinal(
    producto.precio,
    producto.tieneDescuento,
    producto.tipoDescuento,
    producto.valorDescuento,
    producto.fechaInicioDescuento,
    producto.fechaFinDescuento,
  )

  const imagenPrincipalUrl = producto.imagenPrincipal
    ? urlFor(producto.imagenPrincipal).width(1200).quality(90).url()
    : '/placeholder.jpg'

  const imagenesGaleria =
    producto.galeria?.map((img) =>
      urlFor(img).width(1200).quality(90).url()
    ) || []

  const disponibilidadSchema = producto.disponible
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.titulo,
    description: metaDescription(producto.titulo, producto.artista?.nombre),
    image: [imagenPrincipalUrl, ...imagenesGaleria],
    sku: producto.slug.current,
    brand: { '@type': 'Brand', name: 'Salas Art Gallery' },
    offers: {
      '@type': 'Offer',
      url: productUrl || `https://salasartgallery.com/productos/${producto.slug.current}`,
      priceCurrency: 'MXN',
      price: precioFinal,
      availability: disponibilidadSchema,
      seller: { '@type': 'Organization', name: 'Salas Art Gallery' },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductViewTracker
        id={producto._id}
        name={producto.titulo}
        price={precioFinal}
      />
      <div className="w-full">
        <MSIStaticBanner />
      </div>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-8 p-0 sm:p-6 lg:p-8">
            {/* Galería interactiva */}
            <AnimateInView y={20}>
              <ProductImageGallery
                imagenPrincipalUrl={imagenPrincipalUrl}
                imagenPrincipalAlt={producto.imagenPrincipal?.alt || producto.titulo}
                imagenesGaleria={imagenesGaleria}
                titulo={producto.titulo}
              />
            </AnimateInView>

            {/* Información del producto */}
            <div className="flex flex-col gap-2 px-3 pb-3 sm:gap-0 sm:px-0 sm:pb-0 sm:py-0">
              <AnimateInView delay={0.05} y={16}>
                <ProductObraFicha
                  producto={producto}
                  precioFinal={precioFinal}
                  descuentoActivo={descuentoActivo}
                />
              </AnimateInView>

              <AnimateInView delay={0.1} y={16}>
                <ProductBuyOptions
                  id={producto._id}
                  slug={producto.slug.current}
                  title={producto.titulo}
                  price={precioFinal}
                  precioOriginal={producto.precio}
                  descuentoActivo={descuentoActivo}
                  tipoDescuento={producto.tipoDescuento}
                  valorDescuento={producto.valorDescuento}
                  textoBadge={producto.textoBadge}
                  imageUrl={imagenPrincipalUrl}
                  showPrice={false}
                />
              </AnimateInView>

              {productUrl ? (
                <AnimateInView delay={0.2} y={16}>
                  <ProductShareButtons title={producto.titulo} url={productUrl} />
                </AnimateInView>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-8 w-full">
        <MSITicker />
      </div>
      <TePodriaGustarSection productos={relacionados} />
      <TestimonialsSection />
    </div>
  )
}



