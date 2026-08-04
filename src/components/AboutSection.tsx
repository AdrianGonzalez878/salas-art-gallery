import Image from 'next/image'
import Link from 'next/link'
import AnimateInView from '@/components/AnimateInView'
import { urlFor } from '@/lib/sanity'
import type { SobreNosotros } from '@/sanity/lib/types'

interface AboutSectionProps {
  data: SobreNosotros
}

export default function AboutSection({ data }: AboutSectionProps) {
  const historiaCorta =
    data.historia.length > 320
      ? `${data.historia.slice(0, 320).trimEnd()}…`
      : data.historia

  const tieneGaleria = Boolean(data.galeria && data.galeria.length > 0)
  const extras = data.galeria?.slice(1, 4) ?? []

  return (
    <AnimateInView as="section" className="py-14 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Texto: primero en móvil */}
          <div className="order-1 lg:order-2 lg:pl-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 mb-3">
              El espacio
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-gray-900 leading-tight mb-4">
              {data.titulo}
            </h2>
            {data.subtitulo && (
              <p className="text-gray-500 text-sm sm:text-base mb-6 leading-relaxed">
                {data.subtitulo}
              </p>
            )}

            {data.estadisticas && data.estadisticas.length > 0 && (
              data.estadisticas.length === 1 ? (
                <div className="mb-6 inline-flex flex-col items-start border-l-2 border-violet-400 pl-4">
                  <p className="font-display text-4xl font-light text-violet-950 leading-none">
                    {data.estadisticas[0].numero}
                  </p>
                </div>
              ) : (
                <div
                  className={`grid gap-3 mb-6 ${
                    data.estadisticas.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-2 sm:grid-cols-3'
                  }`}
                >
                  {data.estadisticas.map((stat, idx) => (
                    <div key={idx} className="border-l-2 border-violet-300 pl-3">
                      <div className="font-display text-2xl font-light text-violet-950">
                        {stat.numero}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {historiaCorta}
            </p>

            <Link
              href="/sobre-nosotros"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-violet-800 hover:text-violet-950 transition-colors"
            >
              Conocer más
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Fotos: después del texto en móvil */}
          {tieneGaleria && (
            <div className="order-2 lg:order-1 space-y-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={urlFor(data.galeria![0]).width(900).height(675).quality(90).url()}
                  alt={data.galeria![0].alt || 'Salas Art Gallery'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {extras.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {extras.map((imagen, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-xl bg-gray-100"
                    >
                      <Image
                        src={urlFor(imagen).width(300).height(300).quality(85).url()}
                        alt={imagen.alt || `Foto ${idx + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 33vw, 16vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimateInView>
  )
}
