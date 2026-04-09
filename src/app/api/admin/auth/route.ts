import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAMES = {
  admin: 'admin_session',
  studio: 'studio_session',
} as const

type Section = keyof typeof COOKIE_NAMES

export async function POST(request: NextRequest) {
  const { username, password, section } = await request.json()

  const validUsername = process.env.ADMIN_USERNAME
  const validPassword = process.env.ADMIN_PASSWORD
  const sessionSecret = process.env.ADMIN_SESSION_SECRET

  if (!validUsername || !validPassword || !sessionSecret) {
    return NextResponse.json({ error: 'Servidor mal configurado' }, { status: 500 })
  }

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  const cookieName = COOKIE_NAMES[(section as Section) ?? 'admin'] ?? COOKIE_NAMES.admin

  const response = NextResponse.json({ ok: true })
  response.cookies.set(cookieName, sessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
  })
  return response
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section') as Section | null
  const cookieName = COOKIE_NAMES[section ?? 'admin'] ?? COOKIE_NAMES.admin

  const response = NextResponse.json({ ok: true })
  response.cookies.delete(cookieName)
  return response
}
