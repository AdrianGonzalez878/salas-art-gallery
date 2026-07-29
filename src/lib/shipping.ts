/**
 * El costo de entrega se definirá con el cliente.
 * Por ahora no se suma ningún cargo de envío al pago.
 */
export function computeShippingCost(_subtotal?: number): number {
  return 0
}
