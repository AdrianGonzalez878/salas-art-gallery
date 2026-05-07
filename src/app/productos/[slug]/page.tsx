import Image from 'next/image'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import { productoPorSlugQuery, productosRelacionadosQuery, postsInstagramQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/lib/sanity'
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
import InstagramSection from '@/components/InstagramSection'

interface ProductoPageProps {
  params: Promise<{ slug: string }>
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

  let precioFinal = producto.precio
  if (producto.tieneDescuento && producto.tipoDescuento && producto.valorDescuento) {
    if (producto.tipoDescuento === 'porcentaje') {
      precioFinal = producto.precio * (1 - producto.valorDescuento / 100)
    } else if (producto.tipoDescuento === 'monto') {
      precioFinal = Math.max(0, producto.precio - producto.valorDescuento)
    }
  }
  precioFinal = Math.round(precioFinal)

  const imagenPrincipalUrl = producto.imagenPrincipal
    ? urlFor(producto.imagenPrincipal).width(1200).quality(90).url()
    : '/placeholder.jpg'

  const imagenesGaleria =
    producto.galeria?.map((img) =>
      urlFor(img).width(1200).quality(90).url()
    ) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <MSIStaticBanner />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-0 sm:p-6 lg:p-8">
            {/* Galería interactiva */}
            <ProductImageGallery
              imagenPrincipalUrl={imagenPrincipalUrl}
              imagenPrincipalAlt={producto.imagenPrincipal?.alt || producto.titulo}
              imagenesGaleria={imagenesGaleria}
              titulo={producto.titulo}
            />

            {/* Información del producto */}
            <div className="flex flex-col justify-center px-4 py-4 sm:px-0 sm:py-0">
              <div className="mb-4">
                <span className="inline-block text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full capitalize">
                  {producto.categoria}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {producto.titulo}
              </h1>
              <ProductBuyOptions
                id={producto._id}
                slug={producto.slug.current}
                title={producto.titulo}
                price={precioFinal}
                precioOriginal={producto.precio}
                tieneDescuento={producto.tieneDescuento}
                tipoDescuento={producto.tipoDescuento}
                valorDescuento={producto.valorDescuento}
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
              <ProductDescriptionCollapse descripcion={producto.descripcion} />
              <ProductPurchaseInfo />
              <ProductFlexiblePayments />
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Disponibilidad:</span>{' '}
                  {producto.disponible ? (
                    <span className="text-green-600">En stock</span>
                  ) : (
                    <span className="text-red-600">Agotado</span>
                  )}
                </p>
              </div>
              {productUrl ? <ProductShareButtons title={producto.titulo} url={productUrl} /> : null}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-8 w-full">
        <MSITicker />
      </div>
      <TePodriaGustarSection productos={relacionados} />
      {postsInstagram.length > 0 && (
        <InstagramSection posts={postsInstagram} imageUrls={instagramImageUrls} />
      )}
    </div>
  )
}



