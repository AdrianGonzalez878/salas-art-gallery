import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { productosConDescuentoQuery } from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'
import { descuentoVigente } from '@/lib/descuento'
import AnimateInView from '@/components/AnimateInView'
import Pagination from '@/components/Pagination'
import OrdenSelector from '@/components/OrdenSelector'

const PRODUCTOS_POR_PAGINA = 20

const categoriasMap: Record<string, string> = {
  litografia: 'Litografía',
  acrilicos: 'Acrílicos',
  'arte-objeto': 'Arte objeto',
  oleos: 'Óleos',
  'madera-tallada': 'Madera tallada',
  ceramica: 'Cerámica',
  bronce: 'Bronce',
}

export default async function PromocionesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; categoria?: string; orden?: string }>
}) {
  const params = await searchParams
  const pageParam = params?.page
  const categoria = params?.categoria
  const orden = params?.orden || 'recientes'
  const paginaActual = Math.max(1, parseInt(pageParam || '1', 10) || 1)

  const categoriaFiltro = categoria && categoriasMap[categoria] ? categoria : ''

  // Obtener productos con descuento
  const productosConDescuento = await sanityFetch<Producto[]>(productosConDescuentoQuery)
  let lista = productosConDescuento.filter(
    (p) => descuentoVigente(p.tieneDescuento, p.fechaInicioDescuento, p.fechaFinDescuento) && p.tipoDescuento && p.valorDescuento
  )

  // Filtrar por categoría
  if (categoriaFiltro) {
    lista = lista.filter((p) => p.categoria === categoriaFiltro)
  }

  // Ordenar
  if (orden === 'destacadas') {
    lista = [...lista].sort((a, b) => Number(b.destacada) - Number(a.destacada))
  } else if (orden === 'precio-asc') {
    lista = [...lista].sort((a, b) => a.precio - b.precio)
  } else if (orden === 'precio-desc') {
    lista = [...lista].sort((a, b) => b.precio - a.precio)
  }
  // 'recientes': el query ya viene por _createdAt desc, orden se mantiene

  const totalProductosOferta = lista.length
  const totalPaginasOferta = Math.max(1, Math.ceil(totalProductosOferta / PRODUCTOS_POR_PAGINA))

  if (paginaActual > totalPaginasOferta && totalProductosOferta > 0) {
    const search = new URLSearchParams()
    if (categoriaFiltro) search.set('categoria', categoriaFiltro)
    if (orden !== 'recientes') search.set('orden', orden)
    search.set('page', '1')
    redirect(`/promociones?${search.toString()}`)
  }

  const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA
  const productosPagina = lista.slice(inicio, inicio + PRODUCTOS_POR_PAGINA)

  const categoriaNombre =
    categoria && categoriasMap[categoria] ? categoriasMap[categoria] : 'Selección con precio especial'
  const desde = totalProductosOferta === 0 ? 0 : inicio + 1
  const hasta = Math.min(inicio + PRODUCTOS_POR_PAGINA, totalProductosOferta)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {totalProductosOferta === 0 ? (
          /* Sin promociones */
          <AnimateInView className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-light text-gray-900 mb-3">No hay una selección especial activa</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Explora la colección completa o vuelve pronto para descubrir nuevas obras seleccionadas.
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-700 text-white font-semibold rounded-full hover:bg-violet-800 transition-colors"
            >
              Explorar obras
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimateInView>
        ) : (
          <>
            {totalProductosOferta > 0 && (
              <div>
                {/* Cabecera de sección */}
                <AnimateInView className="mb-8 rounded-2xl bg-[#f7f6f8] border border-violet-100 p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-px bg-violet-500" />
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                        Selección temporal
                      </span>
                      <div className="w-8 h-px bg-violet-500" />
                    </div>
                    <h1 className="font-display text-3xl sm:text-5xl font-light text-gray-900 tracking-tight mb-3">
                      {categoriaNombre}
                    </h1>
                    <p className="max-w-xl text-sm leading-relaxed text-gray-600 mb-4">
                      Obras seleccionadas por la galería con condiciones especiales por tiempo limitado.
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-white text-violet-800 border border-violet-200">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {totalPaginasOferta > 1
                        ? `${desde}–${hasta} de ${totalProductosOferta} obra${totalProductosOferta !== 1 ? 's' : ''}`
                        : `${totalProductosOferta} obra${totalProductosOferta !== 1 ? 's' : ''} con precio especial`}
                    </span>
                  </div>

                  {/* Orden + Ver todos */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-100">
                    <OrdenSelector />
                    {categoriaFiltro && (
                      <Link
                        href="/promociones"
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2"
                      >
                        Ver todos
                      </Link>
                    )}
                  </div>

                  {/* Pills categorías */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">
                      Categorías
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Link
                        href="/promociones"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          !categoriaFiltro
                            ? 'bg-violet-700 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Todos
                      </Link>
                      {Object.entries(categoriasMap).map(([key, nombre]) => (
                        <Link
                          key={key}
                          href={`/promociones?categoria=${key}`}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            categoriaFiltro === key
                              ? 'bg-violet-700 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {nombre}
                        </Link>
                      ))}
                    </div>
                  </div>
                </AnimateInView>

                {/* Grid productos */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                  {productosPagina.map((producto, index) => {
                    const imagenUrl = urlFor(producto.imagenPrincipal)
                      .width(400).height(400).quality(90).url()

                    const valor = producto.valorDescuento ?? 0
                    let precioFinal = producto.precio
                    if (producto.tipoDescuento === 'porcentaje') {
                      precioFinal = producto.precio * (1 - valor / 100)
                    } else if (producto.tipoDescuento === 'monto') {
                      precioFinal = Math.max(0, producto.precio - valor)
                    }

                    const descuentoLabel =
                      producto.tipoDescuento === 'porcentaje'
                        ? `${valor}% OFF`
                        : `$${valor} OFF`

                    return (
                      <AnimateInView
                        key={producto._id}
                        delay={(index % 4) * 0.06}
                        y={16}
                      >
                        <Link
                          href={`/productos/${producto.slug.current}`}
                          className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:border-violet-300 hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                          {/* Imagen */}
                          <div className="relative aspect-square bg-gray-50 overflow-hidden">
                            <Image
                              src={imagenUrl}
                              alt={producto.titulo}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                            {/* Badge de descuento */}
                            <div className="absolute top-2.5 left-2.5 bg-violet-700 text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-sm">
                              {descuentoLabel}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-3 sm:p-4">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-violet-800 transition-colors">
                              {producto.titulo}
                            </h3>
                            <p className="text-xs text-gray-400 mb-2.5 line-clamp-1 capitalize">
                              {producto.categoria}
                            </p>
                            <div className="flex items-end justify-between gap-2">
                              <div>
                                <p className="text-xs text-gray-400 line-through leading-none mb-0.5">
                                  ${producto.precio.toLocaleString()}
                                </p>
                                <p className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                                  ${Math.round(precioFinal).toLocaleString()}
                                </p>
                              </div>
                              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-700 flex-shrink-0 group-hover:bg-violet-700 group-hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </AnimateInView>
                    )
                  })}
                </div>

                {totalPaginasOferta > 1 && (
                  <AnimateInView className="mt-8">
                    <Pagination
                      paginaActual={paginaActual}
                      totalPaginas={totalPaginasOferta}
                      basePath="/promociones"
                      categoria={categoriaFiltro || undefined}
                      orden={orden !== 'recientes' ? orden : undefined}
                    />
                  </AnimateInView>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
