'use client'

import { useState } from 'react'
import AddToCartButton from './AddToCartButton'
import BuyNowButton from './BuyNowButton'

interface ProductBuyOptionsProps {
  id: string
  slug: string
  title: string
  price: number
  imageUrl: string
  precioOriginal: number
  tieneDescuento?: boolean
  tipoDescuento?: 'porcentaje' | 'monto'
  valorDescuento?: number
  opcionExtra?: {
    nombre: string
    precio: number
  }
}

export default function ProductBuyOptions({
  id,
  slug,
  title,
  price,
  imageUrl,
  precioOriginal,
  tieneDescuento,
  tipoDescuento,
  valorDescuento,
  opcionExtra,
}: ProductBuyOptionsProps) {
  const [conExtra, setConExtra] = useState(false)

  const tieneOpcion = !!opcionExtra && opcionExtra.precio > 0

  const finalPrice = tieneOpcion && conExtra ? price + opcionExtra.precio : price
  const finalTitle =
    tieneOpcion && conExtra ? `${title} (con ${opcionExtra.nombre.toLowerCase()})` : title

  // El precio original tachado también debe sumarse el complemento si está seleccionado
  const precioOriginalFinal =
    tieneOpcion && conExtra ? precioOriginal + opcionExtra.precio : precioOriginal

  const mostrarDescuento = tieneDescuento && finalPrice < precioOriginalFinal

  return (
    <>
      {/* Precio dinámico */}
      <div className="mb-1 flex items-baseline gap-3 flex-wrap">
        {mostrarDescuento ? (
          <>
            <p className="text-2xl text-gray-900 line-through tracking-tight">
              ${precioOriginalFinal.toLocaleString()}
            </p>
            <p className="text-2xl font-semibold text-amber-600 tracking-tight">
              ${finalPrice.toLocaleString()}
            </p>
            {valorDescuento && (
              <span className="bg-amber-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                {tipoDescuento === 'porcentaje'
                  ? `${valorDescuento}% OFF`
                  : `$${valorDescuento} OFF`}
              </span>
            )}
          </>
        ) : (
          <p className="text-2xl font-semibold text-gray-800 tracking-tight">
            ${finalPrice.toLocaleString()}
          </p>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-6 tracking-wide">IVA incluido</p>

      {/* Selector de complemento */}
      {tieneOpcion && (
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            ¿Quieres agregar {opcionExtra.nombre.toLowerCase()}?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setConExtra(false)}
              className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer text-left ${
                !conExtra
                  ? 'border-amber-400 bg-amber-50 text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="block text-xs text-gray-500 mb-0.5">Sin {opcionExtra.nombre.toLowerCase()}</span>
              <span className="font-semibold">${price.toLocaleString()}</span>
            </button>
            <button
              type="button"
              onClick={() => setConExtra(true)}
              className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer text-left ${
                conExtra
                  ? 'border-amber-400 bg-amber-50 text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="block text-xs text-gray-500 mb-0.5">
                Con {opcionExtra.nombre.toLowerCase()} (+${opcionExtra.precio.toLocaleString()})
              </span>
              <span className="font-semibold">${(price + opcionExtra.precio).toLocaleString()}</span>
            </button>
          </div>
        </div>
      )}

      {/* Botones de compra */}
      <div className="flex flex-col gap-3">
        <BuyNowButton
          id={id}
          slug={slug}
          title={finalTitle}
          price={finalPrice}
          imageUrl={imageUrl}
        />
        <AddToCartButton
          id={id}
          slug={slug}
          title={finalTitle}
          price={finalPrice}
          imageUrl={imageUrl}
          variant="secondary"
          className="flex-1"
        />
      </div>
    </>
  )
}
