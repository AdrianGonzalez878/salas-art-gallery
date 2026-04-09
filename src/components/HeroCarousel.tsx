'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImagenCarrusel {
  urlDesktop: string
  urlMobile: string
  alt: string
}

interface HeroCarouselProps {
  imagenes: ImagenCarrusel[]
}

export default function HeroCarousel({ imagenes }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (imagenes.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenes.length)
    }, 6000) // Cambiar cada 6 segundos

    return () => clearInterval(interval)
  }, [imagenes.length])

  if (!imagenes || imagenes.length === 0) return null

  return (
    <div className="absolute inset-0 z-0">
      {imagenes.map((imagen, index) => {
        const isActive = index === currentIndex
        
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Imagen Desktop - visible en md (768px) y arriba */}
            <Image
              src={imagen.urlDesktop}
              alt={imagen.alt}
              fill
              className="object-cover object-center animate-kenburns hidden md:block"
              priority={index === 0}
              quality={95}
              sizes="100vw"
            />
            
            {/* Imagen Móvil - visible solo en pantallas pequeñas */}
            <Image
              src={imagen.urlMobile}
              alt={imagen.alt}
              fill
              className="object-cover object-center animate-kenburns md:hidden"
              priority={index === 0}
              quality={95}
              sizes="100vw"
            />
          </div>
        )
      })}
      
      {/* Overlay oscuro para legibilidad con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />
      
      {/* Indicadores de página (dots) */}
      {imagenes.length > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {imagenes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
