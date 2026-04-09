'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  imagenPrincipalUrl: string
  imagenPrincipalAlt: string
  imagenesGaleria: string[]
  titulo: string
}

export default function ProductImageGallery({
  imagenPrincipalUrl,
  imagenPrincipalAlt,
  imagenesGaleria,
  titulo,
}: Props) {
  const todas = [imagenPrincipalUrl, ...imagenesGaleria]
  const [activa, setActiva] = useState(0)

  /* ── Swipe en móvil ── */
  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) < 40) return
    if (diff > 0) setActiva((i) => Math.min(i + 1, todas.length - 1))
    else setActiva((i) => Math.max(i - 1, 0))
    touchStartX.current = null
  }

  return (
    <>
      {/* ═══════════════════════════════
          MÓVIL: carrusel fullwidth
      ════════════════════════════════ */}
      <div className="sm:hidden min-w-0">
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-100 w-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carril de imágenes */}
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${activa * 100}%)` }}
          >
            {todas.map((imgUrl, index) => (
              <div key={index} className="relative w-full h-full shrink-0">
                <Image
                  src={imgUrl}
                  alt={index === 0 ? imagenPrincipalAlt || titulo : `${titulo} - Imagen ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>

        </div>

        {/* Dots de posición */}
        {todas.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {todas.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiva(index)}
                aria-label={`Ver imagen ${index + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  activa === index
                    ? 'w-5 h-2 bg-gray-900'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════
          DESKTOP: miniaturas a la izquierda
      ════════════════════════════════ */}
      <div className="hidden sm:flex gap-4 min-w-0">
        {/* Miniaturas verticales */}
        {todas.length > 1 && (
          <div className="flex flex-col gap-2 shrink-0">
            {todas.map((imgUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiva(index)}
                className={`relative w-20 overflow-hidden rounded-lg bg-gray-100 ring-2 transition-all shrink-0 ${
                  activa === index
                    ? 'ring-gray-900'
                    : 'ring-transparent hover:ring-gray-400'
                }`}
                style={{ aspectRatio: '3/4' }}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={activa === index}
              >
                <Image
                  src={imgUrl}
                  alt={index === 0 ? imagenPrincipalAlt || titulo : `${titulo} - Imagen ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Imagen principal */}
        <div className="relative flex-1 min-w-0 aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={todas[activa]}
            alt={activa === 0 ? imagenPrincipalAlt || titulo : `${titulo} - Imagen ${activa + 1}`}
            fill
            className="object-contain transition-opacity duration-200"
            priority={activa === 0}
            sizes="50vw"
          />
        </div>
      </div>
    </>
  )
}
