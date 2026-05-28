import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { productosConDescuentoQuery, promocionesCompraMinima as promocionesQuery } from '@/sanity/lib/queries'
import type { Promocion, Producto } from '@/sanity/lib/types'
import { descuentoVigente } from '@/lib/descuento'
import AnimateInView from '@/components/AnimateInView'
import Pagination from '@/components/Pagination'
import OrdenSelector from '@/components/OrdenSelector'

const PRODUCTOS_POR_PAGINA = 20

const categoriasMap: Record<string, string> = {
  anillos: 'Anillos',
  collares: 'Collares',
  aretes: 'Aretes',
  pulseras: 'Pulseras',
  dijes: 'Dijes',
  cadenas: 'Cadenas',
  juegos: 'Juegos',
}

function filtrarPorFecha(promos: Promocion[]): Promocion[] {
  const ahora = new Date().toISOString()
  return promos.filter((p) => {
    if (p.fechaInicio && p.fechaInicio > ahora) return false
    if (p.fechaFin && p.fechaFin < ahora) return false
    return true
  })
}

function formatearPeriodoOferta(fechaInicio?: string | null, fechaFin?: string | null): string | null {
  if (!fechaInicio && !fechaFin) return null
  const opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  }
  if (fechaInicio && fechaFin) {
    const d1 = new Date(fechaInicio)
    const d2 = new Date(fechaFin)
    return `Del ${d1.toLocaleDateString('es-MX', opts)} al ${d2.toLocaleDateString('es-MX', opts)}`
  }
  if (fechaFin) {
    const d = new Date(fechaFin)
    return `Válido hasta el ${d.toLocaleDateString('es-MX', opts)}`
  }
  if (fechaInicio) {
    const d = new Date(fechaInicio)
    return `Válido desde el ${d.toLocaleDateString('es-MX', opts)}`
  }
  return null
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
  if (orden === 'mas-vendidos') {
    lista = [...lista].sort((a, b) => (b.ventas ?? 0) - (a.ventas ?? 0))
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
    categoria && categoriasMap[categoria] ? categoriasMap[categoria] : 'Productos en oferta'
  const desde = totalProductosOferta === 0 ? 0 : inicio + 1
  const hasta = Math.min(inicio + PRODUCTOS_POR_PAGINA, totalProductosOferta)

  // Obtener promociones de compra mínima
  const promociones = await sanityFetch<Promocion[]>(promocionesQuery)
  const promocionesCompraMinima = filtrarPorFecha(promociones)

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── Banners de compra mínima ──────────────────────────── */}
      {promocionesCompraMinima.length > 0 && (
        <div className="w-full">
          <div className="space-y-0">
            {promocionesCompraMinima.map((promo) => {
              const imagenUrl = promo.imagenBanner?.asset
                ? urlFor(promo.imagenBanner).width(1920).quality(90).url()
                : null
              const periodoOferta = formatearPeriodoOferta(promo.fechaInicio, promo.fechaFin)

              return (
                <AnimateInView key={promo._id} y={20}>
                  <div className="relative w-full overflow-hidden">
                  <div className="relative w-full min-h-[340px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[640px] bg-gray-900">
                    {imagenUrl && (
                      <Image
                        src={imagenUrl}
                        alt={promo.titulo}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
                  </div>

                  {/* Texto sobre el banner */}
                  <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-16 lg:px-24 pb-10 sm:pb-14 md:pb-18 lg:pb-20">
                    <div className="max-w-3xl">
                      {/* Badge monto */}
                      <div className="mb-4 sm:mb-5">
                        <span className="inline-flex items-center gap-1.5 bg-amber-400 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm sm:text-base shadow-md">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                          </svg>
                          Compra desde ${promo.montoMinimo.toLocaleString()}
                        </span>
                      </div>

                      {/* Línea decorativa */}
                      <div className="w-10 h-0.5 bg-amber-400 mb-4" />

                      {/* Título */}
                      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-3 sm:mb-4">
                        {promo.titulo}
                      </h2>

                      {/* Periodo */}
                      {periodoOferta && (
                        <p className="flex items-center gap-2 text-sm sm:text-base text-gray-200 mb-3">
                          <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {periodoOferta}
                        </p>
                      )}

                      {/* Descripción */}
                      {promo.descripcion && (
                        <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-xl leading-relaxed">
                          {promo.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                  </div>
                </AnimateInView>
              )
            })}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {productosConDescuento.length === 0 && promocionesCompraMinima.length === 0 ? (
          /* Sin promociones */
          <AnimateInView className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Sin promociones activas</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              No hay promociones en este momento. Revisa más tarde o explora nuestro catálogo completo.
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Ver todos los productos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimateInView>
        ) : (
          <>
            {productosConDescuento.length > 0 && (
              <div>
                {/* Cabecera de sección */}
                <AnimateInView className="mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-0.5 bg-amber-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                        Ofertas
                      </span>
                      <div className="w-8 h-0.5 bg-amber-400" />
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                      {categoriaNombre}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {totalPaginasOferta > 1
                        ? `${desde}–${hasta} de ${totalProductosOferta} producto${totalProductosOferta !== 1 ? 's' : ''} en oferta`
                        : `${totalProductosOferta} producto${totalProductosOferta !== 1 ? 's' : ''} en oferta`}
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
                            ? 'bg-amber-400 text-gray-900 shadow-sm'
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
                              ? 'bg-amber-400 text-gray-900 shadow-sm'
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
                          className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-300 overflow-hidden"
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
                            <div className="absolute top-2.5 left-2.5 bg-amber-400 text-gray-900 px-2.5 py-1 rounded-lg font-bold text-xs shadow-sm">
                              {descuentoLabel}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-3 sm:p-4">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-amber-700 transition-colors">
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
                              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0 group-hover:bg-amber-400 group-hover:text-white transition-colors">
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
