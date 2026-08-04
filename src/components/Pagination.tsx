'use client'

import Link from 'next/link'
import type { DisponibilidadFiltro } from '@/lib/productos-filtros'

interface PaginationProps {
  paginaActual: number
  totalPaginas: number
  etiqueta?: string
  orden?: string
  q?: string
  artista?: string
  precioMin?: number
  precioMax?: number
  disponibilidad?: DisponibilidadFiltro
  /** Si se indica, los enlaces usan esta ruta (ej: /promociones) en lugar de /productos */
  basePath?: string
}

export default function Pagination({
  paginaActual,
  totalPaginas,
  etiqueta,
  orden,
  q,
  artista,
  precioMin,
  precioMax,
  disponibilidad,
  basePath = '/productos',
}: PaginationProps) {
  if (totalPaginas <= 1) return null

  const buildHref = (page: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (etiqueta) params.set('etiqueta', etiqueta)
    if (artista) params.set('artista', artista)
    if (precioMin && precioMin > 0) params.set('precioMin', String(precioMin))
    if (precioMax && precioMax > 0) params.set('precioMax', String(precioMax))
    if (disponibilidad && disponibilidad !== 'disponibles') {
      params.set('disponibilidad', disponibilidad)
    }
    if (orden && orden !== 'recientes') params.set('orden', orden)
    params.set('page', String(page))
    return `${basePath}?${params.toString()}`
  }

  const paginas: (number | 'ellipsis')[] = []
  const mostrarAlrededor = 2

  if (totalPaginas <= 7) {
    for (let i = 1; i <= totalPaginas; i++) paginas.push(i)
  } else {
    const siempre = new Set<number>([1, totalPaginas])
    const alrededor = new Set<number>()
    for (let i = -mostrarAlrededor; i <= mostrarAlrededor; i++) {
      const p = paginaActual + i
      if (p >= 1 && p <= totalPaginas) alrededor.add(p)
    }
    const unidos = new Set([...siempre, ...alrededor])
    const ordenados = Array.from(unidos).sort((a, b) => a - b)

    for (let i = 0; i < ordenados.length; i++) {
      if (i > 0 && ordenados[i] - ordenados[i - 1] > 1) paginas.push('ellipsis')
      paginas.push(ordenados[i])
    }
  }

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-12"
      aria-label="Paginación de productos"
    >
      {paginaActual > 1 ? (
        <Link
          href={buildHref(paginaActual - 1)}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Anterior
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-400 text-sm font-medium cursor-not-allowed">
          Anterior
        </span>
      )}

      <div className="flex items-center gap-1">
        {paginas.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p)}
              className={`min-w-[2.5rem] px-3 py-2 rounded-md text-sm font-medium text-center transition-colors ${
                p === paginaActual
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </Link>
          )
        )}
      </div>

      {paginaActual < totalPaginas ? (
        <Link
          href={buildHref(paginaActual + 1)}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Siguiente
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-400 text-sm font-medium cursor-not-allowed">
          Siguiente
        </span>
      )}
    </nav>
  )
}
