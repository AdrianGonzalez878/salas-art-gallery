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
 * Fetch con revalidación automática cada hora para páginas públicas.
 * El webhook /api/revalidate invalida las rutas afectadas inmediatamente
 * cuando se publica contenido en Sanity.
 */
export function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  return client.fetch<T>(query, params ?? {}, {
    next: {
      // En desarrollo siempre fresco; en producción cachea 1 hora
      revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600,
    },
  })
}

