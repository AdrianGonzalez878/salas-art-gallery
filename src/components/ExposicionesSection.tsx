import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { Exposicion } from '@/sanity/lib/types'
import { agruparExposiciones } from '@/lib/exposiciones'
import AnimateInView from '@/components/AnimateInView'
import ExposicionCard from '@/components/ExposicionCard'

interface ExposicionesSectionProps {
  exposiciones: Exposicion[]
}

export default function ExposicionesSection({ exposiciones }: ExposicionesSectionProps) {
  const { enCurso, proximas } = agruparExposiciones(exposiciones)
  const destacadas = [...enCurso, ...proximas].slice(0, 3)

  if (destacadas.length === 0) return null

  return (
    <AnimateInView as="section" className="py-16 sm:py-20 bg-[var(--background)] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-0.5 bg-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Agenda
              </span>
              <div className="w-8 h-0.5 bg-amber-400" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Exposiciones
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl">
              Presentamos nuestra colección en distintos espacios y ciudades
            </p>
          </div>
          <Link
            href="/exposiciones"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-violet-200 text-sm font-semibold text-violet-800 hover:bg-violet-50 transition-colors shrink-0"
          >
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {destacadas.map((exposicion, index) => {
            const imagenUrl = exposicion.imagenPrincipal?.asset
              ? urlFor(exposicion.imagenPrincipal).width(900).height(675).quality(90).url()
              : null
            return (
              <AnimateInView key={exposicion._id} delay={index * 0.06} y={20}>
                <ExposicionCard exposicion={exposicion} imagenUrl={imagenUrl} compact />
              </AnimateInView>
            )
          })}
        </div>
      </div>
    </AnimateInView>
  )
}
