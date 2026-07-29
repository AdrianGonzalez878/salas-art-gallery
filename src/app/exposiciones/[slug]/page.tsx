import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { exposicionPorSlugQuery } from '@/sanity/lib/queries'
import type { Exposicion } from '@/sanity/lib/types'
import {
  etiquetaEstado,
  formatearPeriodoExposicion,
  formatearUbicacion,
  getEstadoExposicion,
} from '@/lib/exposiciones'
import AnimateInView from '@/components/AnimateInView'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const exposicion = await sanityFetch<Exposicion | null>(exposicionPorSlugQuery, { slug })
  if (!exposicion) return { title: 'Exposición no encontrada' }
  return {
    title: `${exposicion.titulo} | Exposiciones | Salas Art Gallery`,
    description: exposicion.resumen || `Exposición ${exposicion.titulo} de Salas Art Gallery.`,
    alternates: { canonical: `/exposiciones/${slug}` },
  }
}

export default async function ExposicionPage({ params }: PageProps) {
  const { slug } = await params
  const exposicion = await sanityFetch<Exposicion | null>(exposicionPorSlugQuery, { slug })
  if (!exposicion) notFound()

  const imagenUrl = exposicion.imagenPrincipal?.asset
    ? urlFor(exposicion.imagenPrincipal).width(1400).height(900).quality(90).url()
    : null
  const galeriaUrls =
    exposicion.galeria
      ?.filter((img) => img?.asset)
      .map((img) => ({
        url: urlFor(img).width(900).height(900).quality(90).url(),
        alt: img.alt || exposicion.titulo,
      })) ?? []

  const estado = getEstadoExposicion(exposicion.fechaInicio, exposicion.fechaFin)
  const periodo = formatearPeriodoExposicion(exposicion.fechaInicio, exposicion.fechaFin)
  const ubicacion = formatearUbicacion(exposicion.ubicacion)

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-100 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Link
            href="/exposiciones"
            className="inline-flex text-sm text-violet-700 hover:text-violet-800 font-medium mb-8"
          >
            ← Todas las exposiciones
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <AnimateInView className="lg:col-span-5" y={20}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-fuchsia-50 via-violet-50 to-sky-50 border border-gray-100">
                {imagenUrl ? (
                  <Image
                    src={imagenUrl}
                    alt={exposicion.imagenPrincipal?.alt || exposicion.titulo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    priority
                  />
                ) : null}
              </div>
            </AnimateInView>

            <AnimateInView className="lg:col-span-7" delay={0.08} y={20}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-800">
                  {etiquetaEstado(estado)}
                </span>
                {ubicacion && (
                  <span className="text-sm font-medium text-gray-600">{ubicacion}</span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {exposicion.titulo}
              </h1>

              {periodo && (
                <p className="text-lg text-gray-600 mb-4">{periodo}</p>
              )}

              {exposicion.ubicacion?.direccion && (
                <p className="text-gray-600 mb-2">{exposicion.ubicacion.direccion}</p>
              )}

              <div className="flex flex-wrap gap-3 mt-6">
                {exposicion.ubicacion?.enlaceMapa && (
                  <a
                    href={exposicion.ubicacion.enlaceMapa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Ver en mapa
                  </a>
                )}
                {exposicion.enlaceExterno && (
                  <a
                    href={exposicion.enlaceExterno}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                  >
                    Más información
                  </a>
                )}
              </div>

              {exposicion.resumen && (
                <p className="text-lg text-gray-600 mt-8 max-w-2xl">{exposicion.resumen}</p>
              )}

              {exposicion.descripcion && exposicion.descripcion.length > 0 && (
                <div className="prose prose-gray max-w-2xl text-gray-600 mt-6">
                  <PortableText value={exposicion.descripcion} />
                </div>
              )}
            </AnimateInView>
          </div>
        </div>
      </section>

      {exposicion.artistas && exposicion.artistas.length > 0 && (
        <section className="py-12 sm:py-14 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Artistas participantes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exposicion.artistas.map((artista) => {
                const fotoUrl = artista.foto?.asset
                  ? urlFor(artista.foto).width(400).height(500).quality(85).url()
                  : null
                return (
                  <Link
                    key={artista._id}
                    href={`/artistas/${artista.slug.current}`}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 hover:border-violet-200 hover:bg-violet-50/30 transition-colors"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-fuchsia-50 via-violet-50 to-sky-50">
                      {fotoUrl ? (
                        <Image
                          src={fotoUrl}
                          alt={artista.foto?.alt || artista.nombre}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold text-gray-900">{artista.nombre}</p>
                      {artista.resumen && (
                        <p className="text-sm text-gray-500 line-clamp-2">{artista.resumen}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {galeriaUrls.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Galería
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galeriaUrls.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
