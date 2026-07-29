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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${badgeStyles[estado]}`}
        >
          {etiquetaEstado(estado)}
        </span>
      </div>
      <div className={compact ? 'p-4' : 'p-5'}>
        {ubicacion && (
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-2">
            {ubicacion}
          </p>
        )}
        <h3 className={`font-display font-bold text-gray-900 group-hover:text-violet-800 transition-colors ${compact ? 'text-lg' : 'text-xl'}`}>
          {exposicion.titulo}
        </h3>
        {periodo && (
          <p className="mt-2 text-sm text-gray-500">{periodo}</p>
        )}
        {exposicion.resumen && !compact && (
          <p className="mt-3 text-sm text-gray-500 line-clamp-3">{exposicion.resumen}</p>
        )}
      </div>
    </Link>
  )
}
