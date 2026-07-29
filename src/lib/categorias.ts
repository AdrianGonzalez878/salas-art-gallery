/** Categorías de obras — Salas Art Gallery */

export const CATEGORIAS = [
  { value: 'litografia', label: 'Litografía' },
  { value: 'acrilicos', label: 'Acrílicos' },
  { value: 'arte-objeto', label: 'Arte objeto' },
  { value: 'oleos', label: 'Óleos' },
  { value: 'madera-tallada', label: 'Madera tallada' },
  { value: 'ceramica', label: 'Cerámica' },
  { value: 'bronce', label: 'Bronce' },
] as const

export type CategoriaValue = (typeof CATEGORIAS)[number]['value']

export const SUBCATEGORIAS_CERAMICA = [
  { value: 'alta-temperatura', label: 'Alta temperatura' },
  { value: 'baja-temperatura', label: 'Baja temperatura' },
] as const

export type SubcategoriaCeramica = (typeof SUBCATEGORIAS_CERAMICA)[number]['value']

export const categoriasMap: Record<string, string> = Object.fromEntries(
  CATEGORIAS.map((c) => [c.value, c.label])
)

export const subcategoriasCeramicaMap: Record<string, string> = Object.fromEntries(
  SUBCATEGORIAS_CERAMICA.map((s) => [s.value, s.label])
)

export function labelCategoria(value?: string | null): string {
  if (!value) return 'Obra'
  return categoriasMap[value] ?? value
}

export function labelSubcategoria(value?: string | null): string {
  if (!value) return ''
  return subcategoriasCeramicaMap[value] ?? value
}

/** Opciones para schemas de Sanity */
export const categoriaOptions = CATEGORIAS.map((c) => ({
  title: c.label,
  value: c.value,
}))

export const subcategoriaCeramicaOptions = SUBCATEGORIAS_CERAMICA.map((s) => ({
  title: s.label,
  value: s.value,
}))
