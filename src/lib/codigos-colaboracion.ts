import type { CodigoColaboracion } from '@/sanity/lib/types'

export function normalizarCodigoColaboracion(raw: string): string {
  return raw.trim().toUpperCase()
}

export type ResultadoValidarCodigoColaboracion =
  | {
      ok: true
      codigoNormalizado: string
      nombre: string
      exposicionTitulo?: string
    }
  | { ok: false; error: string }

export function validarCodigoColaboracion(
  doc: CodigoColaboracion | null,
  codigoBuscado: string
): ResultadoValidarCodigoColaboracion {
  const codigoNormalizado = normalizarCodigoColaboracion(codigoBuscado)
  if (!codigoNormalizado) {
    return { ok: false, error: 'Ingresa un código de colaboración' }
  }
  if (!doc) {
    return { ok: false, error: 'Código de colaboración no válido' }
  }
  if (!doc.activo) {
    return { ok: false, error: 'Este código ya no está disponible' }
  }
  if (normalizarCodigoColaboracion(doc.codigo) !== codigoNormalizado) {
    return { ok: false, error: 'Código de colaboración no válido' }
  }
  return {
    ok: true,
    codigoNormalizado,
    nombre: doc.nombre,
    exposicionTitulo: doc.exposicion?.titulo,
  }
}
