import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch, urlFor } from '@/lib/sanity'
import {
  productoImagenPorTerminoQuery,
  productosConDescuentoQuery,
} from '@/sanity/lib/queries'
import type { Producto, SanityImage } from '@/sanity/lib/types'
import { descuentoVigente } from '@/lib/descuento'
import AnimateInView from '@/components/AnimateInView'

interface ShortcutConfig {
  label: string
  href: string
  subtitle?: string
  patterns?: string[]
}

const SHORTCUTS: ShortcutConfig[] = [
  {
    label: 'Filigrana',
    href: '/productos?q=filigrana',
    subtitle: 'Artesanía oaxaqueña',
    patterns: ['*filigrana*'],
  },
  {
    label: 'Madre perla',
    href: '/productos?q=madre+perla',
    subtitle: 'Brillo natural',
    patterns: ['*madre perla*', '*madreperla*', '*perla*'],
  },
  {
    label: 'Marquesita',
    href: '/productos?q=marquesita',
    subtitle: 'Concha y plata',
    patterns: ['*marquesita*'],
  },
  {
    label: 'Promociones',
    href: '/promociones',
    subtitle: 'Ofertas activas',
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

async function fetchPromocionImage(): Promise<SanityImage | null> {
  const productos = await sanityFetch<Producto[]>(productosConDescuentoQuery)
  const destacado = productos.find(
    (p) =>
      p.imagenPrincipal?.asset &&
      descuentoVigente(p.tieneDescuento, p.fechaInicioDescuento, p.fechaFinDescuento),
  )
  return destacado?.imagenPrincipal ?? productos.find((p) => p.imagenPrincipal?.asset)?.imagenPrincipal ?? null
}

export default async function StarCategoryShortcuts() {
  const shortcuts = await Promise.all(
    SHORTCUTS.map(async (item) => {
      const imagen =
        item.patterns != null
          ? await fetchImageByPatterns(item.patterns)
          : await fetchPromocionImage()

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
    <AnimateInView as="section" className="py-8 sm:py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-0.5 bg-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Explora por estilo
            </span>
            <div className="w-8 h-0.5 bg-amber-400" />
          </div>
          <p className="text-sm text-gray-500 max-w-md">
            Nuestras colecciones más buscadas, en un solo toque
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {shortcuts.map((item, index) => (
            <AnimateInView key={item.label} delay={index * 0.06} y={16}>
              <Link
                href={item.href}
                className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-amber-50 border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300"
              >
                {item.imagenUrl ? (
                  <Image
                    src={item.imagenUrl}
                    alt={item.imagenAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-50 to-white" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 via-gray-900/20 to-transparent" />

                {item.label === 'Promociones' && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-gray-900 text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-sm">
                    Ofertas
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <h3 className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                    {item.label}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs sm:text-sm text-white/80 mt-0.5">{item.subtitle}</p>
                  )}
                </div>
              </Link>
            </AnimateInView>
          ))}
        </div>
      </div>
    </AnimateInView>
  )
}
