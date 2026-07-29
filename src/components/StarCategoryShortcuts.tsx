import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/lib/sanity'
import {
  productoImagenPorTerminoQuery,
  productosPorCategoriaQuery,
} from '@/sanity/lib/queries'
import type { Producto, SanityImage } from '@/sanity/lib/types'
import AnimateInView from '@/components/AnimateInView'

interface ShortcutConfig {
  label: string
  href: string
  subtitle?: string
  patterns?: string[]
  categoria?: string
}

const SHORTCUTS: ShortcutConfig[] = [
  {
    label: 'Cerámica',
    href: '/productos?categoria=ceramica',
    subtitle: 'Alta y baja temperatura',
    categoria: 'ceramica',
  },
  {
    label: 'Óleos',
    href: '/productos?categoria=oleos',
    subtitle: 'Pintura al óleo',
    categoria: 'oleos',
  },
  {
    label: 'Litografía',
    href: '/productos?categoria=litografia',
    subtitle: 'Obra gráfica',
    categoria: 'litografia',
  },
]

async function fetchImageByPatterns(patterns: string[]): Promise<SanityImage | null> {
  for (const pattern of patterns) {
    const producto = await sanityFetch<{ imagenPrincipal?: SanityImage | null } | null>(
      productoImagenPorTerminoQuery,
      { pattern },
    )
    if (producto?.imagenPrincipal?.asset) {
      return producto.imagenPrincipal
    }
  }
  return null
}

async function fetchImageByCategoria(categoria: string): Promise<SanityImage | null> {
  const productos = await sanityFetch<Producto[]>(productosPorCategoriaQuery, { categoria })
  return productos.find((p) => p.imagenPrincipal?.asset)?.imagenPrincipal ?? null
}

export default async function StarCategoryShortcuts() {
  const shortcuts = await Promise.all(
    SHORTCUTS.map(async (item) => {
      let imagen: SanityImage | null = null
      if (item.categoria) {
        imagen = await fetchImageByCategoria(item.categoria)
      } else if (item.patterns) {
        imagen = await fetchImageByPatterns(item.patterns)
      }

      const imagenUrl = imagen?.asset
        ? urlFor(imagen).width(500).height(625).quality(90).url()
        : null

      return {
        ...item,
        imagenUrl,
        imagenAlt: imagen?.alt || item.label,
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
              Encuentra la técnica que habla contigo
            </h2>
          </div>
          <p className="lg:col-span-4 text-sm sm:text-base text-gray-600 leading-relaxed lg:pb-1">
            Descubre una selección de obras únicas, organizadas por material y proceso creativo.
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
                    Técnica
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-tight">
                    {item.label}
                  </h3>
                  {item.subtitle && <p className="text-sm text-white/80 mt-1">{item.subtitle}</p>}
                </div>
              </Link>
            </AnimateInView>
          ))}
        </div>
      </div>
    </AnimateInView>
  )
}
