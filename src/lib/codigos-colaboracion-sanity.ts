import { client } from '@/lib/sanity'
import { codigosColaboracionActivosQuery } from '@/sanity/lib/queries'
import type { CodigoColaboracion } from '@/sanity/lib/types'
import {
  normalizarCodigoColaboracion,
  validarCodigoColaboracion,
} from '@/lib/codigos-colaboracion'

export async function obtenerCodigoColaboracionActivo(
  codigoRaw: string
): Promise<CodigoColaboracion | null> {
  const code = normalizarCodigoColaboracion(codigoRaw)
  if (!code) return null
  const docs = await client.fetch<CodigoColaboracion[]>(codigosColaboracionActivosQuery)
  return docs.find((d) => normalizarCodigoColaboracion(d.codigo) === code) ?? null
}

/** Valida el código enviado por el cliente (checkout / pago). Vacío = ok sin código. */
export async function resolverCodigoColaboracionEnServidor(
  codigoRaw?: string
): Promise<
  | {
      ok: true
      codigoColaboracion: string
      colaboracionNombre: string
      exposicionColaboracionTitulo?: string
    }
  | { ok: false; error: string }
> {
  const codigo = typeof codigoRaw === 'string' ? normalizarCodigoColaboracion(codigoRaw) : ''
  if (!codigo) {
    return { ok: true, codigoColaboracion: '', colaboracionNombre: '' }
  }

  const doc = await obtenerCodigoColaboracionActivo(codigo)
  const r = validarCodigoColaboracion(doc, codigo)
  if (!r.ok) return { ok: false, error: r.error }

  return {
    ok: true,
    codigoColaboracion: r.codigoNormalizado,
    colaboracionNombre: r.nombre,
    exposicionColaboracionTitulo: r.exposicionTitulo,
  }
}
