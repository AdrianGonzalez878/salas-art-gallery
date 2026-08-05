import { NextResponse } from 'next/server'
import { client, urlFor } from '@/lib/sanity'
import { productosBusquedaQuery, artistasBusquedaQuery } from '@/sanity/lib/queries'
import type { Producto, Artista } from '@/sanity/lib/types'

const OBRAS_LIMIT = 5
const ARTISTAS_LIMIT = 4

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').trim()
  if (q.length < 2) {
    return NextResponse.json({ obras: [], artistas: [] })
  }

  const pattern = `%${q.toLowerCase()}%`

  const [productos, artistas] = await Promise.all([
    client.fetch<Producto[]>(productosBusquedaQuery, {
      pattern,
      skip: 0,
      end: OBRAS_LIMIT,
      etiqueta: '',
      artistaSlug: '',
      precioMin: 0,
      precioMax: 0,
      disponibilidad: 'disponibles',
      soloDestacadas: false,
    }),
    client.fetch<Artista[]>(artistasBusquedaQuery, {
      pattern,
      end: ARTISTAS_LIMIT,
    }),
  ])

  const obras = productos.map((p) => {
    let precioFinal = p.precio
    if (p.tieneDescuento && p.tipoDescuento && p.valorDescuento) {
      if (p.tipoDescuento === 'porcentaje') {
        precioFinal = p.precio * (1 - p.valorDescuento / 100)
      } else {
        precioFinal = Math.max(0, p.precio - p.valorDescuento)
      }
    }
    return {
      _id: p._id,
      titulo: p.titulo,
      slug: p.slug.current,
      precio: p.precio,
      precioFinal: Math.round(precioFinal),
      tieneDescuento: p.tieneDescuento,
      imagenUrl: p.imagenPrincipal
        ? urlFor(p.imagenPrincipal).width(80).height(80).url()
        : null,
      artistaNombre: p.artista?.nombre ?? null,
    }
  })

  const artistasMapped = artistas.map((a) => ({
    _id: a._id,
    nombre: a.nombre,
    slug: a.slug.current,
    resumen: a.resumen ?? null,
    imagenUrl: a.foto ? urlFor(a.foto).width(80).height(80).url() : null,
  }))

  return NextResponse.json({ obras, artistas: artistasMapped })
}
