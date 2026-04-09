import type { Cupon } from '@/sanity/lib/types'

export function normalizarCodigoCupon(raw: string): string {
  return raw.trim().toUpperCase()
}

export function cuponVigentePorFecha(
  cupon: Pick<Cupon, 'fechaInicio' | 'fechaFin'>,
  ahoraIso: string
): boolean {
  if (cupon.fechaInicio && cupon.fechaInicio > ahoraIso) return false
  if (cupon.fechaFin && cupon.fechaFin < ahoraIso) return false
  return true
}

/** Base = subtotal + envío (mismo criterio que el checkout anterior con % sobre total con envío). */
export function computeDescuentoMonto(
  cupon: Pick<Cupon, 'tipoDescuento' | 'valor'>,
  subtotal: number,
  envio: number
): number {
  const base = Math.round((subtotal + envio) * 100) / 100
  let d = 0
  if (cupon.tipoDescuento === 'porcentaje') {
    d = Math.round(base * (Number(cupon.valor) / 100) * 100) / 100
  } else {
    d = Math.round(Number(cupon.valor) * 100) / 100
  }
  d = Math.min(d, base)
  return Math.max(0, d)
}

export type ResultadoValidarCupon =
  | { ok: true; descuento: number; codigoNormalizado: string }
  | { ok: false; error: string }

export function validarCuponParaCarrito(
  cupon: Cupon | null,
  codigoBuscado: string,
  subtotal: number,
  envio: number,
  ahoraIso: string
): ResultadoValidarCupon {
  const codigoNormalizado = normalizarCodigoCupon(codigoBuscado)
  if (!codigoNormalizado) {
    return { ok: false, error: 'Ingresa un código' }
  }
  if (!cupon) {
    return { ok: false, error: 'Código no válido o no aplicable' }
  }
  if (!cupon.activo) {
    return { ok: false, error: 'Este cupón ya no está disponible' }
  }
  if (!cuponVigentePorFecha(cupon, ahoraIso)) {
    return { ok: false, error: 'Este cupón no está vigente en esta fecha' }
  }
  if (normalizarCodigoCupon(cupon.codigo) !== codigoNormalizado) {
    return { ok: false, error: 'Código no válido o no aplicable' }
  }
  const min = cupon.montoMinimo
  if (min != null && min > 0 && subtotal < min) {
    return {
      ok: false,
      error: `Compra mínima de $${min.toLocaleString('es-MX')} para usar este cupón`,
    }
  }
  const descuento = computeDescuentoMonto(cupon, subtotal, envio)
  if (descuento <= 0) {
    return { ok: false, error: 'Cupón no aplicable a este pedido' }
  }
  return { ok: true, descuento, codigoNormalizado }
}
