import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { getSiteUrl } from '@/lib/site'
import { productosSitemapQuery, artistasSitemapQuery, exposicionesSitemapQuery } from '@/sanity/lib/queries'

type ProductoSitemap = { slug: string; _updatedAt?: string }
type ArtistaSitemap = { slug: string; _updatedAt?: string }
type ExposicionSitemap = { slug: string; _updatedAt?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()

  const staticRoutes: {
    path: string
    changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']
    priority: number
  }[] = [
    { path: '',                        changeFrequency: 'daily',   priority: 1.0  },
    { path: '/productos',              changeFrequency: 'daily',   priority: 0.95 },
    { path: '/artistas',               changeFrequency: 'weekly',  priority: 0.9  },
    { path: '/exposiciones',           changeFrequency: 'weekly',  priority: 0.88 },
    { path: '/promociones',            changeFrequency: 'daily',   priority: 0.85 },
    { path: '/galeria',                changeFrequency: 'monthly', priority: 0.8  },
    { path: '/sobre-nosotros',   changeFrequency: 'monthly', priority: 0.7  },
    { path: '/aviso-de-privacidad',    changeFrequency: 'yearly',  priority: 0.3  },
    { path: '/terminos',               changeFrequency: 'yearly',  priority: 0.3  },
  ]

  let productos: ProductoSitemap[] = []
  let artistas: ArtistaSitemap[] = []
  let exposiciones: ExposicionSitemap[] = []
  try {
    ;[productos, artistas, exposiciones] = await Promise.all([
      client.fetch<ProductoSitemap[]>(productosSitemapQuery),
      client.fetch<ArtistaSitemap[]>(artistasSitemapQuery),
      client.fetch<ExposicionSitemap[]>(exposicionesSitemapQuery),
    ])
  } catch {
    productos = []
    artistas = []
    exposiciones = []
  }

  const now = new Date()

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...productos.map((p) => ({
      url: `${base}/productos/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...artistas.map((a) => ({
      url: `${base}/artistas/${a.slug}`,
      lastModified: a._updatedAt ? new Date(a._updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
    ...exposiciones.map((e) => ({
      url: `${base}/exposiciones/${e.slug}`,
      lastModified: e._updatedAt ? new Date(e._updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    })),
  ]
}
