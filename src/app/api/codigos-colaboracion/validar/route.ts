import { NextResponse } from 'next/server'
import { validarCodigoColaboracion } from '@/lib/codigos-colaboracion'
import { obtenerCodigoColaboracionActivo } from '@/lib/codigos-colaboracion-sanity'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const codigo = typeof body.codigo === 'string' ? body.codigo : ''

    const doc = await obtenerCodigoColaboracionActivo(codigo)
    const r = validarCodigoColaboracion(doc, codigo)

    if (!r.ok) {
      return NextResponse.json({ ok: false, error: r.error }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      codigo: r.codigoNormalizado,
      nombre: r.nombre,
      exposicionTitulo: r.exposicionTitulo ?? null,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida' }, { status: 400 })
  }
}
