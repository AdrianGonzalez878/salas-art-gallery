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
  /** Desktop: ruta en /public, ej. /videos/hero.mp4 */
  videoSrc?: string | null
  /** Móvil: ruta en /public, ej. /videos/hero-vertical.mp4 */
  videoSrcMobile?: string | null
}

export default function HeroCarousel({ imagenes, videoSrc, videoSrcMobile }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (imagenes.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenes.length)
    }, 6000) // Cambiar cada 6 segundos

    return () => clearInterval(interval)
  }, [imagenes.length])

  const posterDesktop = imagenes?.[0]?.urlDesktop
  const posterMobile = imagenes?.[0]?.urlMobile ?? posterDesktop
  const desktopVideo = videoSrc?.trim() || null
  const mobileVideo = videoSrcMobile?.trim() || desktopVideo
  const hasVideo = Boolean(desktopVideo || mobileVideo)
  const hasImages = imagenes && imagenes.length > 0
  const [videoIntroDone, setVideoIntroDone] = useState(!hasVideo)

  useEffect(() => {
    if (!hasVideo) {
      setVideoIntroDone(true)
      return
    }
    setVideoIntroDone(false)
    const timer = setTimeout(() => setVideoIntroDone(true), 2500)
    return () => clearTimeout(timer)
  }, [hasVideo, desktopVideo, mobileVideo])

  if (!hasVideo && !hasImages) return null

  return (
    <div className="absolute inset-0 z-0">
      {hasVideo ? (
        <>
          {desktopVideo ? (
            <video
              className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterDesktop}
              aria-hidden
            >
              <source src={desktopVideo} type="video/mp4" />
            </video>
          ) : null}
          {mobileVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterMobile}
              aria-hidden
            >
              <source src={mobileVideo} type="video/mp4" />
            </video>
          ) : null}
        </>
      ) : null}

      {!hasVideo && hasImages ? imagenes.map((imagen, index) => {
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
      }) : null}
      
      {/* Overlay: más claro al inicio del video para que se vea el logo */}
      <div
        className={`absolute inset-0 z-10 transition-all duration-700 ${
          hasVideo && !videoIntroDone
            ? 'bg-black/10'
            : 'bg-gradient-to-b from-black/40 via-black/30 to-black/50'
        }`}
      />
      
      {/* Indicadores de página (dots) */}
      {!hasVideo && imagenes.length > 1 && (
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
