import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { getSiteUrl } from '@/lib/site'
import { productosSitemapQuery } from '@/sanity/lib/queries'

type ProductoSitemap = { slug: string; _updatedAt?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()

  const staticRoutes: {
    path: string
    changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']
    priority: number
  }[] = [
    { path: '',                        changeFrequency: 'daily',   priority: 1.0  },
    { path: '/productos',              changeFrequency: 'daily',   priority: 0.95 },
    { path: '/promociones',            changeFrequency: 'daily',   priority: 0.85 },
    { path: '/sobre-conchita-plata',   changeFrequency: 'monthly', priority: 0.7  },
    { path: '/aviso-de-privacidad',    changeFrequency: 'yearly',  priority: 0.3  },
    { path: '/terminos',               changeFrequency: 'yearly',  priority: 0.3  },
  ]

  let productos: ProductoSitemap[] = []
  try {
    productos = await client.fetch<ProductoSitemap[]>(productosSitemapQuery)
  } catch {
    productos = []
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
  ]
}
