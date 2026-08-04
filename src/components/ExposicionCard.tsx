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
  'en-curso': 'bg-violet-600 text-white',
  proxima: 'bg-sky-600 text-white',
  finalizada: 'bg-neutral-200 text-neutral-600',
} as const

export default function ExposicionCard({ exposicion, imagenUrl, compact = false }: ExposicionCardProps) {
  const estado = getEstadoExposicion(exposicion.fechaInicio, exposicion.fechaFin)
  const periodo = formatearPeriodoExposicion(exposicion.fechaInicio, exposicion.fechaFin)
  const ubicacion = formatearUbicacion(exposicion.ubicacion)

  return (
    <Link
      href={`/exposiciones/${exposicion.slug.current}`}
      className="group block rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-violet-200 transition-all"
    >
      <div className={`relative bg-gradient-to-br from-fuchsia-50 via-violet-50 to-sky-50 ${compact ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={exposicion.imagenPrincipal?.alt || exposicion.titulo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        <span
          className={`absolute top-2 left-2 sm:top-3 sm:left-3 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${badgeStyles[estado]}`}
        >
          {etiquetaEstado(estado)}
        </span>
      </div>
      <div className={compact ? 'p-3 sm:p-4' : 'p-3 sm:p-5'}>
        {ubicacion && (
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-violet-600 mb-1.5 sm:mb-2 line-clamp-1">
            {ubicacion}
          </p>
        )}
        <h3 className={`font-display font-bold text-gray-900 group-hover:text-violet-800 transition-colors leading-snug ${compact ? 'text-base sm:text-lg' : 'text-base sm:text-xl'}`}>
          {exposicion.titulo}
        </h3>
        {periodo && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2">{periodo}</p>
        )}
        {exposicion.resumen && !compact && (
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-3 hidden sm:block">
            {exposicion.resumen}
          </p>
        )}
      </div>
    </Link>
  )
}
