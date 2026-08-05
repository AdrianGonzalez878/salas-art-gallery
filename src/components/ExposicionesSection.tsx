import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { Exposicion } from '@/sanity/lib/types'
import { agruparExposiciones } from '@/lib/exposiciones'
import AnimateInView from '@/components/AnimateInView'
import ExposicionCard from '@/components/ExposicionCard'

/** Home: 2 en móvil, 3 por fila en desktop. Máximo 6. */
const MAX_HOME = 6

interface ExposicionesSectionProps {
  exposiciones: Exposicion[]
}

export default function ExposicionesSection({ exposiciones }: ExposicionesSectionProps) {
  const { enCurso, proximas } = agruparExposiciones(exposiciones)
  const destacadas = [...enCurso, ...proximas].slice(0, MAX_HOME)

  if (destacadas.length === 0) return null

  return (
    <AnimateInView as="section" className="py-16 sm:py-20 bg-[var(--background)] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Agenda
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
            Exposiciones
          </h2>
          <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl">
            Presentamos nuestra colección en distintos espacios y ciudades
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {destacadas.map((exposicion, index) => {
            const imagenUrl = exposicion.imagenPrincipal?.asset
              ? urlFor(exposicion.imagenPrincipal).width(900).height(1200).quality(90).url()
              : null
            return (
              <AnimateInView key={exposicion._id} delay={index * 0.05} y={20}>
                <ExposicionCard
                  exposicion={exposicion}
                  imagenUrl={imagenUrl}
                  compact
                />
              </AnimateInView>
            )
          })}
        </div>

        <div className="mt-9 flex justify-center">
          <Link
            href="/exposiciones"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-amber-200 bg-white text-sm font-semibold text-amber-900 hover:bg-amber-50 transition-colors"
          >
            Ver todas
          </Link>
        </div>
      </div>
    </AnimateInView>
  )
}
