import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { artistasQuery, paginaArtistasQuery } from '@/sanity/lib/queries'
import type { Artista, PaginaArtistas } from '@/sanity/lib/types'
import AnimateInView from '@/components/AnimateInView'

export const metadata: Metadata = {
  title: 'Artistas | Salas Art Gallery',
  description:
    'Artistas colaboradores de Salas Art Gallery: un archivo vivo de creadores contemporáneos en exposiciones, proyectos y procesos dentro del espacio.',
  alternates: { canonical: '/artistas' },
}

const TEXTO_CIERRE_DEFAULT =
  'Salas Art Gallery trabaja en colaboración con artistas contemporáneos, explorando de forma constante nuevas formas de diálogo, exhibición y adquisición de obra.'

const TEXTO_CIERRE_SECUNDARIO_DEFAULT =
  'Programa una visita a nuestro espacio y descubre el lugar donde el arte sucede.'

export default async function ArtistasPage() {
  const [artistas, paginaArtistas] = await Promise.all([
    sanityFetch<Artista[]>(artistasQuery),
    sanityFetch<PaginaArtistas | null>(paginaArtistasQuery),
  ])

  const imagenCierreUrl = paginaArtistas?.imagenCierre?.asset
    ? urlFor(paginaArtistas.imagenCierre).width(1500).height(900).quality(90).url()
    : null

  const textoCierre = paginaArtistas?.textoCierre?.trim() || TEXTO_CIERRE_DEFAULT
  const textoCierreSecundario =
    paginaArtistas?.textoCierreSecundario?.trim() || TEXTO_CIERRE_SECUNDARIO_DEFAULT

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-12 pb-10 sm:pb-12 border-b border-gray-100 bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-2xl sm:text-3xl font-light uppercase tracking-[0.18em] text-gray-900 mb-5">
            Artistas{' '}
            <span className="text-violet-800">colaboradores</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Salas Art Gallery reúne a artistas contemporáneos que han colaborado en exposiciones,
            proyectos y procesos dentro del espacio. Esta sección funciona como un archivo vivo que
            permite explorar sus trayectorias y propuestas.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {artistas.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-2">Aún no hay artistas publicados.</p>
              <p className="text-sm">Agrégalos desde Sanity Studio → Artista.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {artistas.map((artista, index) => {
                const fotoUrl = artista.foto?.asset
                  ? urlFor(artista.foto).width(800).height(1000).quality(90).url()
                  : null
                return (
                  <AnimateInView key={artista._id} delay={index * 0.05} y={20}>
                    <Link
                      href={`/artistas/${artista.slug.current}`}
                      className="group block rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
                    >
                      <div className="relative aspect-[4/5] bg-gradient-to-br from-fuchsia-50 via-violet-50 to-sky-50">
                        {fotoUrl ? (
                          <Image
                            src={fotoUrl}
                            alt={artista.foto?.alt || artista.nombre}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                          />
                        ) : null}
                      </div>
                      <div className="p-3 sm:p-5">
                        <h2 className="font-display text-base sm:text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors leading-snug">
                          {artista.nombre}
                        </h2>
                        {artista.resumen && (
                          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-3 hidden sm:block">
                            {artista.resumen}
                          </p>
                        )}
                      </div>
                    </Link>
                  </AnimateInView>
                )
              })}
            </div>
          )}

          <AnimateInView className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-gray-100" y={16}>
            <div className="max-w-6xl mx-auto px-2">
              <div
                className={
                  imagenCierreUrl
                    ? 'grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 lg:gap-10 items-center'
                    : 'max-w-3xl mx-auto text-center'
                }
              >
                {imagenCierreUrl ? (
                  <div className="relative aspect-[5/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-fuchsia-50 via-violet-50 to-sky-50 shadow-sm border border-gray-100">
                    <Image
                      src={imagenCierreUrl}
                      alt={paginaArtistas?.imagenCierre?.alt || 'Salas Art Gallery — artistas colaboradores'}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                  </div>
                ) : null}

                <div className={imagenCierreUrl ? 'text-center md:text-left' : ''}>
                  <p className="font-display text-lg sm:text-xl md:text-2xl text-gray-800 leading-relaxed">
                    {textoCierre}
                  </p>
                </div>
              </div>

              <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-gray-100 max-w-3xl mx-auto">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 sm:gap-8 md:gap-10 items-center">
                  <div className="text-center md:text-left">
                    <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                      {textoCierreSecundario}
                    </p>
                    <Link
                      href="/galeria"
                      className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-full border border-violet-200 bg-violet-50 text-sm font-semibold text-violet-900 hover:bg-violet-100 transition-colors"
                    >
                      Agendar visita
                    </Link>
                  </div>

                  <AnimateInView delay={0.15} y={12} className="flex justify-end">
                    <Image
                      src="/logo.png"
                      alt="Salas Art Gallery"
                      width={280}
                      height={100}
                      className="h-20 sm:h-24 md:h-28 w-auto object-contain opacity-90"
                    />
                  </AnimateInView>
                </div>
              </div>
            </div>
          </AnimateInView>
        </div>
      </section>
    </div>
  )
}
