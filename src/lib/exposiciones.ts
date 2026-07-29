import type { Exposicion } from '@/sanity/lib/types'

export type EstadoExposicion = 'proxima' | 'en-curso' | 'finalizada'

export function getEstadoExposicion(
  fechaInicio: string,
  fechaFin: string,
  ahora = new Date()
): EstadoExposicion {
  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  if (ahora < inicio) return 'proxima'
  if (ahora > fin) return 'finalizada'
  return 'en-curso'
}

export function formatearPeriodoExposicion(
  fechaInicio?: string | null,
  fechaFin?: string | null
): string | null {
  if (!fechaInicio && !fechaFin) return null
  const opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City',
  }
  if (fechaInicio && fechaFin) {
    const d1 = new Date(fechaInicio)
    const d2 = new Date(fechaFin)
    return `Del ${d1.toLocaleDateString('es-MX', opts)} al ${d2.toLocaleDateString('es-MX', opts)}`
  }
  if (fechaFin) {
    return `Hasta el ${new Date(fechaFin).toLocaleDateString('es-MX', opts)}`
  }
  if (fechaInicio) {
    return `Desde el ${new Date(fechaInicio).toLocaleDateString('es-MX', opts)}`
  }
  return null
}

export function formatearUbicacion(ubicacion?: Exposicion['ubicacion']): string | null {
  if (!ubicacion) return null
  const partes = [ubicacion.nombre, ubicacion.ciudad].filter(Boolean)
  return partes.length > 0 ? partes.join(' · ') : null
}

export function etiquetaEstado(estado: EstadoExposicion): string {
  if (estado === 'en-curso') return 'En curso'
  if (estado === 'proxima') return 'Próxima'
  return 'Finalizada'
}

export function agruparExposiciones(exposiciones: Exposicion[], ahora = new Date()) {
  const enCurso: Exposicion[] = []
  const proximas: Exposicion[] = []
  const finalizadas: Exposicion[] = []

  for (const expo of exposiciones) {
    const estado = getEstadoExposicion(expo.fechaInicio, expo.fechaFin, ahora)
    if (estado === 'en-curso') enCurso.push(expo)
    else if (estado === 'proxima') proximas.push(expo)
    else finalizadas.push(expo)
  }

  proximas.sort(
    (a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
  )
  enCurso.sort(
    (a, b) => new Date(a.fechaFin).getTime() - new Date(b.fechaFin).getTime()
  )
  finalizadas.sort(
    (a, b) => new Date(b.fechaFin).getTime() - new Date(a.fechaFin).getTime()
  )

  return { enCurso, proximas, finalizadas }
}
