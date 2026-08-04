import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Producto } from '@/sanity/lib/types'
import { etiquetaHref } from '@/lib/etiquetas'

interface ProductObraFichaProps {
  producto: Producto
  precioFinal: number
  descuentoActivo?: boolean
}

function formatPrecioMXN(amount: number) {
  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function FichaRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-row gap-2 items-baseline sm:gap-3">
      <dt className="font-semibold text-gray-900 shrink-0 w-[4.75rem] text-sm sm:w-28 sm:text-base">{label}:</dt>
      <dd className="text-gray-700 text-sm sm:text-base min-w-0">{children}</dd>
    </div>
  )
}

export default function ProductObraFicha({
  producto,
  precioFinal,
  descuentoActivo,
}: ProductObraFichaProps) {
  const tecnica = producto.tecnica?.trim() || null
  const etiquetas = (producto.etiquetas ?? []).map((t) => t.trim()).filter(Boolean)

  return (
    <div className="sm:rounded-xl sm:border sm:border-gray-100 sm:bg-[var(--background)] sm:px-6 sm:py-6">
      <h1 className="font-display text-2xl sm:text-3xl font-medium text-gray-900 leading-tight mb-4 sm:mb-5">
        {producto.titulo}
      </h1>
      <dl className="space-y-2 sm:space-y-3.5">
        {producto.artista?.nombre && (
          <FichaRow label="Artista">
            {producto.artista.slug?.current ? (
              <Link
                href={`/artistas/${producto.artista.slug.current}`}
                className="text-violet-800 hover:text-violet-950 underline-offset-2 hover:underline"
              >
                {producto.artista.nombre}
              </Link>
            ) : (
              producto.artista.nombre
            )}
          </FichaRow>
        )}

        {etiquetas.length > 0 && (
          <FichaRow label="Claves">
            <span className="flex flex-wrap gap-1.5">
              {etiquetas.map((tag) => (
                <Link
                  key={tag}
                  href={etiquetaHref(tag)}
                  className="inline-flex rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-800 hover:bg-violet-100 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </span>
          </FichaRow>
        )}

        {tecnica && <FichaRow label="Técnica">{tecnica}</FichaRow>}

        {producto.dimensiones?.trim() && (
          <FichaRow label="Medidas">{producto.dimensiones.trim()}</FichaRow>
        )}

        {producto.anio != null && producto.anio > 0 && (
          <FichaRow label="Año">{producto.anio}</FichaRow>
        )}

        <FichaRow label="Precio">
          <span className="inline-flex flex-wrap items-baseline gap-2">
            {descuentoActivo && precioFinal < producto.precio ? (
              <>
                <span className="line-through text-gray-400">
                  {formatPrecioMXN(producto.precio)}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatPrecioMXN(precioFinal)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">
                {formatPrecioMXN(precioFinal)}
              </span>
            )}
            <span className="text-xs text-gray-400">IVA incluido</span>
          </span>
        </FichaRow>

        <FichaRow label="Estado">
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={`font-medium ${
                producto.disponible ? 'text-green-700' : 'text-red-600'
              }`}
            >
              {producto.disponible ? 'Disponible' : 'Vendida'}
            </span>
            {producto.disponible && (
              <span className="text-xs uppercase tracking-wider text-violet-700">
                Obra única
              </span>
            )}
          </span>
        </FichaRow>
      </dl>
    </div>
  )
}
