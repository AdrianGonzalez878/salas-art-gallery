import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/sanity-server'
import { sendPagoConfirmado } from '@/lib/email'
import { marcarProductosAgotados } from '@/lib/inventory'

interface PedidoFromSanity {
  _id: string
  cliente?: { nombre: string; email: string }
  productos?: {
    producto?: { _id: string; titulo?: string; imagenPrincipal?: { asset?: { _ref?: string } } }
    cantidad?: number
    precio?: number
  }[]
}

/** Construye una URL de imagen de Sanity CDN a partir de un _ref de asset */
function sanityImgUrl(ref: string | undefined | null): string | undefined {
  if (!ref) return undefined
  // Formato: "image-{hash}-{WxH}-{ext}"
  const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/)
  if (!match) return undefined
  const [, hash, dimensions, ext] = match
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${dimensions}.${ext}?w=80&h=80&fit=crop`
}

async function handleApprovedPayment(externalRef: string) {
  const pedidos = await serverClient.fetch<PedidoFromSanity[]>(
    `*[_type == "pedido" && numeroPedido == $numeroPedido]{
      _id,
      cliente,
      productos[]{
        producto->{_id, titulo, imagenPrincipal{asset->{_ref}}},
        cantidad,
        precio
      }
    }`,
    { numeroPedido: externalRef }
  )
  if (pedidos.length === 0) {
    console.warn('Webhook: pedido no encontrado', externalRef)
    return
  }

  await serverClient.patch(pedidos[0]._id).set({ estado: 'procesando' }).commit()

  const pedido = pedidos[0]
  const productoIds = (pedido.productos ?? [])
    .map((p) => p.producto?._id)
    .filter(Boolean) as string[]
  marcarProductosAgotados(productoIds).catch(console.error)

  if (pedido.cliente?.email) {
    const emailProductos = (pedido.productos ?? []).map((p) => ({
      titulo: p.producto?.titulo ?? 'Producto',
      cantidad: p.cantidad ?? 1,
      precio: p.precio ?? 0,
      imageUrl: sanityImgUrl(p.producto?.imagenPrincipal?.asset?._ref),
    }))
    sendPagoConfirmado(
      pedido.cliente.email,
      pedido.cliente.nombre,
      externalRef,
      emailProductos
    ).catch(console.error)
  }
}

/**
 * Mercado Pago envía notificaciones por GET con ?topic=payment&id=123456789
 */
export async function GET(request: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing MERCADOPAGO_ACCESS_TOKEN' }, { status: 500 })
  }

  const topic = request.nextUrl.searchParams.get('topic')
  const id = request.nextUrl.searchParams.get('id')

  if (topic !== 'payment' || !id) {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  try {
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!paymentRes.ok) {
      console.error('Mercado Pago get payment failed:', paymentRes.status)
      return NextResponse.json({ received: true }, { status: 200 })
    }
    const payment = await paymentRes.json()
    const externalRef = payment.external_reference
    const status = payment.status

    if (status !== 'approved' || !externalRef) {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    await handleApprovedPayment(externalRef)
  } catch (err) {
    console.error('Webhook Mercado Pago error:', err)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}

/**
 * Algunas configuraciones de MP envían POST (application/x-www-form-urlencoded)
 * con topic e id en el body.
 */
export async function POST(request: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing MERCADOPAGO_ACCESS_TOKEN' }, { status: 500 })
  }

  let topic: string | null = null
  let id: string | null = null
  const contentType = request.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}))
    topic = body.topic ?? body.type ?? null
    id = body.data?.id ?? body.id ?? null
  } else {
    const text = await request.text()
    const params = new URLSearchParams(text)
    topic = params.get('topic')
    id = params.get('id')
  }

  if (topic !== 'payment' || !id) {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  try {
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!paymentRes.ok) {
      console.error('Mercado Pago get payment failed:', paymentRes.status)
      return NextResponse.json({ received: true }, { status: 200 })
    }
    const payment = await paymentRes.json()
    const externalRef = payment.external_reference
    const status = payment.status

    if (status !== 'approved' || !externalRef) {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    await handleApprovedPayment(externalRef)
  } catch (err) {
    console.error('Webhook Mercado Pago error:', err)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
