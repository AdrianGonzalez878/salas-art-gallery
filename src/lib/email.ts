import { Resend } from 'resend'

// La clave se valida en cada envío. El valor temporal permite compilar y
// pre-renderizar el sitio antes de configurar Resend en cada entorno.
const resend = new Resend(process.env.RESEND_API_KEY || 're_not_configured')

const FROM = 'Salas Art Gallery <notificaciones@salasartgallery.com>'

function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL.trim()
    return url.startsWith('http') ? url : `https://${url}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export interface EmailProducto {
  titulo: string
  cantidad: number
  precio: number
  imageUrl?: string
}

interface NuevoPedidoData {
  numeroPedido: string
  cliente: { nombre: string; email: string; telefono: string }
  direccionEnvio: {
    calle: string
    colonia: string
    ciudad: string
    estado: string
    codigoPostal: string
    pais?: string
  }
  productos: EmailProducto[]
  subtotal: number
  envio: number
  total: number
  /** Código de colaboración usado en checkout (atribución de venta) */
  codigoColaboracion?: string
  colaboracionNombre?: string
  exposicionColaboracionTitulo?: string
}

function formatMXN(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

function emailHeader(logoUrl: string, subtitle: string) {
  return `
  <div style="background:#111827;padding:24px 32px;text-align:center;">
    <img src="${logoUrl}" alt="Salas Art Gallery" width="120" height="auto"
      style="display:inline-block;max-height:60px;object-fit:contain;" />
    <p style="color:#d1d5db;margin:8px 0 0;font-size:13px;letter-spacing:0.05em;">${subtitle}</p>
  </div>`
}

function emailFooter() {
  return `
  <div style="background:#f9fafb;padding:16px 32px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;">
    Salas Art Gallery &mdash; notificación automática
  </div>`
}

function productosRows(productos: EmailProducto[]) {
  return productos
    .map(
      (p) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;vertical-align:middle;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            ${
              p.imageUrl
                ? `<td style="padding-right:10px;vertical-align:middle;">
                    <img src="${p.imageUrl}" alt="${p.titulo}" width="56" height="56"
                      style="border-radius:6px;object-fit:cover;display:block;" />
                  </td>`
                : ''
            }
            <td style="vertical-align:middle;font-size:14px;color:#111827;">${p.titulo}</td>
          </tr>
        </table>
      </td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:14px;color:#374151;">${p.cantidad}</td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:14px;color:#374151;">${formatMXN(p.precio)}</td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:14px;font-weight:600;color:#111827;">${formatMXN(p.precio * p.cantidad)}</td>
    </tr>`
    )
    .join('')
}

