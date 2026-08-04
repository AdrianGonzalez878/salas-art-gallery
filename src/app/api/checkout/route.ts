import { NextResponse } from 'next/server'
import { serverClient } from '@/lib/sanity-server'
import { sendNuevoPedidoAdmin, sendConfirmacionCliente } from '@/lib/email'
import { computeShippingCost } from '@/lib/shipping'
import { resolverDescuentoCuponEnServidor } from '@/lib/cupones-sanity'
import { resolverCodigoColaboracionEnServidor } from '@/lib/codigos-colaboracion-sanity'

interface CheckoutBody {
  cliente: { nombre: string; email: string; telefono: string }
  direccionEnvio: {
    calle: string
    colonia: string
    ciudad: string
    estado: string
    codigoPostal: string
    pais?: string
  }
  productos: { id: string; titulo: string; cantidad: number; precio: number }[]
  subtotal: number
  envio: number
  total: number
  descuento?: number
  cupon?: string
  codigoColaboracion?: string
  metodoPago?: string
  notas?: string
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL.trim()
    return url.startsWith('http') ? url : `https://${url}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export async function POST(request: Request) {
  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      { error: 'Configuración del servidor: falta SANITY_API_TOKEN' },
      { status: 500 }
    )
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Configuración del servidor: falta MERCADOPAGO_ACCESS_TOKEN' },
      { status: 500 }
    )
  }

  let body: CheckoutBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  const {
    cliente,
    direccionEnvio,
    productos,
    subtotal,
    envio,
    total,
    descuento = 0,
    cupon: cuponRaw,
    codigoColaboracion: codigoColaboracionRaw,
    metodoPago,
    notas,
  } = body

  if (
    !cliente?.nombre ||
    !cliente?.email ||
    !cliente?.telefono ||
    !direccionEnvio?.calle ||
    !direccionEnvio?.colonia ||
    !direccionEnvio?.ciudad ||
    !direccionEnvio?.estado ||
    !direccionEnvio?.codigoPostal ||
    !Array.isArray(productos) ||
    productos.length === 0 ||
    typeof subtotal !== 'number' ||
    typeof total !== 'number'
  ) {
    return NextResponse.json(
      { error: 'Faltan datos requeridos (cliente, dirección, productos, subtotal, total)' },
      { status: 400 }
    )
  }

  const descuentoSafe =
    typeof descuento === 'number' && Number.isFinite(descuento) && descuento >= 0
      ? Math.round(descuento * 100) / 100
      : 0

  const subtotalCalculado =
    Math.round(
      productos.reduce((acc, p) => acc + Number(p.precio) * Number(p.cantidad), 0) * 100
    ) / 100

  if (Math.abs(subtotalCalculado - subtotal) > 0.02) {
    return NextResponse.json(
      { error: 'El subtotal no coincide con los productos.' },
      { status: 400 }
    )
  }

  const envioCalculado = computeShippingCost(subtotalCalculado)
  const envioNum = typeof envio === 'number' ? envio : 0
  if (Math.abs(envioNum - envioCalculado) > 0.02) {
    return NextResponse.json({ error: 'El costo de envío no es válido.' }, { status: 400 })
  }

  const resCupon = await resolverDescuentoCuponEnServidor({
    cuponRaw,
    descuentoCliente: descuentoSafe,
    subtotal: subtotalCalculado,
    envio: envioCalculado,
  })
  if (!resCupon.ok) {
    return NextResponse.json({ error: resCupon.error }, { status: 400 })
  }
  const { descuentoCalculado, codigoCupon } = resCupon

  const resColab = await resolverCodigoColaboracionEnServidor(codigoColaboracionRaw)
  if (!resColab.ok) {
    return NextResponse.json({ error: resColab.error }, { status: 400 })
  }

  const totalCalculado = Math.max(
    0,
    Math.round((subtotalCalculado + envioCalculado - descuentoCalculado) * 100) / 100
  )

  if (Math.abs(total - totalCalculado) > 0.02) {
    return NextResponse.json({ error: 'El total no coincide.' }, { status: 400 })
  }

  const numeroPedido = `PED-${Date.now()}`
  const baseUrl = getBaseUrl()

  const doc = {
    _type: 'pedido',
    numeroPedido,
    cliente: {
      nombre: cliente.nombre.trim(),
      email: cliente.email.trim(),
      telefono: cliente.telefono.trim(),
    },
    direccionEnvio: {
      calle: direccionEnvio.calle.trim(),
      colonia: direccionEnvio.colonia.trim(),
      ciudad: direccionEnvio.ciudad.trim(),
      estado: direccionEnvio.estado.trim(),
      codigoPostal: direccionEnvio.codigoPostal.trim(),
      pais: direccionEnvio.pais?.trim() || 'México',
    },
    productos: productos.map((p, i) => ({
      _key: `${p.id}-${i}`,
      _type: 'object',
      producto: {
        _type: 'reference',
        _ref: p.id,
      },
      cantidad: p.cantidad,
      precio: p.precio,
    })),
    subtotal: subtotalCalculado,
    envio: envioCalculado,
    descuentoCupon: descuentoCalculado,
    ...(codigoCupon ? { cuponCodigo: codigoCupon } : {}),
    ...(resColab.codigoColaboracion
      ? {
          codigoColaboracion: resColab.codigoColaboracion,
          colaboracionNombre: resColab.colaboracionNombre,
          ...(resColab.exposicionColaboracionTitulo
            ? { exposicionColaboracionTitulo: resColab.exposicionColaboracionTitulo }
            : {}),
        }
      : {}),
    total: totalCalculado,
    estado: 'pendiente_pago',
    metodoPago: 'mercadopago',
    ...(notas && notas.trim() && { notas: notas.trim() }),
  }

  let sanityId: string
  try {
    const result = await serverClient.create(doc)
    sanityId = result._id
  } catch (err) {
    console.error('Error creando pedido en Sanity:', err)
    return NextResponse.json(
      { error: 'No se pudo crear el pedido. Intenta de nuevo.' },
      { status: 500 }
    )
  }

  const emailData = {
    numeroPedido,
    cliente,
    direccionEnvio,
    productos,
    subtotal: subtotalCalculado,
    envio: envioCalculado,
    total: totalCalculado,
    ...(resColab.codigoColaboracion
      ? {
          codigoColaboracion: resColab.codigoColaboracion,
          colaboracionNombre: resColab.colaboracionNombre,
          exposicionColaboracionTitulo: resColab.exposicionColaboracionTitulo,
        }
      : {}),
  }
  Promise.allSettled([
    sendNuevoPedidoAdmin(emailData),
    sendConfirmacionCliente(emailData),
  ]).catch(console.error)

  const preferenceItems = productos.map((p) => ({
    title: (p.titulo || 'Producto').slice(0, 256),
    quantity: p.cantidad,
    unit_price: Number(p.precio),
    currency_id: 'MXN',
  }))

  if (envioCalculado > 0) {
    preferenceItems.push({
      title: 'Envío',
      quantity: 1,
      unit_price: envioCalculado,
      currency_id: 'MXN',
    })
  }

  if (descuentoCalculado > 0) {
    preferenceItems.push({
      title: 'Descuento',
      quantity: 1,
      unit_price: -descuentoCalculado,
      currency_id: 'MXN',
    })
  }

  const preferenceBody = {
    items: preferenceItems,
    payer: {
      email: cliente.email.trim(),
      name: cliente.nombre.trim(),
    },
    back_urls: {
      success: `${baseUrl}/carrito/gracias?pedido=${encodeURIComponent(numeroPedido)}`,
      failure: `${baseUrl}/carrito/checkout?error=pago_cancelado`,
      pending: `${baseUrl}/carrito/gracias?pedido=${encodeURIComponent(numeroPedido)}&estado=pending`,
    },
    auto_return: 'approved' as const,
    external_reference: numeroPedido,
    notification_url: `${baseUrl}/api/mercadopago/webhook`,
    statement_descriptor: 'SALAS ART',
  }

  try {
    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceBody),
    })

    if (!mpRes.ok) {
      const errData = await mpRes.json().catch(() => ({}))
      console.error('Mercado Pago preference error:', mpRes.status, errData)
      return NextResponse.json(
        { error: 'No se pudo iniciar el pago. Intenta de nuevo.' },
        { status: 502 }
      )
    }

    const preference = await mpRes.json()
    const initPoint = preference.sandbox_init_point || preference.init_point
    if (!initPoint) {
      console.error('Mercado Pago: no init_point in response', preference)
      return NextResponse.json(
        { error: 'No se pudo obtener el enlace de pago.' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      id: sanityId,
      numeroPedido,
      init_point: initPoint,
    })
  } catch (err) {
    console.error('Error creando preferencia Mercado Pago:', err)
    return NextResponse.json(
      { error: 'Error de conexión con el procesador de pagos. Intenta de nuevo.' },
      { status: 502 }
    )
  }
}
