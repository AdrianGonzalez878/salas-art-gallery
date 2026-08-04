import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import {
  productosCountQuery,
  productosPaginadosRecientesQuery,
  etiquetasDisponiblesQuery,
  artistasFiltroQuery,
} from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'
import ProductGrid from '@/components/ProductGrid'
import Pagination from '@/components/Pagination'
import ProductSearchForm from '@/components/ProductSearchForm'
import ProductFilters, { type ArtistaFiltroOption } from '@/components/ProductFilters'
import { normalizeEtiqueta, uniqueEtiquetas } from '@/lib/etiquetas'
import {
  buildProductosSearchParams,
  parseProductosFiltros,
  tieneFiltrosActivos,
  toSanityFilterParams,
} from '@/lib/productos-filtros'

export const metadata: Metadata = {
  title: 'Obras | Salas Art Gallery',
  description:
    'Explora el catálogo de Salas Art Gallery: obras de arte contemporáneo filtradas por tipo, artista y precio.',
  keywords: [
    'comprar arte online',
    'catálogo de arte',
    'Salas Art Gallery obras',
    'arte contemporáneo',
  ],
  alternates: {
    canonical: '/productos',
  },
}

const PRODUCTOS_POR_PAGINA = 20

interface ProductosPageProps {
  searchParams: Promise<{
    etiqueta?: string
    page?: string
    q?: string
    artista?: string
    precioMin?: string
    precioMax?: string
    disponibilidad?: string
  }>
}

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const params = await searchParams
  const filtros = parseProductosFiltros({
    ...params,
    etiqueta: normalizeEtiqueta(params?.etiqueta),
  })
  const paginaActual = Math.max(1, parseInt(params?.page || '1', 10) || 1)

  const [etiquetasRaw, artistasRaw] = await Promise.all([
    sanityFetch<string[]>(etiquetasDisponiblesQuery),
    sanityFetch<ArtistaFiltroOption[]>(artistasFiltroQuery),
  ])
  const etiquetas = uniqueEtiquetas(etiquetasRaw)
  const artistas = (artistasRaw ?? []).filter((a) => a.slug && a.nombre)

  const etiquetaFiltro =
    filtros.etiqueta &&
    etiquetas.find((tag) => tag.toLowerCase() === filtros.etiqueta.toLowerCase())
      ? etiquetas.find((tag) => tag.toLowerCase() === filtros.etiqueta.toLowerCase())!
      : ''

  const artistaFiltro =
    filtros.artista &&
    artistas.find((a) => a.slug.toLowerCase() === filtros.artista.toLowerCase())
      ? artistas.find((a) => a.slug.toLowerCase() === filtros.artista.toLowerCase())!.slug
      : ''

  const filtrosValidos = {
    ...filtros,
    etiqueta: etiquetaFiltro,
    artista: artistaFiltro,
    orden: 'recientes',
  }

  const skip = (paginaActual - 1) * PRODUCTOS_POR_PAGINA
  const end = skip + PRODUCTOS_POR_PAGINA
  const queryParams = toSanityFilterParams(filtrosValidos, skip, end)

  const [productos, totalProductos] = await Promise.all([
    sanityFetch<Producto[]>(productosPaginadosRecientesQuery, queryParams),
    sanityFetch<number>(productosCountQuery, queryParams),
  ])

  const totalPaginas = Math.max(1, Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA))
  if (paginaActual > totalPaginas && totalProductos > 0) {
    const search = buildProductosSearchParams({ ...filtrosValidos, page: 1 })
    redirect(`/productos?${search.toString()}`)
  }

  const tituloSeccion = filtrosValidos.q
    ? `Búsqueda: "${filtrosValidos.q}"`
    : etiquetaFiltro || (artistaFiltro
        ? artistas.find((a) => a.slug === artistaFiltro)?.nombre || 'Obras'
        : 'Todas las obras')

  const desde = totalProductos === 0 ? 0 : skip + 1
  const hasta = Math.min(skip + PRODUCTOS_POR_PAGINA, totalProductos)
  const filtrosActivos = tieneFiltrosActivos(filtrosValidos)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        <div className="mb-6 sm:mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-0.5 bg-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                {filtrosValidos.q ? 'Búsqueda' : 'Catálogo'}
              </span>
              <div className="w-8 h-0.5 bg-amber-400" />
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-2 sm:mb-3">
              {tituloSeccion}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
              {totalPaginas > 1
                ? `${desde}–${hasta} de ${totalProductos} obra${totalProductos !== 1 ? 's' : ''}`
                : `${totalProductos} obra${totalProductos !== 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 space-y-3 sm:space-y-0">
            <Suspense fallback={null}>
              <ProductSearchForm initialQuery={filtrosValidos.q} />
            </Suspense>
          </div>

          <div className="mt-3 sm:mt-6 sm:pt-6 sm:border-t sm:border-gray-100">
            <Suspense fallback={null}>
              <ProductFilters etiquetas={etiquetas} artistas={artistas} />
            </Suspense>
            {filtrosActivos && (
              <div className="mt-3 text-center">
                <Link
                  href="/productos"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2"
                >
                  Ver todas
                </Link>
              </div>
            )}
          </div>
        </div>

        <ProductGrid productos={productos} />

        <Pagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          etiqueta={etiquetaFiltro || undefined}
          q={filtrosValidos.q || undefined}
          artista={artistaFiltro || undefined}
          precioMin={filtrosValidos.precioMin || undefined}
          precioMax={filtrosValidos.precioMax || undefined}
          disponibilidad={filtrosValidos.disponibilidad}
        />
      </div>
    </div>
  )
}