function productosRowsSimple(productos: EmailProducto[]) {
  return productos
    .map(
      (p) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;vertical-align:middle;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            ${
              p.imageUrl
                ? `<td style="padding-right:10px;vertical-align:middle;">
                    <img src="${p.imageUrl}" alt="${p.titulo}" width="56" height="56"
                      style="border-radius:6px;object-fit:cover;display:block;" />
                  </td>`
                : ''
            }
            <td style="vertical-align:middle;font-size:14px;color:#111827;">${p.titulo}</td>
          </tr>
        </table>
      </td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:14px;color:#374151;">${p.cantidad}</td>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:14px;font-weight:600;color:#111827;">${formatMXN(p.precio * p.cantidad)}</td>
    </tr>`
    )
    .join('')
}

// ─── Email para la dueña: nuevo pedido ───────────────────────────────────────
export async function sendNuevoPedidoAdmin(data: NuevoPedidoData) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || !process.env.RESEND_API_KEY) return

  const {
    numeroPedido,
    cliente,
    direccionEnvio,
    productos,
    subtotal,
    envio,
    total,
    codigoColaboracion,
    colaboracionNombre,
    exposicionColaboracionTitulo,
  } = data
  const logoUrl = `${getAppUrl()}/logo.png`

  const colaboracionBlock = codigoColaboracion
    ? `
      <div style="background:#f5f3ff;border-left:4px solid #7c3aed;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
        <p style="margin:0;font-size:12px;color:#5b21b6;text-transform:uppercase;letter-spacing:0.05em;">Colaboración / quién vendió</p>
        <p style="margin:8px 0 0;font-size:18px;font-weight:bold;font-family:monospace;color:#4c1d95;">${codigoColaboracion}</p>
        ${
          colaboracionNombre
            ? `<p style="margin:6px 0 0;font-size:14px;color:#5b21b6;"><strong>${colaboracionNombre}</strong></p>`
            : ''
        }
        ${
          exposicionColaboracionTitulo
            ? `<p style="margin:4px 0 0;font-size:13px;color:#6d28d9;">Exposición: ${exposicionColaboracionTitulo}</p>`
            : ''
        }
      </div>`
    : ''

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    ${emailHeader(logoUrl, 'Nueva orden recibida')}

    <div style="padding:32px;">
      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
        <p style="margin:0;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;">Número de pedido</p>
        <p style="margin:6px 0 0;font-size:22px;font-weight:bold;font-family:monospace;color:#78350f;">${numeroPedido}</p>
      </div>

      ${colaboracionBlock}

      <h2 style="font-size:15px;font-weight:600;margin:0 0 12px;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Cliente</h2>
      <table style="width:100%;font-size:14px;margin-bottom:28px;">
        <tr><td style="color:#6b7280;padding:4px 0;width:130px;">Nombre</td><td style="font-weight:600;">${cliente.nombre}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Email</td><td>${cliente.email}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Teléfono</td><td>${cliente.telefono}</td></tr>
      </table>

      <h2 style="font-size:15px;font-weight:600;margin:0 0 12px;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Dirección de envío</h2>
      <p style="font-size:14px;margin:0 0 28px;line-height:1.7;color:#374151;">
        ${direccionEnvio.calle}<br>
        ${direccionEnvio.colonia}, ${direccionEnvio.ciudad}<br>
        ${direccionEnvio.estado}, CP ${direccionEnvio.codigoPostal}<br>
        ${direccionEnvio.pais || 'México'}
      </p>

      <h2 style="font-size:15px;font-weight:600;margin:0 0 16px;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Productos</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Producto</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Cant.</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Precio</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${productosRows(productos)}
        </tbody>
      </table>

      <div style="border-top:2px solid #111827;padding-top:16px;text-align:right;font-size:14px;">
        <p style="margin:4px 0;color:#6b7280;">Subtotal: ${formatMXN(subtotal)}</p>
        <p style="margin:4px 0;color:#6b7280;">Envío: ${envio === 0 ? 'Gratis' : formatMXN(envio)}</p>
        <p style="margin:10px 0 0;font-size:20px;font-weight:bold;color:#111827;">Total: ${formatMXN(total)}</p>
      </div>
    </div>

    ${emailFooter()}
  </div>`

  const subjectColab = codigoColaboracion ? ` · Colab. ${codigoColaboracion}` : ''

  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `Nuevo pedido ${numeroPedido} — ${cliente.nombre}${subjectColab}`,
    html,
  })
}

