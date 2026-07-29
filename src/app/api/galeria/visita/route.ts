import { NextResponse } from 'next/server'
import { sendVisitaGaleriaAdmin, sendVisitaGaleriaConfirmacion } from '@/lib/email'

interface VisitaBody {
  nombre?: string
  email?: string
  telefono?: string
  fechaPreferida?: string
  horarioPreferido?: string
  personas?: number
  mensaje?: string
}

const HORARIOS_VALIDOS = new Set(['manana', 'tarde', 'flexible'])

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const parsed = new Date(`${date}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return parsed >= today
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'El servicio de correo no está configurado.' },
      { status: 500 }
    )
  }

  if (!process.env.ADMIN_EMAIL) {
    return NextResponse.json(
      { error: 'No hay correo de administración configurado.' },
      { status: 500 }
    )
  }

  let body: VisitaBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  const nombre = body.nombre?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const telefono = body.telefono?.trim() ?? ''
  const fechaPreferida = body.fechaPreferida?.trim() ?? ''
  const horarioPreferido = body.horarioPreferido?.trim() ?? ''
  const personas = body.personas
  const mensaje = body.mensaje?.trim() ?? ''

  if (!nombre || nombre.length > 120) {
    return NextResponse.json({ error: 'Indica tu nombre completo.' }, { status: 400 })
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Indica un correo válido.' }, { status: 400 })
  }
  if (!telefono || telefono.length > 30) {
    return NextResponse.json({ error: 'Indica un teléfono de contacto.' }, { status: 400 })
  }
  if (!fechaPreferida || !isValidDate(fechaPreferida)) {
    return NextResponse.json({ error: 'Indica una fecha válida a partir de hoy.' }, { status: 400 })
  }
  if (!horarioPreferido || !HORARIOS_VALIDOS.has(horarioPreferido)) {
    return NextResponse.json({ error: 'Selecciona un horario preferido.' }, { status: 400 })
  }
  if (typeof personas !== 'number' || !Number.isInteger(personas) || personas < 1 || personas > 12) {
    return NextResponse.json({ error: 'Indica entre 1 y 12 personas.' }, { status: 400 })
  }
  if (mensaje.length > 1000) {
    return NextResponse.json({ error: 'El comentario es demasiado largo.' }, { status: 400 })
  }

  const data = {
    nombre,
    email,
    telefono,
    fechaPreferida,
    horarioPreferido,
    personas,
    mensaje,
  }

  try {
    await Promise.all([
      sendVisitaGaleriaAdmin(data),
      sendVisitaGaleriaConfirmacion(data),
    ])
  } catch (err) {
    console.error('[galeria/visita]', err)
    return NextResponse.json(
      { error: 'No pudimos enviar tu solicitud. Intenta más tarde.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
