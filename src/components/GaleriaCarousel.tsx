'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GaleriaCarouselProps {
  imagenes: { url: string; alt: string }[]
}

export default function GaleriaCarousel({ imagenes }: GaleriaCarouselProps) {
  const [actual, setActual] = useState(0)

  if (!imagenes || imagenes.length === 0) return null

  const anterior = () => setActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
  const siguiente = () => setActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))

  return (
    <div className="order-2 space-y-3">
      {/* Imagen principal */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <Image
          key={actual}
          src={imagenes[actual].url}
          alt={imagenes[actual].alt}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Badge decorativo */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-sm">
          <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Conchita Plata</p>
          <p className="text-[11px] text-gray-500">Joyería artesanal en plata</p>
        </div>

        {/* Flechas de navegación */}
        {imagenes.length > 1 && (
          <>
            <button
              onClick={anterior}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center transition cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={siguiente}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center transition cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActual(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                idx === actual ? 'border-amber-400 shadow-md' : 'border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicador numérico */}
      {imagenes.length > 1 && (
        <p className="text-xs text-gray-400 text-center">
          {actual + 1} / {imagenes.length}
        </p>
      )}
    </div>
  )
}
