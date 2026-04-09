import { NextRequest, NextResponse } from 'next/server'

const ADMIN_LOGIN = '/admin/login'
const STUDIO_LOGIN = '/studio/login'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminLogin = pathname === ADMIN_LOGIN
  const isStudioLogin = pathname === STUDIO_LOGIN
  const isAuthApi = pathname.startsWith('/api/admin/auth')

  if (isAdminLogin || isStudioLogin || isAuthApi) {
    return NextResponse.next()
  }

  const isAdminRoute = pathname.startsWith('/admin')
  const isStudioRoute = pathname.startsWith('/studio')

  if (!isAdminRoute && !isStudioRoute) {
    return NextResponse.next()
  }

  const cookieName = isStudioRoute ? 'studio_session' : 'admin_session'
  const session = request.cookies.get(cookieName)?.value

  if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
    const loginPath = isStudioRoute ? STUDIO_LOGIN : ADMIN_LOGIN
    const loginUrl = new URL(loginPath, request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/studio/:path*'],
}
