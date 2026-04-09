import { serverClient } from './sanity-server'

/**
 * Marca como disponible:false todos los productos incluidos en un pedido.
 * Se llama cuando el pago se aprueba para evitar que una pieza única
 * pueda comprarse dos veces.
 */
export async function marcarProductosAgotados(
  productoIds: string[]
): Promise<void> {
  if (!productoIds.length) return

  await Promise.allSettled(
    productoIds.map((id) =>
      serverClient.patch(id).set({ disponible: false }).commit()
    )
  )
}
