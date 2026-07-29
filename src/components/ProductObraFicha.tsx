import type { ReactNode } from 'react'
import Link from 'next/link'
import { labelCategoria, labelSubcategoria } from '@/lib/categorias'
import type { Producto } from '@/sanity/lib/types'

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

function getTecnica(producto: Producto): string | null {
  if (producto.tecnica?.trim()) return producto.tecnica.trim()
  if (producto.categoria === 'ceramica' && producto.subcategoria) {
    return `Cerámica de ${labelSubcategoria(producto.subcategoria).toLowerCase()}`
  }
  return null
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
  const tecnica = getTecnica(producto)

  return (
    <div className="sm:rounded-xl sm:border sm:border-gray-100 sm:bg-[var(--background)] sm:px-6 sm:py-6">
      <dl className="space-y-2 sm:space-y-3.5">
        <FichaRow label="Título">{producto.titulo}</FichaRow>

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

        <FichaRow label="Categoría">{labelCategoria(producto.categoria)}</FichaRow>

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
