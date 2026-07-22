import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Webhook de revalidación llamado por Sanity cuando cambia contenido.
 * Configurar en sanity.io/manage → API → Webhooks con:
 *   URL: https://salasartgallery.com/api/revalidate?secret=TU_SECRETO
 *   Trigger: create, update, delete
 *   Filter: (opcional) _type == "producto" || _type == "hero" || ...
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'SANITY_REVALIDATE_SECRET no configurado' }, { status: 500 })
  }

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Secreto inválido' }, { status: 401 })
  }

  let body: { _type?: string; slug?: { current?: string } } = {}
  try {
    body = await request.json()
  } catch {
    // body vacío es válido — revalidar todo
  }

  const type = body?._type
  const slug = body?.slug?.current

  try {
    // Siempre revalidar inicio y listas
    revalidatePath('/', 'page')
    revalidatePath('/productos', 'page')
    revalidatePath('/promociones', 'page')

    // Si es un producto y tiene slug, revalidar solo esa página
    if (type === 'producto' && slug) {
      revalidatePath(`/productos/${slug}`, 'page')
    }

    // Si es contenido de inicio
    if (type === 'hero' || type === 'sobreNosotros' || type === 'seccionDestacada' || type === 'shopTheLook' || type === 'postInstagram') {
      revalidatePath('/', 'page')
    }

    // Si es una promoción
    if (type === 'promocion') {
      revalidatePath('/promociones', 'page')
      revalidatePath('/carrito/checkout', 'page')
    }

    // Revalidar tag genérico de Sanity (usado por fetch con next.tags)
    // revalidateTag requiere que los fetch usen { next: { tags: ['sanity'] } }
    // Se deja como referencia para futuras implementaciones
    // revalidateTag('sanity')

    return NextResponse.json({
      revalidated: true,
      type: type ?? 'all',
      slug: slug ?? null,
      now: Date.now(),
    })
  } catch (err) {
    console.error('Error revalidando:', err)
    return NextResponse.json({ error: 'Error al revalidar' }, { status: 500 })
  }
}

// Sanity a veces hace GET para verificar que el endpoint existe
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return NextResponse.json({ ok: true, message: 'Endpoint de revalidación activo' })
}
