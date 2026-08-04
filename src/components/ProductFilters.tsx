'use client'

import { useEffect, useId, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  PRECIOS_RANGO,
  parseDisponibilidad,
  parsePrecio,
  precioRangoId,
  type DisponibilidadFiltro,
} from '@/lib/productos-filtros'

export interface ArtistaFiltroOption {
  _id: string
  nombre: string
  slug: string
}

interface ProductFiltersProps {
  etiquetas: string[]
  artistas: ArtistaFiltroOption[]
}

function selectClassName() {
  return 'w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-base sm:text-sm text-gray-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200'
}

export default function ProductFilters({ etiquetas, artistas }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const panelId = useId()
  const [open, setOpen] = useState(false)

  const etiqueta = searchParams.get('etiqueta') ?? ''
  const artista = searchParams.get('artista') ?? ''
  const precioMin = parsePrecio(searchParams.get('precioMin'))
  const precioMax = parsePrecio(searchParams.get('precioMax'))
  const disponibilidad = parseDisponibilidad(searchParams.get('disponibilidad'))
  const rangoId = precioRangoId(precioMin, precioMax)

  const updateParam = (key: string, value: string, clearKeys: string[] = []) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const k of clearKeys) params.delete(k)
    if (!value) params.delete(key)
    else params.set(key, value)
    params.set('page', '1')
    const qs = params.toString()
    router.push(qs ? `/productos?${qs}` : '/productos')
  }

  const setPrecioRango = (id: string) => {
    const rango = PRECIOS_RANGO.find((r) => r.id === id) ?? PRECIOS_RANGO[0]
    const params = new URLSearchParams(searchParams.toString())
    if (rango.min > 0) params.set('precioMin', String(rango.min))
    else params.delete('precioMin')
    if (rango.max > 0) params.set('precioMax', String(rango.max))
    else params.delete('precioMax')
    params.set('page', '1')
    const qs = params.toString()
    router.push(qs ? `/productos?${qs}` : '/productos')
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const q = searchParams.get('q')
    if (q) params.set('q', q)
    const qs = params.toString()
    router.push(qs ? `/productos?${qs}` : '/productos')
  }

  const activos: { key: string; label: string; clear: () => void }[] = []
  if (etiqueta) {
    activos.push({
      key: 'etiqueta',
      label: etiqueta,
      clear: () => updateParam('etiqueta', ''),
    })
  }
  if (artista) {
    const nombre = artistas.find((a) => a.slug === artista)?.nombre ?? artista
    activos.push({
      key: 'artista',
      label: nombre,
      clear: () => updateParam('artista', ''),
    })
  }
  if (rangoId) {
    const label = PRECIOS_RANGO.find((r) => r.id === rangoId)?.label ?? 'Precio'
    activos.push({
      key: 'precio',
      label,
      clear: () => setPrecioRango(''),
    })
  }
  if (disponibilidad !== 'disponibles') {
    const labels: Record<DisponibilidadFiltro, string> = {
      disponibles: 'Disponibles',
      vendidas: 'Vendidas',
      todas: 'Todas',
    }
    activos.push({
      key: 'disponibilidad',
      label: labels[disponibilidad],
      clear: () => updateParam('disponibilidad', ''),
    })
  }

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const renderFields = (suffix: string) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3">
      <div>
        <label htmlFor={`${panelId}-${suffix}-tipo`} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Tipo
        </label>
        <select
          id={`${panelId}-${suffix}-tipo`}
          value={etiqueta}
          onChange={(e) => updateParam('etiqueta', e.target.value)}
          className={selectClassName()}
        >
          <option value="">Todos los tipos</option>
          {etiquetas.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${panelId}-${suffix}-artista`} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Artista
        </label>
        <select
          id={`${panelId}-${suffix}-artista`}
          value={artista}
          onChange={(e) => updateParam('artista', e.target.value)}
          className={selectClassName()}
        >
          <option value="">Todos los artistas</option>
          {artistas.map((a) => (
            <option key={a._id} value={a.slug}>
              {a.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${panelId}-${suffix}-precio`} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Precio
        </label>
        <select
          id={`${panelId}-${suffix}-precio`}
          value={rangoId}
          onChange={(e) => setPrecioRango(e.target.value)}
          className={selectClassName()}
        >
          {PRECIOS_RANGO.map((r) => (
            <option key={r.id || 'any'} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${panelId}-${suffix}-disponibilidad`} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Disponibilidad
        </label>
        <select
          id={`${panelId}-${suffix}-disponibilidad`}
          value={disponibilidad}
          onChange={(e) =>
            updateParam('disponibilidad', e.target.value === 'disponibles' ? '' : e.target.value)
          }
          className={selectClassName()}
        >
          <option value="disponibles">Disponibles</option>
          <option value="vendidas">Vendidas</option>
          <option value="todas">Todas</option>
        </select>
      </div>
    </div>
  )

  const chips = activos.length > 0 && (
    <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none -mx-1 px-1">
      {activos.map((a) => (
        <button
          key={a.key}
          type="button"
          onClick={a.clear}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 active:bg-amber-100"
        >
          {a.label}
          <span aria-hidden className="text-amber-700 text-sm leading-none">
            ×
          </span>
        </button>
      ))}
      <button
        type="button"
        onClick={clearFilters}
        className="shrink-0 self-center text-xs font-medium text-gray-500 underline underline-offset-2"
      >
        Limpiar
      </button>
    </div>
  )

  return (
    <div className="space-y-3">
      {/* Mobile: botón + chips */}
      <div className="lg:hidden space-y-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left active:bg-gray-100"
          aria-expanded={open}
          aria-controls={`${panelId}-sheet`}
        >
          <span className="flex items-center gap-2.5">
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">Filtros</span>
            {activos.length > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-bold text-gray-900">
                {activos.length}
              </span>
            )}
          </span>
          <span className="text-xs font-medium text-gray-500">Ajustar</span>
        </button>
        {chips}
      </div>

      {/* Desktop: filtros siempre visibles */}
      <div className="hidden lg:block space-y-4">
        {renderFields('desktop')}
        {activos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {activos.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={a.clear}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100 transition-colors"
              >
                {a.label}
                <span aria-hidden className="text-amber-700">
                  ×
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-900"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby={`${panelId}-title`}>
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Cerrar filtros"
            onClick={() => setOpen(false)}
          />
          <div
            id={`${panelId}-sheet`}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl"
            style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3.5 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <h2 id={`${panelId}-title`} className="text-base font-semibold text-gray-900">
                  Filtros
                </h2>
                {activos.length > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-bold text-gray-900">
                    {activos.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 pt-4 space-y-5">
              {renderFields('mobile')}
              {activos.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full text-center text-sm font-medium text-gray-500 underline underline-offset-2"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="sticky bottom-0 mt-5 border-t border-gray-100 bg-white px-4 pt-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white active:bg-gray-800"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
