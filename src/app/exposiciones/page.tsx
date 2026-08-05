import type { Metadata } from 'next'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { exposicionesQuery } from '@/sanity/lib/queries'
import type { Exposicion } from '@/sanity/lib/types'
import { agruparExposiciones } from '@/lib/exposiciones'
import AnimateInView from '@/components/AnimateInView'
import ExposicionCard from '@/components/ExposicionCard'

export const metadata: Metadata = {
  title: 'Exposiciones',
  description:
    'Exposiciones de Salas Art Gallery en distintos espacios y ciudades. Consulta fechas, ubicaciones y artistas participantes.',
  alternates: { canonical: '/exposiciones' },
}

function ExposicionGrid({
  titulo,
  exposiciones,
  startDelay = 0,
}: {
  titulo: string
  exposiciones: Exposicion[]
  startDelay?: number
}) {
  if (exposiciones.length === 0) return null

  return (
    <div className="mb-14 sm:mb-16 last:mb-0">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">
          {titulo}
        </h2>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          {exposiciones.length}
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
        {exposiciones.map((exposicion, index) => {
          const imagenUrl = exposicion.imagenPrincipal?.asset
            ? urlFor(exposicion.imagenPrincipal).width(900).height(1200).quality(90).url()
            : null
          return (
            <AnimateInView key={exposicion._id} delay={startDelay + index * 0.05} y={20}>
              <ExposicionCard exposicion={exposicion} imagenUrl={imagenUrl} />
            </AnimateInView>
          )
        })}
      </div>
    </div>
  )
}

export default async function ExposicionesPage() {
  const exposiciones = await sanityFetch<Exposicion[]>(exposicionesQuery)
  const { enCurso, proximas, finalizadas } = agruparExposiciones(exposiciones)

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="pt-12 pb-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Salas Art Gallery
            </span>
            <div className="w-8 h-0.5 bg-amber-400" />
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-light text-gray-900 tracking-tight mb-2">
            Exposiciones
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            Nuestra galería se presenta en distintos espacios. Aquí encontrarás las exposiciones en
            curso, próximas y recientes.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {exposiciones.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-2">Aún no hay exposiciones publicadas.</p>
              <p className="text-sm">Agrégalas desde Sanity Studio → Exposición.</p>
            </div>
          ) : (
            <>
              <ExposicionGrid titulo="En curso" exposiciones={enCurso} />
              <ExposicionGrid titulo="Próximas" exposiciones={proximas} startDelay={0.05} />
              <ExposicionGrid titulo="Finalizadas" exposiciones={finalizadas} startDelay={0.1} />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
