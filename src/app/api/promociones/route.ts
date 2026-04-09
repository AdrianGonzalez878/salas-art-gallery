import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import { promocionesCompraMinima } from '@/sanity/lib/queries'
import type { Promocion } from '@/sanity/lib/types'

export async function GET() {
  try {
    const ahora = new Date().toISOString()
    const promociones = await client.fetch<Promocion[]>(promocionesCompraMinima)
    const activas = promociones.filter((p) => {
      if (p.fechaInicio && p.fechaInicio > ahora) return false
      if (p.fechaFin && p.fechaFin < ahora) return false
      return true
    })
    return NextResponse.json(activas, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    })
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
