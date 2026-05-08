/**
 * Verifica si un descuento está vigente según sus fechas opcionales.
 * - Sin fechas → siempre activo
 * - Solo fechaInicio → activo a partir de esa fecha
 * - Solo fechaFin   → activo hasta esa fecha
 * - Ambas           → activo dentro del rango
 */
export function descuentoVigente(
  tieneDescuento?: boolean,
  fechaInicio?: string,
  fechaFin?: string,
): boolean {
  if (!tieneDescuento) return false
  const ahora = new Date()
  if (fechaInicio && new Date(fechaInicio) > ahora) return false
  if (fechaFin && new Date(fechaFin) < ahora) return false
  return true
}

/**
 * Calcula el precio final aplicando el descuento si está vigente.
 */
export function calcularPrecioFinal(
  precio: number,
  tieneDescuento?: boolean,
  tipoDescuento?: string,
  valorDescuento?: number,
  fechaInicio?: string,
  fechaFin?: string,
): number {
  if (!descuentoVigente(tieneDescuento, fechaInicio, fechaFin)) return precio
  if (!tipoDescuento || !valorDescuento) return precio
  if (tipoDescuento === 'porcentaje') {
    return Math.round(precio * (1 - valorDescuento / 100))
  }
  if (tipoDescuento === 'monto') {
    return Math.max(0, precio - valorDescuento)
  }
  return precio
}
