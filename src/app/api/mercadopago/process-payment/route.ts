import { NextResponse } from 'next/server'
import { serverClient } from '@/lib/sanity-server'
import { sendNuevoPedidoAdmin, sendConfirmacionCliente, sendPagoConfirmado } from '@/lib/email'
import { marcarProductosAgotados } from '@/lib/inventory'
import { computeShippingCost } from '@/lib/shipping'
import { resolverDescuentoCuponEnServidor } from '@/lib/cupones-sanity'

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL.trim()
    return url.startsWith('http') ? url : `https://${url}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

function rejectionMessage(detail: string): string {
  const map: Record<string, string> = {
    cc_rejected_insufficient_amount: 'Fondos insuficientes. Por favor usa otra tarjeta.',
    cc_rejected_bad_filled_security_code: 'Código de seguridad (CVV) incorrecto.',
    cc_rejected_bad_filled_date: 'Fecha de vencimiento incorrecta.',
    cc_rejected_bad_filled_other: 'Algunos datos son incorrectos. Revísalos e intenta de nuevo.',
    cc_rejected_blacklist: 'No pudimos procesar tu pago. Intenta con otra tarjeta.',
    cc_rejected_call_for_authorize: 'Debes autorizar el pago con tu banco antes de continuar.',
    cc_rejected_card_disabled: 'Tu tarjeta está deshabilitada. Contacta a tu banco.',
    cc_rejected_duplicated_payment: 'Ya realizaste un pago de este monto recientemente.',
    cc_rejected_high_risk: 'Tu pago fue rechazado por seguridad. Intenta con otra tarjeta.',
    cc_rejected_invalid_installments: 'Esta tarjeta no admite esa cantidad de cuotas.',
    cc_rejected_max_attempts: 'Límite de intentos alcanzado. Intenta con otra tarjeta.',
  }
  return map[detail] ?? 'Pago rechazado. Verifica los datos o intenta con otra tarjeta.'
}

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken || !process.env.SANITY_API_TOKEN) {
    return NextResponse.json({ error: 'Error de configuración del servidor.' }, { status: 500 })
  }

  let body: {
    formData: Record<string, unknown>
    cliente: { nombre: string; email: string; telefono: string }
    direccionEnvio: {
      calle: string; colonia: string; ciudad: string
      estado: string; codigoPostal: string; pais?: string
    }
    productos: { id: string; titulo?: string; cantidad: number; precio: number; imageUrl?: string }[]
    subtotal: number
    envio: number
    total: number
    descuento?: number
    cupon?: string
    notas?: string
    regaloTitulo?: string
    regaloImagenUrl?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido.' }, { status: 400 })
  }

  const {
    formData,
    cliente,
    direccionEnvio,
    productos,
    subtotal,
    envio,
    total,
    descuento: descuentoBody,
    cupon: cuponRaw,
    notas,
    regaloTitulo,
    regaloImagenUrl,
  } = body

  if (
    !formData ||
    !cliente?.email ||
    !cliente?.nombre ||
    !direccionEnvio?.calle ||
    !Array.isArray(productos) ||
    productos.length === 0 ||
    typeof total !== 'number'
  ) {
    return NextResponse.json(
      { error: 'Faltan datos requeridos (cliente, dirección, productos, total).' },
      { status: 400 }
    )
  }

  const descuentoCliente =
    typeof descuentoBody === 'number' && Number.isFinite(descuentoBody) && descuentoBody >= 0
      ? Math.round(descuentoBody * 100) / 100
      : 0

  const subtotalCalculado =
    Math.round(
      productos.reduce((acc, p) => acc + Number(p.precio) * Number(p.cantidad), 0) * 100
    ) / 100

  if (Math.abs(subtotalCalculado - Number(subtotal)) > 0.02) {
    return NextResponse.json(
      { error: 'El subtotal no coincide con los productos. Actualiza la página e intenta de nuevo.' },
      { status: 400 }
    )
  }

  const envioCalculado = computeShippingCost(subtotalCalculado)
  const envioNum = typeof envio === 'number' ? envio : 0
  if (Math.abs(envioNum - envioCalculado) > 0.02) {
    return NextResponse.json(
      { error: 'El costo de envío no es válido. Actualiza la página e intenta de nuevo.' },
      { status: 400 }
    )
  }

  const resCupon = await resolverDescuentoCuponEnServidor({
    cuponRaw,
    descuentoCliente,
    subtotal: subtotalCalculado,
    envio: envioCalculado,
  })
  if (!resCupon.ok) {
    return NextResponse.json({ error: resCupon.error }, { status: 400 })
  }
  const { descuentoCalculado, codigoCupon } = resCupon

  const totalCalculado = Math.max(
    0,
    Math.round((subtotalCalculado + envioCalculado - descuentoCalculado) * 100) / 100
  )

  if (Math.abs(Number(total) - totalCalculado) > 0.02) {
    return NextResponse.json(
      { error: 'El total no coincide. Actualiza la página e intenta de nuevo.' },
      { status: 400 }
    )
  }

  const numeroPedido = `PED-${Date.now()}`
  const baseUrl = getBaseUrl()

  /* 1 — Crear el pedido en Sanity con estado "pendiente_pago" */
  const doc = {
    _type: 'pedido',
    numeroPedido,
    cliente: {
      nombre: cliente.nombre.trim(),
      email: cliente.email.trim(),
      telefono: cliente.telefono?.trim() || '',
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
      producto: { _type: 'reference', _ref: p.id },
      cantidad: p.cantidad,
      precio: p.precio,
    })),
    subtotal: subtotalCalculado,
    envio: envioCalculado,
    descuentoCupon: descuentoCalculado,
    ...(codigoCupon ? { cuponCodigo: codigoCupon } : {}),
    total: totalCalculado,
    estado: 'pendiente_pago',
    metodoPago: 'mercadopago',
    ...(regaloTitulo?.trim() && { regaloTitulo: regaloTitulo.trim() }),
    ...(regaloImagenUrl?.trim() && { regaloImagenUrl: regaloImagenUrl.trim() }),
    ...(notas?.trim() && { notas: notas.trim() }),
  }

  let sanityId: string
  try {
    const result = await serverClient.create(doc)
    sanityId = result._id
  } catch (err) {
    console.error('Error creando pedido en Sanity:', err)
    return NextResponse.json({ error: 'No se pudo registrar el pedido.' }, { status: 500 })
  }

  /* 2 — Procesar el pago en Mercado Pago */
  // Extraemos solo los campos que acepta la API de pagos de MP.
  // Spreading formData directamente incluye campos internos del Brick que MP rechaza con 400.
  const fd = formData as Record<string, unknown>
  const fdPayer = (fd.payer ?? {}) as Record<string, unknown>

  const payerObj: Record<string, unknown> = {
    email: (fdPayer.email as string) || cliente.email.trim(),
    entity_type: ['individual', 'association'].includes(fdPayer.entity_type as string)
      ? fdPayer.entity_type
      : 'individual',
  }
  const idRaw = fdPayer.identification
  if (idRaw && typeof idRaw === 'object') {
    payerObj.identification = idRaw
  }

  const paymentBody: Record<string, unknown> = {
    transaction_amount: totalCalculado,
    description: 'Conchita Plata Joyería',
    payment_method_id: fd.payment_method_id,
    installments: Number(fd.installments ?? 1),
    payer: payerObj,
    external_reference: numeroPedido,
    ...(baseUrl.startsWith('https') && { notification_url: `${baseUrl}/api/mercadopago/webhook` }),
    statement_descriptor: 'CONCHITA PLATA',
  }

  // Campos opcionales de tarjeta
  if (fd.token) paymentBody.token = fd.token
  if (fd.issuer_id) paymentBody.issuer_id = fd.issuer_id

  let payment: { status: string; status_detail: string; id?: number }
  try {
    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Idempotency-Key': numeroPedido,
      },
      body: JSON.stringify(paymentBody),
    })
    payment = await mpRes.json()
  } catch (err) {
    console.error('Error conectando con Mercado Pago:', err)
    await serverClient.delete(sanityId).catch(() => {})
    return NextResponse.json(
      { error: 'Error de conexión con el procesador de pagos. Intenta de nuevo.' },
      { status: 502 }
    )
  }

  const { status, status_detail } = payment

  const emailData = {
    numeroPedido,
    cliente,
    direccionEnvio,
    productos: productos.map((p) => ({
      titulo: p.titulo ?? '',
      cantidad: p.cantidad,
      precio: p.precio,
      imageUrl: p.imageUrl,
    })),
    subtotal: subtotalCalculado,
    envio: envioCalculado,
    total: totalCalculado,
  }

  /* 3 — Actualizar el pedido según el resultado */
  if (status === 'approved') {
    const productoIds = productos.map((p) => p.id).filter(Boolean)
    await Promise.allSettled([
      serverClient.patch(sanityId).set({ estado: 'procesando' }).commit(),
      marcarProductosAgotados(productoIds),
    ])
    Promise.allSettled([
      sendNuevoPedidoAdmin(emailData),
      sendPagoConfirmado(cliente.email, cliente.nombre, numeroPedido, emailData.productos),
    ]).catch(console.error)
    return NextResponse.json({ ok: true, numeroPedido })
  }

  if (status === 'pending' || status === 'in_process') {
    Promise.allSettled([
      sendNuevoPedidoAdmin(emailData),
      sendConfirmacionCliente(emailData),
    ]).catch(console.error)
    return NextResponse.json({ ok: true, numeroPedido, pending: true })
  }

  /* Pago rechazado */
  await serverClient.patch(sanityId).set({ estado: 'cancelado' }).commit().catch(console.error)
  return NextResponse.json(
    { ok: false, error: rejectionMessage(status_detail) },
    { status: 422 }
  )
}