// ─── Email para el cliente: confirmación de pedido ───────────────────────────
export async function sendConfirmacionCliente(data: NuevoPedidoData) {
  if (!process.env.RESEND_API_KEY) return

  const { numeroPedido, cliente, productos, subtotal, envio, total } = data
  const logoUrl = `${getAppUrl()}/logo.png`

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    ${emailHeader(logoUrl, 'Confirmación de pedido')}

    <div style="padding:32px;">
      <p style="font-size:16px;margin:0 0 24px;color:#374151;">
        Hola <strong>${cliente.nombre}</strong>, recibimos tu pedido con éxito.
        En cuanto confirmemos el pago, te contactamos para coordinar el envío.
      </p>

      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
        <p style="margin:0;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;">Número de pedido</p>
        <p style="margin:6px 0 0;font-size:22px;font-weight:bold;font-family:monospace;color:#78350f;">${numeroPedido}</p>
      </div>

      <h2 style="font-size:15px;font-weight:600;margin:0 0 16px;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Tu pedido</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Producto</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Cant.</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${productosRowsSimple(productos)}
        </tbody>
      </table>

      <div style="border-top:2px solid #111827;padding-top:16px;text-align:right;font-size:14px;">
        <p style="margin:4px 0;color:#6b7280;">Subtotal: ${formatMXN(subtotal)}</p>
        <p style="margin:4px 0;color:#6b7280;">Envío: ${envio === 0 ? 'Gratis' : formatMXN(envio)}</p>
        <p style="margin:10px 0 0;font-size:20px;font-weight:bold;color:#111827;">Total: ${formatMXN(total)}</p>
      </div>

      <p style="font-size:13px;color:#6b7280;margin-top:32px;">
        ¿Tienes alguna duda? Contáctanos por WhatsApp o responde este correo.
      </p>
    </div>

    ${emailFooter()}
  </div>`

  await resend.emails.send({
    from: FROM,
    to: cliente.email,
    subject: `¡Recibimos tu pedido! ${numeroPedido} — Salas Art Gallery`,
    html,
  })
}

// ─── Email al cliente cuando el pedido es enviado ────────────────────────────
export async function sendPedidoEnviado(opts: {
  clienteEmail: string
  clienteNombre: string
  numeroPedido: string
  guiaRastreo?: string
  paqueteria?: string
  productos?: EmailProducto[]
}) {
  if (!process.env.RESEND_API_KEY) return

  const { clienteEmail, clienteNombre, numeroPedido, guiaRastreo, paqueteria, productos } = opts
  const logoUrl = `${getAppUrl()}/logo.png`

  const guiaSection = guiaRastreo
    ? `
    <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:4px;margin-bottom:24px;">
      <p style="margin:0;font-size:12px;color:#1e40af;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">
        ${paqueteria ? `${paqueteria} — ` : ''}Número de guía
      </p>
      <p style="margin:6px 0 0;font-size:20px;font-weight:bold;font-family:monospace;color:#1e3a8a;letter-spacing:0.1em;">${guiaRastreo}</p>
      <p style="margin:8px 0 0;font-size:12px;color:#3b82f6;">
        Usa este número para rastrear tu paquete en el sitio de la paquetería.
      </p>
    </div>`
    : ''

  const productosSection =
    productos && productos.length > 0
      ? `
      <h2 style="font-size:15px;font-weight:600;margin:24px 0 16px;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Tu pedido</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Producto</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Cant.</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${productosRowsSimple(productos)}
        </tbody>
      </table>`
      : ''

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    ${emailHeader(logoUrl, 'Tu pedido está en camino')}

    <div style="padding:32px;">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="display:inline-block;background:#dbeafe;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;text-align:center;">📦</div>
      </div>

      <p style="font-size:16px;margin:0 0 8px;color:#111827;">Hola <strong>${clienteNombre}</strong>,</p>
      <p style="font-size:15px;margin:0 0 24px;color:#374151;">
        ¡Tu pedido ya está en camino! Pronto llegará a tu puerta.
      </p>

      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:4px;margin-bottom:24px;">
        <p style="margin:0;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;">Número de pedido</p>
        <p style="margin:6px 0 0;font-size:22px;font-weight:bold;font-family:monospace;color:#78350f;">${numeroPedido}</p>
      </div>

      ${guiaSection}

      ${productosSection}

      <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-top:24px;">
        <p style="margin:0;font-size:14px;color:#374151;font-weight:600;">¿Tienes alguna duda?</p>
        <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">
          Contáctanos por WhatsApp o responde este correo y con gusto te ayudamos.
        </p>
      </div>
    </div>

    ${emailFooter()}
  </div>`

  await resend.emails.send({
    from: FROM,
    to: clienteEmail,
    subject: `📦 Tu pedido ${numeroPedido} está en camino — Salas Art Gallery`,
    html,
  })
}

