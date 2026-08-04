import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { etiquetasDisponiblesQuery } from '@/sanity/lib/queries'
import AnimateInView from '@/components/AnimateInView'
import { etiquetaHref, uniqueEtiquetas } from '@/lib/etiquetas'

export default async function StarCategoryShortcuts() {
  const etiquetasRaw = await sanityFetch<string[]>(etiquetasDisponiblesQuery)
  const etiquetas = uniqueEtiquetas(etiquetasRaw).slice(0, 10)

  if (etiquetas.length === 0) return null

  return (
    <AnimateInView as="section" className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-7 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-3">
            Explora
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-gray-900 leading-tight">
            Explorar por tipo
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed">
            Encuentra obras por técnica, formato o material.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
          {etiquetas.map((tag) => (
            <Link
              key={tag}
              href={etiquetaHref(tag)}
              className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50/70 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100 hover:border-violet-300 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-800 transition-colors"
          >
            Ver obras
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </AnimateInView>
  )
}
