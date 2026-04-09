import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/sanity-server'
import { sendPedidoEnviado } from '@/lib/email'

const ESTADOS_VALIDOS = [
  'pendiente_pago',
  'pendiente',
  'procesando',
  'enviado',
  'entregado',
  'cancelado',
] as const

type Estado = (typeof ESTADOS_VALIDOS)[number]

function isEstadoValido(v: unknown): v is Estado {
  return typeof v === 'string' && (ESTADOS_VALIDOS as readonly string[]).includes(v)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = request.cookies.get('admin_session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json({ error: 'Configuración de servidor incompleta' }, { status: 500 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const { estado, guiaRastreo, paqueteria } = body as Record<string, unknown>

  if (!isEstadoValido(estado)) {
    return NextResponse.json(
      { error: `Estado no válido. Opciones: ${ESTADOS_VALIDOS.join(', ')}` },
      { status: 400 }
    )
  }

  try {
    // Armar el patch: siempre actualizar estado; guía y paquetería solo si se proporcionan
    const patch = serverClient.patch(id).set({ estado })
    if (typeof guiaRastreo === 'string' && guiaRastreo.trim()) {
      patch.set({ guiaRastreo: guiaRastreo.trim() })
    }
    if (typeof paqueteria === 'string' && paqueteria.trim()) {
      patch.set({ paqueteria: paqueteria.trim() })
    }
    await patch.commit()

    // Si el nuevo estado es 'enviado', enviar correo al cliente
    if (estado === 'enviado') {
      type PedidoBasico = {
        numeroPedido: string
        guiaRastreo?: string
        paqueteria?: string
        cliente?: { nombre: string; email: string }
        productos?: { producto?: { titulo?: string; imagenPrincipal?: { asset?: { _ref?: string } } }; cantidad?: number; precio?: number }[]
      }

      const pedido = await serverClient.fetch<PedidoBasico | null>(
        `*[_type == "pedido" && _id == $id][0]{
          numeroPedido,
          guiaRastreo,
          paqueteria,
          cliente,
          productos[]{
            producto->{titulo, imagenPrincipal{asset->{_ref}}},
            cantidad,
            precio
          }
        }`,
        { id }
      )

      if (pedido?.cliente?.email) {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
        const emailProductos = (pedido.productos ?? []).map((p) => {
          const ref = p.producto?.imagenPrincipal?.asset?._ref
          let imageUrl: string | undefined
          if (ref) {
            const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/)
            if (match) {
              const [, hash, dimensions, ext] = match
              imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${dimensions}.${ext}?w=80&h=80&fit=crop`
            }
          }
          return {
            titulo: p.producto?.titulo ?? 'Producto',
            cantidad: p.cantidad ?? 1,
            precio: p.precio ?? 0,
            imageUrl,
          }
        })

        sendPedidoEnviado({
          clienteEmail: pedido.cliente.email,
          clienteNombre: pedido.cliente.nombre,
          numeroPedido: pedido.numeroPedido,
          guiaRastreo: typeof guiaRastreo === 'string' && guiaRastreo.trim()
            ? guiaRastreo.trim()
            : pedido.guiaRastreo,
          paqueteria: typeof paqueteria === 'string' && paqueteria.trim()
            ? paqueteria.trim()
            : pedido.paqueteria,
          productos: emailProductos,
        }).catch(console.error)
      }
    }

    return NextResponse.json({ ok: true, estado })
  } catch (err) {
    console.error('Error actualizando pedido en Sanity:', err)
    return NextResponse.json({ error: 'No se pudo actualizar el pedido' }, { status: 500 })
  }
}
