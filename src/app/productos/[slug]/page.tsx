import type { Metadata } from 'next'
import Image from 'next/image'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import { productoPorSlugQuery, productoMetadataQuery, productosRelacionadosQuery, postsInstagramQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/lib/sanity'
import { descuentoVigente, calcularPrecioFinal } from '@/lib/descuento'
import type { Producto, PostInstagram } from '@/sanity/lib/types'
import ProductImageGallery from '@/components/ProductImageGallery'
import ProductBuyOptions from '@/components/ProductBuyOptions'
import ProductDescriptionCollapse from '@/components/ProductDescriptionCollapse'
import ProductPurchaseInfo from '@/components/ProductPurchaseInfo'
import ProductFlexiblePayments from '@/components/ProductFlexiblePayments'
import ProductShareButtons from '@/components/ProductShareButtons'
import MSIStaticBanner from '@/components/MSIStaticBanner'
import MSITicker from '@/components/MSITicker'
import TePodriaGustarSection from '@/components/TePodriaGustarSection'
import AnimateInView from '@/components/AnimateInView'
import InstagramSection from '@/components/InstagramSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import ProductViewTracker from '@/components/ProductViewTracker'

interface ProductoPageProps {
  params: Promise<{ slug: string }>
}

function portableTextToPlain(blocks: Array<{ _type: string; children?: Array<{ text?: string }> }>): string {
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) => b.children?.map((c) => c.text ?? '').join('') ?? '')
    .join(' ')
    .trim()
}

export async function generateMetadata({ params }: ProductoPageProps): Promise<Metadata> {
  const { slug } = await params
  const producto = await sanityFetch<{
    titulo: string
    categoria: string
    precio: number
    tieneDescuento?: boolean
    tipoDescuento?: string
    valorDescuento?: number
    fechaInicioDescuento?: string
    fechaFinDescuento?: string
    descripcion?: Array<{ _type: string; children?: Array<{ text?: string }> }>
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

  const descripcionPlain = producto.descripcion
    ? portableTextToPlain(producto.descripcion).slice(0, 155)
    : `${producto.titulo} — joyería artesanal en plata .925 de Oaxaca.`

  const ogImage = producto.imagenPrincipal
    ? urlFor(producto.imagenPrincipal).width(1200).height(630).url()
    : '/logo.jpg'

  const categoriaLabel: Record<string, string> = {
    dijes: 'Dije de plata',
    collares: 'Collar de plata',
    aretes: 'Aretes de plata',
    pulseras: 'Pulsera de plata',
    anillos: 'Anillo de plata',
    juegos: 'Juego de joyería en plata',
    ambar: 'Joyería de ámbar',
    marquesita: 'Joyería de marquesita',
    filigrana: 'Filigrana oaxaqueña',
  }
  const catLabel = categoriaLabel[producto.categoria] ?? 'Joyería en plata'

  return {
    title: `${producto.titulo} | ${catLabel} · Oaxaca`,
    description: descripcionPlain,
    keywords: [
      producto.titulo,
      catLabel,
      'plata .925',
      'joyería artesanal Oaxaca',
      'joyería hecha a mano',
      'diseños únicos plata',
      producto.categoria === 'ambar' ? 'ámbar Chiapas' : '',
      producto.categoria === 'marquesita' ? 'marquesita plata' : '',
      producto.categoria === 'filigrana' ? 'filigrana oaxaqueña' : '',
    ].filter(Boolean),
    openGraph: {
      title: `${producto.titulo} — $${precioFinal.toLocaleString()} | Conchita Plata`,
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

  const [relacionados, postsInstagram] = await Promise.all([
    sanityFetch<Producto[]>(productosRelacionadosQuery, {
      categoria: producto.categoria,
      excludeId: producto._id,
    }),
    sanityFetch<PostInstagram[]>(postsInstagramQuery),
  ])

  const instagramImageUrls = postsInstagram.map((post) =>
    urlFor(post.imagen).width(400).height(400).quality(90).url()
  )

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

  const stock = producto.stock ?? 1
  const disponibilidadSchema = !producto.disponible || stock === 0
    ? 'https://schema.org/OutOfStock'
    : 'https://schema.org/InStock'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.titulo,
    description: producto.descripcion
      ? portableTextToPlain(
          producto.descripcion as Array<{ _type: string; children?: Array<{ text?: string }> }>
        )
      : `${producto.titulo} — joyería artesanal en plata .925 de Oaxaca.`,
    image: [imagenPrincipalUrl, ...imagenesGaleria],
    sku: producto.slug.current,
    brand: { '@type': 'Brand', name: 'Conchita Plata' },
    offers: {
      '@type': 'Offer',
      url: productUrl || `https://conchitaplata.com/productos/${producto.slug.current}`,
      priceCurrency: 'MXN',
      price: precioFinal,
      availability: disponibilidadSchema,
      seller: { '@type': 'Organization', name: 'Conchita Plata' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-0 sm:p-6 lg:p-8">
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
            <div className="flex flex-col justify-center px-4 py-4 sm:px-0 sm:py-0">
              <AnimateInView delay={0.05} y={16}>
                <div className="mb-4">
                  <span className="inline-block text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full capitalize">
                    {producto.categoria}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {producto.titulo}
                </h1>
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
                  opcionExtra={
                    producto.tieneOpcionExtra &&
                    producto.nombreOpcionExtra &&
                    producto.precioOpcionExtra &&
                    ['dijes', 'collares', 'juegos'].includes(producto.categoria)
                      ? {
                          nombre: producto.nombreOpcionExtra,
                          precio: producto.precioOpcionExtra,
                        }
                      : undefined
                  }
                />
              </AnimateInView>

              <AnimateInView delay={0.15} y={16}>
                <ProductDescriptionCollapse descripcion={producto.descripcion} />
              </AnimateInView>

              <AnimateInView delay={0.2} y={16}>
                <ProductPurchaseInfo />
              </AnimateInView>

              <AnimateInView delay={0.25} y={16}>
                <ProductFlexiblePayments />
              </AnimateInView>

              <AnimateInView delay={0.3} y={16}>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {producto.disponible ? (
                    (() => {
                      const stock = producto.stock ?? 1
                      if (stock === 0) {
                        return (
                          <p className="text-sm text-red-600 font-medium">Agotado</p>
                        )
                      }
                      if (stock <= 3) {
                        return (
                          <p className="text-sm text-amber-600 font-medium">
                            Últimas {stock} {stock === 1 ? 'unidad disponible' : 'unidades disponibles'}
                          </p>
                        )
                      }
                      return (
                        <p className="text-sm text-green-600 font-medium">En stock · {stock} unidades</p>
                      )
                    })()
                  ) : (
                    <p className="text-sm text-red-600 font-medium">Agotado</p>
                  )}
                </div>
              </AnimateInView>

              {productUrl ? (
                <AnimateInView delay={0.35} y={16}>
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
      {postsInstagram.length > 0 && (
        <InstagramSection posts={postsInstagram} imageUrls={instagramImageUrls} />
      )}
    </div>
  )
}



