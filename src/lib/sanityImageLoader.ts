/**
 * Image loader personalizado para next/image.
 * - Imágenes de Sanity: añade w/q/auto=format y se sirven directo desde
 *   cdn.sanity.io, evitando consumir transformaciones de Vercel.
 * - Imágenes locales u otras URLs: se devuelven tal cual.
 */

interface LoaderProps {
  src: string
  width: number
  quality?: number
}

export default function sanityImageLoader({ src, width, quality }: LoaderProps): string {
  if (!src.includes('cdn.sanity.io')) {
    return src
  }

  try {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    url.searchParams.set('q', String(quality ?? 75))
    url.searchParams.set('auto', 'format')
    return url.toString()
  } catch {
    return src
  }
}
