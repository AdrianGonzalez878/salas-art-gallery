import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import {
  productosCountQuery,
  productosCountDestacadosQuery,
  productosCountBusquedaQuery,
  productosPaginadosRecientesQuery,
  productosPaginadosPrecioAscQuery,
  productosPaginadosPrecioDescQuery,
  productosPaginadosDestacadosQuery,
  productosBusquedaQuery,
} from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'
import ProductGrid from '@/components/ProductGrid'
import OrdenSelector from '@/components/OrdenSelector'
import Pagination from '@/components/Pagination'
import {
  categoriasMap,
  labelCategoria,
  labelSubcategoria,
  subcategoriasCeramicaMap,
} from '@/lib/categorias'

export const metadata: Metadata = {
  title: 'Obras | Salas Art Gallery',
  description:
    'Explora el catálogo de Salas Art Gallery: litografía, acrílicos, óleos, cerámica, bronce y más.',
  keywords: [
    'comprar arte online',
    'catálogo de arte',
    'litografía',
    'cerámica',
    'óleos',
    'Salas Art Gallery obras',
  ],
  alternates: {
    canonical: '/productos',
  },
}

const PRODUCTOS_POR_PAGINA = 20

interface ProductosPageProps {
  searchParams: Promise<{
    categoria?: string
    subcategoria?: string
    orden?: string
    page?: string
    q?: string
  }>
}

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const params = await searchParams
  const categoria = params?.categoria
  const subcategoria = params?.subcategoria
  const orden = params?.orden || 'recientes'
  const pageRaw = params?.page
  const q = (params?.q ?? '').trim()
  const paginaActual = Math.max(1, parseInt(pageRaw || '1', 10) || 1)

  const categoriaFiltro = categoria && categoriasMap[categoria] ? categoria : ''
  const subcategoriaFiltro =
    categoriaFiltro === 'ceramica' &&
    subcategoria &&
    subcategoriasCeramicaMap[subcategoria]
      ? subcategoria
      : ''
  const skip = (paginaActual - 1) * PRODUCTOS_POR_PAGINA
  const end = skip + PRODUCTOS_POR_PAGINA

  const isBusqueda = q.length > 0
  const pattern = isBusqueda ? `%${q.toLowerCase()}%` : ''

  let productos: Producto[]
  let totalProductos: number

  if (isBusqueda) {
    const [productosList, total] = await Promise.all([
      sanityFetch<Producto[]>(productosBusquedaQuery, { pattern, skip, end }),
      sanityFetch<number>(productosCountBusquedaQuery, { pattern }),
    ])
    productos = productosList
    totalProductos = total
  } else {
    const queryParams = {
      categoria: categoriaFiltro,
      subcategoria: subcategoriaFiltro,
      skip,
      end,
    }
    const queries = {
      recientes: productosPaginadosRecientesQuery,
      'precio-asc': productosPaginadosPrecioAscQuery,
      'precio-desc': productosPaginadosPrecioDescQuery,
      destacadas: productosPaginadosDestacadosQuery,
    } as const
    const query = queries[orden as keyof typeof queries] ?? queries.recientes
    const countQuery = orden === 'destacadas' ? productosCountDestacadosQuery : productosCountQuery
    const [productosList, total] = await Promise.all([
      sanityFetch<Producto[]>(query, queryParams),
      sanityFetch<number>(countQuery, {
        categoria: categoriaFiltro,
        subcategoria: subcategoriaFiltro,
      }),
    ])
    productos = productosList
    totalProductos = total
  }

  const totalPaginas = Math.max(1, Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA))
  if (paginaActual > totalPaginas && totalProductos > 0) {
    const search = new URLSearchParams()
    if (isBusqueda) search.set('q', q)
    if (categoriaFiltro) search.set('categoria', categoriaFiltro)
    if (subcategoriaFiltro) search.set('subcategoria', subcategoriaFiltro)
    if (orden !== 'recientes') search.set('orden', orden)
    search.set('page', '1')
    redirect(`/productos?${search.toString()}`)
  }
  const productosParaMostrar = productos

  const categoriaNombre = isBusqueda
    ? `Búsqueda: "${q}"`
    : categoriaFiltro
      ? subcategoriaFiltro
        ? `${labelCategoria(categoriaFiltro)} · ${labelSubcategoria(subcategoriaFiltro)}`
        : labelCategoria(categoriaFiltro)
      : 'Todas las obras'

  const desde = totalProductos === 0 ? 0 : skip + 1
  const hasta = Math.min(skip + PRODUCTOS_POR_PAGINA, totalProductos)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        <div className="mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-0.5 bg-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                {isBusqueda ? 'Búsqueda' : (categoriaFiltro ? 'Categoría' : 'Catálogo')}
              </span>
              <div className="w-8 h-0.5 bg-amber-400" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-3">
              {categoriaNombre}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
              {totalPaginas > 1
                ? `${desde}–${hasta} de ${totalProductos} obra${totalProductos !== 1 ? 's' : ''}`
                : `${totalProductos} obra${totalProductos !== 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <OrdenSelector />
            {(categoriaFiltro || isBusqueda) && (
              <Link
                href="/productos"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2 whitespace-nowrap"
              >
                Ver todas
              </Link>
            )}
          </div>

          {!isBusqueda && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">
                Categorías
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/productos"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !categoriaFiltro
                      ? 'bg-amber-400 text-gray-900 shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </Link>
                {Object.entries(categoriasMap).map(([key, nombre]) => (
                  <Link
                    key={key}
                    href={`/productos?categoria=${key}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      categoriaFiltro === key && !subcategoriaFiltro
                        ? 'bg-amber-400 text-gray-900 shadow-sm'
                        : categoriaFiltro === key
                          ? 'bg-amber-200 text-gray-900'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {nombre}
                  </Link>
                ))}
              </div>

              {categoriaFiltro === 'ceramica' && (
                <div className="mt-4">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">
                    Subcategoría
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Link
                      href="/productos?categoria=ceramica"
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        !subcategoriaFiltro
                          ? 'bg-violet-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Todas
                    </Link>
                    {Object.entries(subcategoriasCeramicaMap).map(([key, nombre]) => (
                      <Link
                        key={key}
                        href={`/productos?categoria=ceramica&subcategoria=${key}`}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          subcategoriaFiltro === key
                            ? 'bg-violet-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {nombre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ProductGrid productos={productosParaMostrar} />

        <Pagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          categoria={categoriaFiltro || undefined}
          subcategoria={subcategoriaFiltro || undefined}
          orden={orden !== 'recientes' ? orden : undefined}
          q={isBusqueda ? q : undefined}
        />
      </div>
    </div>
  )
}
