import Link from 'next/link'
import Image from 'next/image'
import type { Exposicion } from '@/sanity/lib/types'
import {
  etiquetaEstado,
  formatearPeriodoExposicion,
  formatearUbicacion,
  getEstadoExposicion,
} from '@/lib/exposiciones'

interface ExposicionCardProps {
  exposicion: Exposicion
  imagenUrl: string | null
  compact?: boolean
}

const badgeStyles = {
  'en-curso': 'bg-amber-400 text-gray-900',
  proxima: 'bg-sky-100 text-sky-900',
  finalizada: 'bg-gray-100 text-gray-600',
} as const

export default function ExposicionCard({
  exposicion,
  imagenUrl,
  compact = false,
}: ExposicionCardProps) {
  const estado = getEstadoExposicion(exposicion.fechaInicio, exposicion.fechaFin)
  const periodo = formatearPeriodoExposicion(exposicion.fechaInicio, exposicion.fechaFin)
  const ubicacion = formatearUbicacion(exposicion.ubicacion)

  return (
    <Link
      href={`/exposiciones/${exposicion.slug.current}`}
      className="group flex h-full flex-col overflow-hidden bg-white border border-gray-100 hover:border-amber-200 transition-colors"
    >
      <div
        className={`relative w-full overflow-hidden bg-gray-100 ${
          compact ? 'aspect-[3/4]' : 'aspect-[3/4] sm:aspect-[4/5]'
        }`}
      >
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={exposicion.imagenPrincipal?.alt || exposicion.titulo}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        <span
          className={`absolute top-3 left-3 rounded-sm px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] ${badgeStyles[estado]}`}
        >
          {etiquetaEstado(estado)}
        </span>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}`}>
        {ubicacion && (
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 mb-2 line-clamp-1">
            {ubicacion}
          </p>
        )}
        <h3
          className={`font-display font-medium text-gray-900 leading-snug group-hover:text-amber-900 transition-colors ${
            compact ? 'text-base sm:text-xl' : 'text-lg sm:text-2xl'
          }`}
        >
          {exposicion.titulo}
        </h3>
        {periodo && (
          <p className="mt-2 text-xs sm:text-sm text-gray-500">{periodo}</p>
        )}
        {exposicion.resumen && !compact && (
          <p className="mt-3 text-sm text-gray-500 line-clamp-2 hidden sm:block">
            {exposicion.resumen}
          </p>
        )}
        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-800">
          Ver exposición
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
