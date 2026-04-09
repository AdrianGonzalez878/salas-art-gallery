import { client } from '@/lib/sanity'
import { cuponesActivosQuery } from '@/sanity/lib/queries'
import type { Cupon } from '@/sanity/lib/types'
import { normalizarCodigoCupon, validarCuponParaCarrito } from '@/lib/cupones'

export async function obtenerCuponActivoPorCodigo(codigoRaw: string): Promise<Cupon | null> {
  const code = normalizarCodigoCupon(codigoRaw)
  if (!code) return null
  const cupones = await client.fetch<Cupon[]>(cuponesActivosQuery)
  return cupones.find((c) => normalizarCodigoCupon(c.codigo) === code) ?? null
}

/** Valida cupón + monto enviado por el cliente (API de checkout / pago). */
export async function resolverDescuentoCuponEnServidor(opts: {
  cuponRaw?: string | undefined
  descuentoCliente: number
  subtotal: number
  envio: number
}): Promise<
  | { ok: true; descuentoCalculado: number; codigoCupon: string }
  | { ok: false; error: string }
> {
  const { cuponRaw, descuentoCliente, subtotal, envio } = opts
  const codigoCupon = typeof cuponRaw === 'string' ? normalizarCodigoCupon(cuponRaw) : ''
  const ahoraIso = new Date().toISOString()
  let descuentoCalculado = 0

  if (codigoCupon) {
    const cuponDoc = await obtenerCuponActivoPorCodigo(codigoCupon)
    const r = validarCuponParaCarrito(cuponDoc, codigoCupon, subtotal, envio, ahoraIso)
    if (!r.ok) return { ok: false, error: r.error }
    descuentoCalculado = r.descuento
  } else if (descuentoCliente > 0.02) {
    return { ok: false, error: 'No se puede aplicar descuento sin un cupón válido.' }
  }

  if (Math.abs(descuentoCliente - descuentoCalculado) > 0.02) {
    return { ok: false, error: 'El descuento no coincide con el cupón.' }
  }

  return { ok: true, descuentoCalculado, codigoCupon }
}
