'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ShopTheLook, PortableTextBlock } from '@/sanity/lib/types'
import { useCart } from '@/context/CartContext'

function portableTextToPlain(blocks: PortableTextBlock[] | string | undefined): string {
  if (!blocks) return ''
  if (typeof blocks === 'string') return blocks
  return blocks
    .map((block) => block.children?.map((span) => span.text).join('') ?? '')
    .join(' ')
}

interface ShopTheLookSectionProps {
  data: ShopTheLook
  imagenModeloUrl: string
  productosConImagenes: {
    producto: ShopTheLook['productos'][0]['producto']
    posicionX: number
    posicionY: number
    imagenUrl: string
  }[]
}

export default function ShopTheLookSection({
  data,
  imagenModeloUrl,
  productosConImagenes,
}: ShopTheLookSectionProps) {
  const { addItem, items } = useCart()
  const [productoSeleccionado, setProductoSeleccionado] = useState<typeof productosConImagenes[0] | null>(
    productosConImagenes[0] || null
  )
  const [added, setAdded] = useState(false)
  const isInCart = productoSeleccionado ? items.some((i) => i.id === productoSeleccionado.producto._id) : false

  function getPrecioFinal(p: typeof productosConImagenes[0]['producto']) {
    let precio = p.precio
    const valor = p.valorDescuento
    if (p.tieneDescuento && p.tipoDescuento && valor != null) {
      if (p.tipoDescuento === 'porcentaje') precio = p.precio * (1 - valor / 100)
      else if (p.tipoDescuento === 'monto') precio = Math.max(0, p.precio - valor)
    }
    return Math.round(precio)
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Encabezado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {data.titulo}
          </h2>
          {data.descripcion && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {data.descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 items-stretch">
          {/* Imagen de modelo con hotspots - Reducida */}
          <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={imagenModeloUrl}
              alt={data.imagenModelo.alt || 'Shop the Look'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {/* Botones hotspot */}
            {productosConImagenes.map((item, index) => (
              <button
                key={index}
                onClick={() => setProductoSeleccionado(item)}
                className="absolute group cursor-pointer"
                style={{
                  left: `${item.posicionX}%`,
                  top: `${item.posicionY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                aria-label={`Ver ${item.producto.titulo}`}
              >
                {/* Círculo animado */}
                <div className="relative">
                  {/* Pulso de fondo */}
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
                  
                  {/* Botón principal */}
                  <div className="relative w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-900 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Sidebar de producto - Misma altura que la modelo en desktop */}
          <div className="relative flex items-center justify-center lg:pl-8 lg:h-full">
            {productoSeleccionado && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all animate-fadeIn group w-full flex flex-row lg:flex-col lg:h-full overflow-hidden">
                <Link
                  href={`/productos/${productoSeleccionado.producto.slug.current}`}
                  className="contents"
                >
                  {/* Imagen del producto - Ocupa todo el espacio disponible en desktop */}
                  <div className="relative w-24 h-24 lg:w-full lg:flex-1 lg:min-h-0 bg-gray-100 overflow-hidden shrink-0">
                    <Image
                      src={productoSeleccionado.imagenUrl}
                      alt={productoSeleccionado.producto.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 96px, 50vw"
                    />
                  </div>

                  {/* Info del producto */}
                  <div className="p-3 lg:p-6 flex flex-col justify-center lg:justify-start shrink-0 min-w-0 flex-1 lg:flex-none">
                    {/* Categoría - solo desktop */}
                    <span className="hidden lg:inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-3 capitalize w-fit">
                      {productoSeleccionado.producto.categoria}
                    </span>
                    
                    <h3 className="text-sm lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-3 line-clamp-2 shrink-0">
                      {productoSeleccionado.producto.titulo}
                    </h3>
                    
                    {/* Precio */}
                    <div className="mb-1 lg:mb-4 shrink-0">
                      {productoSeleccionado.producto.tieneDescuento && 
                       productoSeleccionado.producto.tipoDescuento && 
                       productoSeleccionado.producto.valorDescuento ? (
                        <>
                          <p className="text-xs lg:text-lg text-gray-500 line-through">
                            ${productoSeleccionado.producto.precio.toLocaleString()}
                          </p>
                          <p className="text-base lg:text-3xl font-bold text-red-600">
                            ${(() => {
                              const producto = productoSeleccionado.producto
                              let precioFinal = producto.precio
                              const valor = producto.valorDescuento
                              if (producto.tipoDescuento === 'porcentaje' && valor != null) {
                                precioFinal = producto.precio * (1 - valor / 100)
                              } else if (producto.tipoDescuento === 'monto' && valor != null) {
                                precioFinal = Math.max(0, producto.precio - valor)
                              }
                              return Math.round(precioFinal).toLocaleString()
                            })()}
                          </p>
                        </>
                      ) : (
                        <p className="text-base lg:text-3xl font-bold text-gray-900">
                          ${productoSeleccionado.producto.precio.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Descripción - 1 línea en móvil para que siempre se vea el botón; 3 en desktop */}
                    <p className="text-gray-600 line-clamp-1 lg:line-clamp-3 mb-2 lg:mb-4 text-xs lg:text-base min-h-0 shrink">
                      {portableTextToPlain(productoSeleccionado.producto.descripcion)}
                    </p>

                    {/* Botón Comprar - solo móvil; siempre visible */}
                    <span className="lg:hidden inline-flex items-center justify-center w-full bg-yellow-400 text-black py-2.5 px-4 rounded-lg font-semibold text-sm shrink-0 mt-auto">
                      Comprar ahora
                    </span>

                    {/* Botón Comprar - desktop */}
                    <span className="hidden lg:inline-flex items-center justify-center w-full bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold group-hover:bg-yellow-500 transition-colors">
                      Comprar ahora
                    </span>
                  </div>
                </Link>

                {/* Agregar al carrito - fuera del Link para que el clic no navegue */}
                <div className="hidden lg:flex flex-col p-6 pt-0 flex-shrink-0 -mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!productoSeleccionado) return
                      if (isInCart) return
                      addItem({
                        id: productoSeleccionado.producto._id,
                        slug: productoSeleccionado.producto.slug.current,
                        title: productoSeleccionado.producto.titulo,
                        price: getPrecioFinal(productoSeleccionado.producto),
                        imageUrl: productoSeleccionado.imagenUrl,
                      })
                      setAdded(true)
                      setTimeout(() => setAdded(false), 2000)
                    }}
                    disabled={added || isInCart}
                    className={`w-full border-2 py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer ${
                      added || isInCart
                        ? 'border-gray-300 text-gray-500 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    {added ? 'Añadido' : isInCart ? 'Ya añadido al carrito' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
