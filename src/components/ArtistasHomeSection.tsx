import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { Artista } from '@/sanity/lib/types'
import AnimateInView from '@/components/AnimateInView'

interface ArtistasHomeSectionProps {
  artistas: Artista[]
}

export default function ArtistasHomeSection({ artistas }: ArtistasHomeSectionProps) {
  const seleccion = artistas.slice(0, 4)

  if (seleccion.length === 0) return null

  return (
    <AnimateInView as="section" className="py-14 sm:py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-3">
            Artistas colaboradores
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-gray-900 leading-tight">
            Las voces detrás de cada obra
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Conoce a los creadores que forman parte de la selección de Salas Art Gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {seleccion.map((artista, index) => {
            const imageUrl = artista.foto?.asset
              ? urlFor(artista.foto).width(720).height(900).quality(90).url()
              : null

            return (
              <AnimateInView key={artista._id} delay={index * 0.06} y={16}>
                <Link
                  href={`/artistas/${artista.slug.current}`}
                  className="group block overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50 transition-all hover:border-violet-200 hover:shadow-md"
                >
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-fuchsia-50 via-violet-50 to-sky-50">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={artista.foto?.alt || artista.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-gray-950/75 to-transparent" />
                    <h3 className="absolute inset-x-0 bottom-0 p-3 sm:p-4 font-display text-lg sm:text-xl font-semibold text-white leading-tight">
                      {artista.nombre}
                    </h3>
                  </div>
                </Link>
              </AnimateInView>
            )
          })}
        </div>

        <div className="mt-9 flex justify-center">
          <Link
            href="/artistas"
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-800 hover:bg-violet-50 transition-colors"
          >
            Ver todos los artistas
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </AnimateInView>
  )
}