// ─── Email al cliente cuando el pago es confirmado ───────────────────────────
export async function sendPagoConfirmado(
  clienteEmail: string,
  clienteNombre: string,
  numeroPedido: string,
  productos?: EmailProducto[]
) {
  if (!process.env.RESEND_API_KEY) return

  const logoUrl = `${getAppUrl()}/logo.png`

  const productosSection =
    productos && productos.length > 0
      ? `
      <h2 style="font-size:15px;font-weight:600;margin:28px 0 16px;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Tu pedido</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Producto</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Cant.</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${productosRowsSimple(productos)}
        </tbody>
      </table>`
      : ''

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    ${emailHeader(logoUrl, 'Pago confirmado')}

    <div style="padding:32px;">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="display:inline-block;background:#d1fae5;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;text-align:center;">✓</div>
      </div>

      <p style="font-size:16px;margin:0 0 8px;color:#111827;">Hola <strong>${clienteNombre}</strong>,</p>
      <p style="font-size:15px;margin:0 0 24px;color:#374151;">
        ¡Tu pago fue confirmado! Ya estamos preparando tu pedido para enviarlo.
      </p>

      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:4px;margin-bottom:8px;">
        <p style="margin:0;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;">Número de pedido</p>
        <p style="margin:6px 0 0;font-size:22px;font-weight:bold;font-family:monospace;color:#78350f;">${numeroPedido}</p>
      </div>

      ${productosSection}

      <p style="font-size:13px;color:#6b7280;margin-top:24px;">
        Te avisaremos cuando tu pedido esté en camino. ¿Tienes dudas? Contáctanos por WhatsApp.
      </p>
    </div>

    ${emailFooter()}
  </div>`

  await resend.emails.send({
    from: FROM,
    to: clienteEmail,
    subject: `✅ Pago confirmado — Pedido ${numeroPedido}`,
    html,
  })
}

export interface VisitaGaleriaData {
  nombre: string
  email: string
  telefono: string
  fechaPreferida: string
  horarioPreferido: string
  personas: number
  mensaje?: string
}

function labelHorario(horario: string) {
  if (horario === 'manana') return 'Mañana'
  if (horario === 'tarde') return 'Tarde'
  return 'Flexible'
}

function formatFechaISO(fecha: string) {
  const parsed = new Date(`${fecha}T12:00:00`)
  return parsed.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function sendVisitaGaleriaAdmin(data: VisitaGaleriaData) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || !process.env.RESEND_API_KEY) return

  const logoUrl = `${getAppUrl()}/logo.png`
  const horario = labelHorario(data.horarioPreferido)
  const fecha = formatFechaISO(data.fechaPreferida)

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    ${emailHeader(logoUrl, 'Nueva solicitud de visita')}

    <div style="padding:32px;">
      <div style="background:#ede9fe;border-left:4px solid #7c3aed;padding:16px 20px;border-radius:4px;margin-bottom:28px;">
        <p style="margin:0;font-size:12px;color:#5b21b6;text-transform:uppercase;letter-spacing:0.05em;">Visita a la galería</p>
        <p style="margin:6px 0 0;font-size:18px;font-weight:bold;color:#4c1d95;">${fecha} · ${horario}</p>
      </div>

      <table style="width:100%;font-size:14px;margin-bottom:20px;">
        <tr><td style="color:#6b7280;padding:4px 0;width:140px;">Nombre</td><td style="font-weight:600;">${data.nombre}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Email</td><td>${data.email}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Teléfono</td><td>${data.telefono}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Personas</td><td>${data.personas}</td></tr>
      </table>

      ${
        data.mensaje
          ? `<h2 style="font-size:15px;font-weight:600;margin:0 0 8px;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Comentarios</h2>
             <p style="font-size:14px;margin:0;line-height:1.7;color:#374151;white-space:pre-line;">${data.mensaje}</p>`
          : ''
      }
    </div>

    ${emailFooter()}
  </div>`

  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `🏛️ Solicitud de visita — ${data.nombre}`,
    html,
  })
}

export async function sendVisitaGaleriaConfirmacion(data: VisitaGaleriaData) {
  if (!process.env.RESEND_API_KEY) return

  const logoUrl = `${getAppUrl()}/logo.png`
  const horario = labelHorario(data.horarioPreferido)
  const fecha = formatFechaISO(data.fechaPreferida)

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    ${emailHeader(logoUrl, 'Solicitud recibida')}

    <div style="padding:32px;">
      <p style="font-size:16px;margin:0 0 16px;">Hola <strong>${data.nombre}</strong>,</p>
      <p style="font-size:14px;line-height:1.7;color:#374151;margin:0 0 20px;">
        Recibimos tu solicitud para visitar Salas Art Gallery. Revisaremos la agenda y te
        contactaremos pronto para confirmar tu cita.
      </p>

      <table style="width:100%;font-size:14px;background:#f9fafb;border-radius:8px;padding:16px;">
        <tr><td style="color:#6b7280;padding:4px 8px;">Fecha preferida</td><td style="padding:4px 8px;">${fecha}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 8px;">Horario</td><td style="padding:4px 8px;">${horario}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 8px;">Personas</td><td style="padding:4px 8px;">${data.personas}</td></tr>
      </table>

      <p style="font-size:13px;color:#6b7280;margin-top:24px;">
        Este espacio atiende con cita previa. Si necesitas cambiar tu solicitud, responde a este correo.
      </p>
    </div>

    ${emailFooter()}
  </div>`

  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: 'Recibimos tu solicitud de visita — Salas Art Gallery',
    html,
  })
}
