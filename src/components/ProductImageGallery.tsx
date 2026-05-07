'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [lightboxOpen, setLightboxOpen] = useState(false)

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

  /* ── Lightbox: cerrar con Escape, bloquear scroll, interceptar botón Atrás ── */
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') setActiva((i) => Math.min(i + 1, todas.length - 1))
      if (e.key === 'ArrowLeft') setActiva((i) => Math.max(i - 1, 0))
    }

    // Agregar estado al historial para que el botón "Atrás" cierre el lightbox
    history.pushState({ lightbox: true }, '')
    const handlePopState = () => setLightboxOpen(false)

    document.addEventListener('keydown', handleKey)
    window.addEventListener('popstate', handlePopState)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('popstate', handlePopState)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, todas.length])

  const LupaButton = ({ className = '' }: { className?: string }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        setLightboxOpen(true)
      }}
      aria-label="Ampliar imagen"
      className={`absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-800 hover:bg-white hover:scale-105 transition-all cursor-pointer ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
      </svg>
    </button>
  )

  return (
    <>
      {/* ═══════════════════════════════
          MÓVIL: carrusel fullwidth
      ════════════════════════════════ */}
      <div className="sm:hidden min-w-0">
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-100 w-full touch-pan-y select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carril de imágenes */}
          <div
            className="flex h-full transition-transform duration-300 ease-in-out pointer-events-none"
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

          <LupaButton />
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
                className={`relative w-20 overflow-hidden rounded-lg bg-gray-100 ring-2 transition-all shrink-0 cursor-pointer ${
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
          <LupaButton />
        </div>
      </div>

      {/* ═══════════════════════════════
          LIGHTBOX (modal de imagen ampliada)
      ════════════════════════════════ */}
      {lightboxOpen && (
        /* Fondo negro — clic aquí cierra */
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center cursor-pointer"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Ver imagen ampliada"
        >
          {/* Bloque imagen + controles — clic aquí NO cierra */}
          <div
            className="flex flex-col items-center gap-5 cursor-default"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return
              const diff = touchStartX.current - e.changedTouches[0].clientX
              touchStartX.current = null
              if (Math.abs(diff) >= 40) {
                if (diff > 0) setActiva((i) => Math.min(i + 1, todas.length - 1))
                else setActiva((i) => Math.max(i - 1, 0))
              }
            }}
          >
            {/* Imagen */}
            <Image
              src={todas[activa]}
              alt={activa === 0 ? imagenPrincipalAlt || titulo : `${titulo} - Imagen ${activa + 1}`}
              width={0}
              height={0}
              sizes="100vw"
              quality={95}
              className="w-auto h-auto max-w-[92vw] max-h-[72vh]"
            />

            {/* Controles: ← X → justo debajo de la imagen */}
            <div className="flex items-center gap-8">
              <button
                type="button"
                onClick={() => setActiva((i) => Math.max(i - 1, 0))}
                disabled={activa === 0}
                aria-label="Imagen anterior"
                className="w-12 h-12 text-white disabled:opacity-25 flex items-center justify-center cursor-pointer"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Cerrar"
                className="w-12 h-12 text-white flex items-center justify-center cursor-pointer"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setActiva((i) => Math.min(i + 1, todas.length - 1))}
                disabled={activa === todas.length - 1}
                aria-label="Imagen siguiente"
                className="w-12 h-12 text-white disabled:opacity-25 flex items-center justify-center cursor-pointer"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
