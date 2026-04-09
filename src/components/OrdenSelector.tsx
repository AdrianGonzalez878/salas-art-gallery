'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function OrdenSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ordenActual = searchParams.get('orden') || 'recientes'

  const handleOrdenChange = (nuevoOrden: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('orden', nuevoOrden)
    params.set('page', '1') // Volver a primera página al cambiar orden
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2 shadow-sm">
      <span className="text-gray-500 shrink-0" aria-hidden>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      </span>
      <label htmlFor="orden" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Ordenar por
      </label>
      <select
        id="orden"
        value={ordenActual}
        onChange={(e) => handleOrdenChange(e.target.value)}
        className="min-w-[160px] rounded-lg border-0 bg-transparent py-1.5 pl-0 pr-6 text-sm font-medium text-gray-900 focus:ring-0 focus:outline-none [color-scheme:light]"
      >
        <option value="recientes">Más recientes</option>
        <option value="mas-vendidos">Más vendidos</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="precio-desc">Precio: mayor a menor</option>
      </select>
    </div>
  )
}
