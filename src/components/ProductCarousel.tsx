'use client'

import { useMemo, useRef } from 'react'
import type { Producto } from '@/sanity/lib/types'
import ProductCard from './ProductCard'

interface ProductCarouselProps {
  productos: Producto[]
}

export default function ProductCarousel({ productos }: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollAmount = useMemo(() => {
    // Fallback: se recalcula on-demand usando el ancho del contenedor.
    return 0
  }, [])

  function scrollByPage(direction: -1 | 1) {
    const el = scrollerRef.current
    if (!el) return

    const amount = scrollAmount || Math.round(el.clientWidth * 0.85)
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  if (productos.length === 0) return null

  return (
    <div className="relative">
      {/* Botones (desktop) */}
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow hover:bg-white transition"
        aria-label="Desplazar productos hacia la izquierda"
      >
        <svg
          className="h-5 w-5 text-gray-900"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scrollByPage(1)}
        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow hover:bg-white transition"
        aria-label="Desplazar productos hacia la derecha"
      >
        <svg
          className="h-5 w-5 text-gray-900"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Carrusel (scroll horizontal + snap) */}
      <div
        ref={scrollerRef}
        className={[
          // evita que "crezca" la página: el overflow queda contenido aquí
          'flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth',
          // snap para que se sienta carrusel
          'snap-x snap-mandatory',
          // padding para que se vea bien en mobile (sin cortar sombra)
          '-mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0',
          // espacio para sombra inferior / scrollbar
          'pb-2',
        ].join(' ')}
      >
        {productos.map((producto) => (
          <div
            key={producto._id}
            className={[
              'snap-start shrink-0',
              // En desktop ocupan un cuarto del carrusel: se ven al menos 4 obras a la vez.
              'w-[36vw] sm:w-[260px] md:w-[280px] lg:w-[calc((100%-3rem)/4)]',
            ].join(' ')}
          >
            <ProductCard producto={producto} />
          </div>
        ))}
      </div>
    </div>
  )
}
