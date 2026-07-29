interface ProductObraDetailsProps {
  disponible: boolean
  tecnica?: string | null
  dimensiones?: string | null
  anio?: number | null
}

export default function ProductObraDetails({
  disponible,
  tecnica,
  dimensiones,
  anio,
}: ProductObraDetailsProps) {
  const hasMetadata = Boolean(tecnica?.trim() || dimensiones?.trim() || anio)

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
            disponible
              ? 'bg-violet-100 text-violet-800'
              : 'bg-neutral-200 text-neutral-600'
          }`}
        >
          Obra única
        </span>
        <span
          className={`text-sm font-medium ${
            disponible ? 'text-green-700' : 'text-red-600'
          }`}
        >
          {disponible ? 'Disponible' : 'Vendida'}
        </span>
      </div>

      {hasMetadata && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {tecnica?.trim() && (
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                Técnica / material
              </dt>
              <dd className="text-gray-800">{tecnica.trim()}</dd>
            </div>
          )}
          {dimensiones?.trim() && (
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                Dimensiones
              </dt>
              <dd className="text-gray-800">{dimensiones.trim()}</dd>
            </div>
          )}
          {anio != null && anio > 0 && (
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                Año
              </dt>
              <dd className="text-gray-800">{anio}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}
