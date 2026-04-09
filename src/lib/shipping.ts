/**
 * Reglas de envío (alineadas con ProductPurchaseInfo y checkout).
 * Ajusta COSTO_ENVIO_ESTANDAR_MXN según tu paquetería real.
 */

/** Subtotal a partir de este monto (inclusive) → envío gratis */
export const UMBRAL_ENVIO_GRATIS_MXN = 999

/** Costo de envío cuando el subtotal está por debajo del umbral */
export const COSTO_ENVIO_ESTANDAR_MXN = 99

export function computeShippingCost(subtotal: number): number {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return COSTO_ENVIO_ESTANDAR_MXN
  }
  return subtotal >= UMBRAL_ENVIO_GRATIS_MXN ? 0 : COSTO_ENVIO_ESTANDAR_MXN
}

/** Cuánto falta (MXN) para calificar envío gratis; 0 si ya aplica */
export function montoFaltanteParaEnvioGratis(subtotal: number): number {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return UMBRAL_ENVIO_GRATIS_MXN
  }
  if (subtotal >= UMBRAL_ENVIO_GRATIS_MXN) return 0
  return Math.max(0, Math.ceil(UMBRAL_ENVIO_GRATIS_MXN - subtotal))
}
