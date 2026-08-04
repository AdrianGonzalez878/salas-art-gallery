import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { getSiteUrl } from '@/lib/site'
import {
  productosSitemapQuery,
  artistasSitemapQuery,
  exposicionesSitemapQuery,
} from '@/sanity/lib/queries'

type SitemapEntry = { slug: string; _updatedAt?: string }

export const revalidate = 3600

function staticRoutes(base: string, now: Date): MetadataRoute.Sitemap {
  const routes: {
    path: string
    changeFrequency: NonNullable<MetadataRoute.Sitemap[0]['changeFrequency']>
    priority: number
  }[] = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/productos', changeFrequency: 'daily', priority: 0.95 },
    { path: '/artistas', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/exposiciones', changeFrequency: 'weekly', priority: 0.88 },
    { path: '/promociones', changeFrequency: 'daily', priority: 0.85 },
    { path: '/galeria', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/sobre-nosotros', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/aviso-de-privacidad', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terminos', changeFrequency: 'yearly', priority: 0.3 },
  ]

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}

function mapEntries(
  base: string,
  prefix: string,
  entries: SitemapEntry[],
  now: Date,
  changeFrequency: NonNullable<MetadataRoute.Sitemap[0]['changeFrequency']>,
  priority: number,
): MetadataRoute.Sitemap {
  return entries
    .filter((e) => typeof e?.slug === 'string' && e.slug.trim().length > 0)
    .map((e) => ({
      url: `${base}${prefix}/${e.slug}`,
      lastModified: e._updatedAt ? new Date(e._updatedAt) : now,
      changeFrequency,
      priority,
    }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()
  const staticOnly = staticRoutes(base, now)

  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
    if (!projectId) return staticOnly

    const [productos, artistas, exposiciones] = await Promise.all([
      client.fetch<SitemapEntry[]>(productosSitemapQuery).catch(() => [] as SitemapEntry[]),
      client.fetch<SitemapEntry[]>(artistasSitemapQuery).catch(() => [] as SitemapEntry[]),
      client.fetch<SitemapEntry[]>(exposicionesSitemapQuery).catch(() => [] as SitemapEntry[]),
    ])

    return [
      ...staticOnly,
      ...mapEntries(base, '/productos', productos, now, 'weekly', 0.8),
      ...mapEntries(base, '/artistas', artistas, now, 'weekly', 0.75),
      ...mapEntries(base, '/exposiciones', exposiciones, now, 'weekly', 0.72),
    ]
  } catch {
    // Nunca devolver 500: Google necesita al menos las rutas estáticas
    return staticOnly
  }
}
