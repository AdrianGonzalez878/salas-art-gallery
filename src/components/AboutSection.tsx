import Image from 'next/image'
import AnimateInView from '@/components/AnimateInView'
import { urlFor } from '@/lib/sanity'
import type { SobreNosotros } from '@/sanity/lib/types'

interface AboutSectionProps {
  data: SobreNosotros
}

export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <AnimateInView as="section" className="py-16 sm:py-20 bg-[#f7f6f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-violet-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">El espacio</span>
            <div className="w-8 h-px bg-violet-500" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-gray-900 mb-2">{data.titulo}</h2>
          {data.subtitulo && (
            <p className="text-gray-500 max-w-2xl text-sm sm:text-base">{data.subtitulo}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Galería */}
          <div className="space-y-4">
            {data.galeria && data.galeria.length > 0 && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
                <Image
                  src={urlFor(data.galeria[0]).width(800).height(600).quality(90).url()}
                  alt={data.galeria[0].alt || 'Salas Art Gallery'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
            {data.galeria && data.galeria.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {data.galeria.slice(1, 4).map((imagen, idx) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={urlFor(imagen).width(300).height(300).quality(85).url()}
                      alt={imagen.alt || `Foto ${idx + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historia y estadísticas */}
          <div>
            {data.estadisticas && data.estadisticas.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {data.estadisticas.map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-white rounded-xl border border-violet-100">
                    <div className="font-display text-3xl font-light text-violet-950 mb-1">
                      {stat.numero}
                    </div>
                    <div className="text-xs text-violet-700 font-medium uppercase tracking-wide">
                      {stat.etiqueta}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {data.historia}
            </p>

          </div>
        </div>
      </div>
    </AnimateInView>
  )
}
