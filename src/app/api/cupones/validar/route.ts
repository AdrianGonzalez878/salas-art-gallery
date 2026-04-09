import { NextResponse } from 'next/server'
import { validarCuponParaCarrito } from '@/lib/cupones'
import { obtenerCuponActivoPorCodigo } from '@/lib/cupones-sanity'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const codigo = typeof body.codigo === 'string' ? body.codigo : ''
    const subtotal = Number(body.subtotal)
    const envio = Number(body.envio)

    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return NextResponse.json({ ok: false, error: 'Subtotal no válido' }, { status: 400 })
    }
    if (!Number.isFinite(envio) || envio < 0) {
      return NextResponse.json({ ok: false, error: 'Envío no válido' }, { status: 400 })
    }

    const cupon = await obtenerCuponActivoPorCodigo(codigo)
    const ahora = new Date().toISOString()
    const r = validarCuponParaCarrito(cupon, codigo, subtotal, envio, ahora)

    if (!r.ok) {
      return NextResponse.json({ ok: false, error: r.error }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      codigo: r.codigoNormalizado,
      descuento: r.descuento,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida' }, { status: 400 })
  }
}
