import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * En desarrollo no cachea, para ver cambios de Sanity al instante.
 * En producción cachea y el webhook invalida la etiqueta `sanity`
 * (con respaldo de revalidación cada 60s).
 */
export function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const isDev = process.env.NODE_ENV === 'development'

  return client.fetch<T>(
    query,
    params ?? {},
    isDev
      ? { cache: 'no-store' }
      : { cache: 'force-cache', next: { tags: ['sanity'], revalidate: 60 } },
  )
}

