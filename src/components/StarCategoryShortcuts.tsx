import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/lib/sanity'
import {
  etiquetasDisponiblesQuery,
  productosPorEtiquetaQuery,
} from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'
import AnimateInView from '@/components/AnimateInView'
import { etiquetaHref, uniqueEtiquetas } from '@/lib/etiquetas'

export default async function StarCategoryShortcuts() {
  const etiquetasRaw = await sanityFetch<string[]>(etiquetasDisponiblesQuery)
  const etiquetas = uniqueEtiquetas(etiquetasRaw).slice(0, 3)

  if (etiquetas.length === 0) return null

  const shortcuts = await Promise.all(
    etiquetas.map(async (tag) => {
      const productos = await sanityFetch<Producto[]>(productosPorEtiquetaQuery, {
        etiqueta: tag,
      })
      const imagen = productos.find((p) => p.imagenPrincipal?.asset)?.imagenPrincipal ?? null
      const imagenUrl = imagen?.asset
        ? urlFor(imagen).width(500).height(625).quality(90).url()
        : null

      return {
        label: tag,
        href: etiquetaHref(tag),
        count: productos.length,
        imagenUrl,
        imagenAlt: imagen?.alt || tag,
      }
    }),
  )

  return (
    <AnimateInView as="section" className="py-14 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-end mb-8 sm:mb-10">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-3">
              Explora
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 leading-tight">
              Descubre por palabras clave
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm sm:text-base text-gray-600 leading-relaxed lg:pb-1">
            Filtra la colección por temas y materiales que definen cada obra.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-4 sm:gap-5">
          {shortcuts.map((item, index) => (
            <AnimateInView
              key={item.label}
              delay={index * 0.06}
              y={16}
              className={index === 0 ? 'lg:col-span-6' : 'lg:col-span-3'}
            >
              <Link
                href={item.href}
                className={`group relative block overflow-hidden rounded-2xl bg-amber-50 border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 ${
                  index === 0
                    ? 'aspect-[16/10] sm:aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[28rem]'
                    : 'aspect-[16/9] sm:aspect-[4/5]'
                }`}
              >
                {item.imagenUrl ? (
                  <Image
                    src={item.imagenUrl}
                    alt={item.imagenAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={index === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw'}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-100 via-violet-50 to-sky-50" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 via-gray-900/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                    Palabra clave
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-tight">
                    {item.label}
                  </h3>
                  <p className="text-sm text-white/80 mt-1">
                    {item.count} obra{item.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            </AnimateInView>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-800 hover:text-violet-950 transition-colors"
          >
            Ver todas las palabras clave
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </AnimateInView>
  )
}
