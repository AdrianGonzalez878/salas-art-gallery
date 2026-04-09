/**
 * URL pública del sitio (canonical, sitemap, OG).
 * En Vercel: define NEXT_PUBLIC_SITE_URL=https://tudominio.com en Environment Variables.
 * Si falta, en build usa VERCEL_URL (preview/producción).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) {
    return fromEnv.startsWith('http')
      ? fromEnv.replace(/\/$/, '')
      : `https://${fromEnv.replace(/\/$/, '')}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }
  return 'http://localhost:3000'
}
