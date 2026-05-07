import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import {
  productosCountQuery,
  productosCountMasVendidosQuery,
  productosCountBusquedaQuery,
  productosPaginadosRecientesQuery,
  productosPaginadosPrecioAscQuery,
  productosPaginadosPrecioDescQuery,
  productosPaginadosMasVendidosQuery,
  productosBusquedaQuery,
} from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'
import ProductGrid from '@/components/ProductGrid'
import OrdenSelector from '@/components/OrdenSelector'
import Pagination from '@/components/Pagination'

export const metadata: Metadata = {
  title: 'Tienda de Joyería en Plata · Oaxaca',
  description:
    'Compra joyería artesanal en plata .925: filigrana oaxaqueña, ámbar, marquesita, dijes, collares, aretes, pulseras y anillos. Diseños únicos hechos a mano en Oaxaca, México.',
  keywords: [
    'comprar joyería plata Oaxaca',
    'tienda joyería plata online',
    'filigrana plata Oaxaca',
    'ámbar joyería México',
    'marquesita plata',
    'dijes plata .925',
    'aretes plata Oaxaca',
    'collares plata artesanal',
  ],
  alternates: {
    canonical: '/productos',
  },
}

const PRODUCTOS_POR_PAGINA = 20

interface ProductosPageProps {
  searchParams: Promise<{ categoria?: string; orden?: string; page?: string; q?: string }>
}

const categoriasMap: Record<string, string> = {
  anillos: 'Anillos',
  collares: 'Collares',
  aretes: 'Aretes',
  pulseras: 'Pulseras',
  dijes: 'Dijes',
  cadenas: 'Cadenas',
  juegos: 'Juegos',
}

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const params = await searchParams
  const categoria = params?.categoria
  const orden = params?.orden || 'recientes'
  const pageRaw = params?.page
  const q = (params?.q ?? '').trim()
  const paginaActual = Math.max(1, parseInt(pageRaw || '1', 10) || 1)

  const categoriaFiltro = categoria && categoriasMap[categoria] ? categoria : ''
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
    const queryParams = { categoria: categoriaFiltro, skip, end }
    const queries = {
      recientes: productosPaginadosRecientesQuery,
      'precio-asc': productosPaginadosPrecioAscQuery,
      'precio-desc': productosPaginadosPrecioDescQuery,
      'mas-vendidos': productosPaginadosMasVendidosQuery,
    } as const
    const query = queries[orden as keyof typeof queries] ?? queries.recientes
    const countQuery = orden === 'mas-vendidos' ? productosCountMasVendidosQuery : productosCountQuery
    const [productosList, total] = await Promise.all([
      sanityFetch<Producto[]>(query, queryParams),
      sanityFetch<number>(countQuery, { categoria: categoriaFiltro }),
    ])
    productos = productosList
    totalProductos = total
  }

  const totalPaginas = Math.max(1, Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA))
  if (paginaActual > totalPaginas && totalProductos > 0) {
    const search = new URLSearchParams()
    if (isBusqueda) search.set('q', q)
    if (categoriaFiltro) search.set('categoria', categoriaFiltro)
    if (orden !== 'recientes') search.set('orden', orden)
    search.set('page', '1')
    redirect(`/productos?${search.toString()}`)
  }
  const productosParaMostrar = productos

  const categoriaNombre = isBusqueda
    ? `Búsqueda: "${q}"`
    : categoria && categoriasMap[categoria]
      ? categoriasMap[categoria]
      : 'Todos los Productos'

  const desde = totalProductos === 0 ? 0 : skip + 1
  const hasta = Math.min(skip + PRODUCTOS_POR_PAGINA, totalProductos)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        {/* ── Cabecera de sección ──────────────────────────────── */}
        <div className="mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-0.5 bg-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                {isBusqueda ? 'Búsqueda' : (categoria ? 'Categoría' : 'Tienda')}
              </span>
              <div className="w-8 h-0.5 bg-amber-400" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-3">
              {categoriaNombre}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7.414A2 2 0 0020.414 7L17 3.586A2 2 0 0015.586 3H5z" />
              </svg>
              {totalPaginas > 1
                ? `${desde}–${hasta} de ${totalProductos} producto${totalProductos !== 1 ? 's' : ''}`
                : `${totalProductos} producto${totalProductos !== 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Orden + Ver todos */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <OrdenSelector />
            {(categoria || isBusqueda) && (
              <Link
                href="/productos"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2 whitespace-nowrap"
              >
                Ver todos
              </Link>
            )}
          </div>

          {/* Pills categorías */}
          {!isBusqueda && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">
                Categorías
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/productos"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !categoria
                      ? 'bg-amber-400 text-gray-900 shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </Link>
                {Object.entries(categoriasMap).map(([key, nombre]) => (
                  <Link
                    key={key}
                    href={`/productos?categoria=${key}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      categoria === key
                        ? 'bg-amber-400 text-gray-900 shadow-sm'
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

        {/* ── Banner de envío ──────────────────────────────────── */}
        <div className="mb-8 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-amber-50 border border-amber-100">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <p className="text-sm text-amber-900 font-medium">
            <span className="font-bold">Envío gratis</span> en compras desde $999 · Entrega personal en Oaxaca capital
          </p>
        </div>

        {/* ── Grid de productos ────────────────────────────────── */}
        <ProductGrid productos={productosParaMostrar} />

        <Pagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          categoria={categoriaFiltro || undefined}
          orden={orden !== 'recientes' ? orden : undefined}
          q={isBusqueda ? q : undefined}
        />
      </div>
    </div>
  )
}

