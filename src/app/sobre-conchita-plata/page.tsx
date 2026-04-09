import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { sobreNosotrosQuery } from '@/sanity/lib/queries'
import type { SobreNosotros } from '@/sanity/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Conchita Plata | Nuestra Historia',
  description:
    'Conoce la historia de Conchita Plata, tu tienda de joyería de confianza. Años de experiencia creando piezas únicas en plata.',
}

export default async function SobreConchitaPlataPage() {
  const data = await client.fetch<SobreNosotros | null>(sobreNosotrosQuery)

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── Hero banner ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="w-full lg:max-w-7xl lg:mx-auto lg:px-4 xl:px-8 lg:pt-4">
          <div className="relative w-full overflow-hidden rounded-none lg:rounded-2xl">
            <div className="relative w-full min-h-[340px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[660px] bg-gray-100">
              {data?.imagenBanner?.asset ? (
                <Image
                  src={urlFor(data.imagenBanner).width(1920).quality(90).url()}
                  alt={data.imagenBanner.alt || 'Conchita Plata'}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 1280px, 100vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />

              {/* Hero text */}
              <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-14 lg:px-20 pb-10 sm:pb-14 md:pb-18 lg:pb-20">
                <div className="max-w-3xl">
                  {/* Decorative line */}
                  <div className="w-10 h-0.5 bg-amber-400 mb-4 sm:mb-5" />
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3 sm:mb-4">
                    {data?.titulo || 'Conchita Plata'}
                  </h1>
                  {data?.subtitulo && (
                    <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
                      {data.subtitulo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Estadísticas ─────────────────────────────────────── */}
      {data?.estadisticas && data.estadisticas.length > 0 && (
        <section className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {data.estadisticas.map((stat, idx) => (
                <div key={idx} className="py-8 px-6 text-center">
                  <p className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                    {stat.numero}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">{stat.etiqueta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Historia + galería ───────────────────────────────── */}
      {data ? (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

              {/* Historia */}
              <div className="order-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                    Nuestra historia
                  </span>
                </div>

                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                  <p className="whitespace-pre-line">{data.historia}</p>
                </div>

                {/* Años de experiencia */}
                {data.anosExperiencia > 0 && (
                  <div className="mt-10 flex items-center gap-5 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-400 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-xl font-bold text-white leading-none">
                        {data.anosExperiencia}
                      </span>
                      <span className="text-[9px] font-semibold text-amber-100 uppercase tracking-wider leading-none mt-0.5">
                        {data.anosExperiencia === 1 ? 'año' : 'años'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base leading-tight">
                        {data.anosExperiencia} {data.anosExperiencia === 1 ? 'año' : 'años'} de experiencia
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Creando piezas únicas en plata con pasión y dedicación
                      </p>
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/productos"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Ver colección
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  {data.mostrarBotonWhatsApp && data.numeroWhatsApp && (
                    <a
                      href={`https://wa.me/${data.numeroWhatsApp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      {data.textoBotonWhatsApp || '¿Diseño a la medida?'}
                    </a>
                  )}
                </div>
              </div>

              {/* Galería */}
              {data.galeria && data.galeria.length > 0 && (
                <div className="order-2 space-y-3">
                  {/* Imagen principal */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                    <Image
                      src={urlFor(data.galeria[0]).width(900).quality(90).url()}
                      alt={data.galeria[0].alt || 'Conchita Plata'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Badge decorativo */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-sm">
                      <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Conchita Plata</p>
                      <p className="text-[11px] text-gray-500">Joyería artesanal en plata</p>
                    </div>
                  </div>

                  {/* Miniaturas */}
                  {data.galeria.length > 1 && (
                    <div className={`grid gap-3 ${data.galeria.length >= 4 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {data.galeria.slice(1, data.galeria.length >= 4 ? 4 : 3).map((imagen, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square overflow-hidden rounded-xl shadow-sm group"
                        >
                          <Image
                            src={urlFor(imagen).width(400).quality(85).url()}
                            alt={imagen.alt || `Conchita Plata ${idx + 2}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
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
        </section>
      ) : (
        /* Sin contenido en Sanity */
        <section className="py-24">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-10 h-0.5 bg-amber-400 mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Conchita Plata</h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              Tu tienda de joyería de confianza. Piezas únicas en plata, diseñadas con pasión
              y dedicación. Pronto podrás conocer más de nuestra historia aquí.
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Ver productos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* ── Valores / cierre ─────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Por qué elegirnos
              </span>
              <div className="w-8 h-0.5 bg-amber-400" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
              Nuestra promesa contigo
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Plata genuina',
                desc: 'Todas nuestras piezas son elaboradas en plata .925, certificadas y de alta calidad.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Hecho con amor',
                desc: 'Cada pieza lleva consigo la dedicación y el cuidado de nuestras artesanas.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
                  </svg>
                ),
                title: 'Envío seguro',
                desc: 'Tu pedido llega protegido y con seguimiento. Gratis a partir de $999.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
