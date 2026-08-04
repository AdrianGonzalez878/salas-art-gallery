export type DisponibilidadFiltro = 'disponibles' | 'vendidas' | 'todas'

export interface ProductosFiltros {
  q: string
  etiqueta: string
  artista: string
  precioMin: number
  precioMax: number
  disponibilidad: DisponibilidadFiltro
  orden: string
}

export const PRECIOS_RANGO = [
  { id: '', label: 'Cualquier precio', min: 0, max: 0 },
  { id: '0-5000', label: 'Hasta $5,000', min: 0, max: 5000 },
  { id: '5000-15000', label: '$5,000 – $15,000', min: 5000, max: 15000 },
  { id: '15000-50000', label: '$15,000 – $50,000', min: 15000, max: 50000 },
  { id: '50000+', label: 'Más de $50,000', min: 50000, max: 0 },
] as const

export function parseDisponibilidad(value?: string | null): DisponibilidadFiltro {
  if (value === 'vendidas' || value === 'todas') return value
  return 'disponibles'
}

export function parsePrecio(value?: string | null): number {
  if (!value) return 0
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

export function precioRangoId(min: number, max: number): string {
  const match = PRECIOS_RANGO.find((r) => r.min === min && r.max === max)
  return match?.id ?? ''
}

export function parseProductosFiltros(params: {
  q?: string
  etiqueta?: string
  artista?: string
  precioMin?: string
  precioMax?: string
  disponibilidad?: string
  orden?: string
}): ProductosFiltros {
  return {
    q: (params.q ?? '').trim(),
    etiqueta: (params.etiqueta ?? '').trim(),
    artista: (params.artista ?? '').trim(),
    precioMin: parsePrecio(params.precioMin),
    precioMax: parsePrecio(params.precioMax),
    disponibilidad: parseDisponibilidad(params.disponibilidad),
    orden: params.orden || 'recientes',
  }
}

/** Params para GROQ */
export function toSanityFilterParams(filtros: ProductosFiltros, skip: number, end: number) {
  const isBusqueda = filtros.q.length > 0
  return {
    etiqueta: filtros.etiqueta,
    artistaSlug: filtros.artista,
    precioMin: filtros.precioMin,
    precioMax: filtros.precioMax,
    disponibilidad: filtros.disponibilidad,
    pattern: isBusqueda ? `%${filtros.q.toLowerCase()}%` : '',
    soloDestacadas: filtros.orden === 'destacadas',
    skip,
    end,
  }
}

export function buildProductosSearchParams(
  filtros: Partial<ProductosFiltros> & { page?: number },
  defaults?: Partial<ProductosFiltros>
): URLSearchParams {
  const merged: ProductosFiltros = {
    q: '',
    etiqueta: '',
    artista: '',
    precioMin: 0,
    precioMax: 0,
    disponibilidad: 'disponibles',
    orden: 'recientes',
    ...defaults,
    ...filtros,
  }

  const params = new URLSearchParams()
  if (merged.q) params.set('q', merged.q)
  if (merged.etiqueta) params.set('etiqueta', merged.etiqueta)
  if (merged.artista) params.set('artista', merged.artista)
  if (merged.precioMin > 0) params.set('precioMin', String(merged.precioMin))
  if (merged.precioMax > 0) params.set('precioMax', String(merged.precioMax))
  if (merged.disponibilidad !== 'disponibles') {
    params.set('disponibilidad', merged.disponibilidad)
  }
  if (merged.orden && merged.orden !== 'recientes') params.set('orden', merged.orden)
  if (filtros.page && filtros.page > 1) params.set('page', String(filtros.page))
  return params
}

export function tieneFiltrosActivos(filtros: ProductosFiltros): boolean {
  return Boolean(
    filtros.q ||
      filtros.etiqueta ||
      filtros.artista ||
      filtros.precioMin > 0 ||
      filtros.precioMax > 0 ||
      filtros.disponibilidad !== 'disponibles'
  )
}
