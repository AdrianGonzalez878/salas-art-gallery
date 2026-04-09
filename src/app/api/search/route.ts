import { NextResponse } from 'next/server'
import { client, urlFor } from '@/lib/sanity'
import { productosBusquedaQuery } from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'

const PREVIEW_LIMIT = 6

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').trim()
  if (q.length < 2) {
    return NextResponse.json([])
  }

  const pattern = `%${q.toLowerCase()}%`
  const productos = await client.fetch<Producto[]>(productosBusquedaQuery, {
    pattern,
    skip: 0,
    end: PREVIEW_LIMIT,
  })

  const results = productos.map((p) => {
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
    }
  })

  return NextResponse.json(results)
}
