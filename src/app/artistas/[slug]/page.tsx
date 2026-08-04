import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityFetch, urlFor } from '@/lib/sanity'
import {
  artistaPorSlugQuery,
  productosPorArtistaQuery,
} from '@/sanity/lib/queries'
import type { Artista, Producto } from '@/sanity/lib/types'
import ProductGrid from '@/components/ProductGrid'
import AnimateInView from '@/components/AnimateInView'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artista = await sanityFetch<Artista | null>(artistaPorSlugQuery, { slug })
  if (!artista) return { title: 'Artista no encontrado' }

  const ogImage = artista.foto?.asset
    ? urlFor(artista.foto).width(1200).height(630).url()
    : '/logo.png'

  return {
    title: artista.nombre,
    description: artista.resumen || `Obras de ${artista.nombre} en Salas Art Gallery.`,
    openGraph: {
      title: artista.nombre,
      description: artista.resumen || `Obras de ${artista.nombre} en Salas Art Gallery.`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: artista.nombre }],
      type: 'website',
      url: `/artistas/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: artista.nombre,
      description: artista.resumen || `Obras de ${artista.nombre} en Salas Art Gallery.`,
      images: [ogImage],
    },
    alternates: { canonical: `/artistas/${slug}` },
  }
}

export default async function ArtistaPage({ params }: PageProps) {
  const { slug } = await params
  const artista = await sanityFetch<Artista | null>(artistaPorSlugQuery, { slug })
  if (!artista) notFound()

  const obras = await sanityFetch<Producto[]>(productosPorArtistaQuery, {
    artistaId: artista._id,
  })

  const fotoUrl = artista.foto?.asset
    ? urlFor(artista.foto).width(900).height(1100).quality(90).url()
    : null

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-100 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Link
            href="/artistas"
            className="inline-flex text-sm text-amber-700 hover:text-amber-800 font-medium mb-8"
          >
            ← Todos los artistas
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <AnimateInView className="lg:col-span-4" y={20}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-fuchsia-50 via-violet-50 to-sky-50 border border-gray-100">
                {fotoUrl ? (
                  <Image
                    src={fotoUrl}
                    alt={artista.foto?.alt || artista.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                ) : null}
              </div>
            </AnimateInView>

            <AnimateInView className="lg:col-span-8" delay={0.08} y={20}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                  Artista
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {artista.nombre}
              </h1>
              {artista.resumen && (
                <p className="text-lg text-gray-600 mb-6 max-w-2xl">{artista.resumen}</p>
              )}
              {artista.biografia && artista.biografia.length > 0 && (
                <div className="prose prose-gray max-w-2xl text-gray-600">
                  <PortableText value={artista.biografia} />
                </div>
              )}
            </AnimateInView>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Obras de {artista.nombre}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {obras.length === 0
              ? 'Todavía no hay obras publicadas de este artista.'
              : `${obras.length} ${obras.length === 1 ? 'obra' : 'obras'}`}
          </p>
        </div>
        {obras.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGrid productos={obras} />
          </div>
        )}
      </section>
    </div>
  )
}
