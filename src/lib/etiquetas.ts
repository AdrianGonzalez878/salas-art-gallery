/** Normaliza una etiqueta libre para comparar / filtrar. */
export function normalizeEtiqueta(value?: string | null): string {
  return (value ?? '').trim()
}

/** Etiquetas únicas, limpias y ordenadas alfabéticamente. */
export function uniqueEtiquetas(values: (string | null | undefined)[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of values) {
    const tag = normalizeEtiqueta(raw)
    if (!tag) continue
    const key = tag.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(tag)
  }
  return result.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
}

export function etiquetaHref(tag: string, basePath = '/productos'): string {
  const params = new URLSearchParams()
  params.set('etiqueta', normalizeEtiqueta(tag))
  return `${basePath}?${params.toString()}`
}
