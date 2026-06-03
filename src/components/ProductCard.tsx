'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { Producto } from '@/sanity/lib/types'
import { descuentoVigente, calcularPrecioFinal } from '@/lib/descuento'
import { useTouchLikeDevice } from '@/hooks/useTouchLikeDevice'

const INTERVAL = 1500
const SWIPE_THRESHOLD = 48

interface ProductCardProps {
  producto: Producto
}

export default function ProductCard({ producto }: ProductCardProps) {
  const isTouchLike = useTouchLikeDevice()
  const [isHovering, setIsHovering] = useState(false)
  const [imagenActual, setImagenActual] = useState(0)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const didSwipeRef = useRef(false)
  const isHorizontalSwipeRef = useRef(false)

  const imagenes = useMemo(() => {
    const urls: string[] = []
    if (producto.imagenPrincipal) {
      urls.push(urlFor(producto.imagenPrincipal).width(600).quality(90).url())
    }
    if (producto.galeria && producto.galeria.length > 0) {
      producto.galeria.forEach((img) => {
        urls.push(urlFor(img).width(600).quality(90).url())
      })
    }
    if (urls.length === 0) urls.push('/placeholder.jpg')
    return urls
  }, [producto.imagenPrincipal, producto.galeria])

  const vigente = descuentoVigente(
    producto.tieneDescuento,
    producto.fechaInicioDescuento,
    producto.fechaFinDescuento,
  )
  const precioFinal = calcularPrecioFinal(
    producto.precio,
    producto.tieneDescuento,
    producto.tipoDescuento,
    producto.valorDescuento,
    producto.fechaInicioDescuento,
    producto.fechaFinDescuento,
  )
  const descuentoLabel = vigente && producto.tipoDescuento && producto.valorDescuento
    ? (() => {
        const auto = producto.tipoDescuento === 'porcentaje'
          ? `${producto.valorDescuento}% OFF`
          : `$${producto.valorDescuento} OFF`
        return producto.textoBadge?.trim() ? `${producto.textoBadge.trim()} · ${auto}` : auto
      })()
    : null

  const tieneVarias = imagenes.length > 1

  const goToPrev = useCallback(() => {
    setImagenActual((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }, [imagenes.length])

  const goToNext = useCallback(() => {
    setImagenActual((prev) => (prev + 1) % imagenes.length)
  }, [imagenes.length])

  // Desktop: avance automático al hacer hover
  useEffect(() => {
    if (isTouchLike || !tieneVarias) return

    if (!isHovering) {
      setImagenActual(0)
      setProgress(0)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      startRef.current = null
      return
    }

    setProgress(0)
    startRef.current = null

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const pct = Math.min(elapsed / INTERVAL, 1)
      setProgress(pct)

      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setImagenActual((prev) => (prev + 1) % imagenes.length)
        setProgress(0)
        startRef.current = null
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isHovering, isTouchLike, tieneVarias, imagenes.length])

  // Móvil: deslizar en la imagen para cambiar foto (sin disparar el enlace)
  useEffect(() => {
    const el = imageAreaRef.current
    if (!el || !isTouchLike || !tieneVarias) return

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      touchStartRef.current = { x: t.clientX, y: t.clientY }
      didSwipeRef.current = false
      isHorizontalSwipeRef.current = false
    }

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      const dx = t.clientX - touchStartRef.current.x
      const dy = t.clientY - touchStartRef.current.y
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        isHorizontalSwipeRef.current = true
        e.preventDefault()
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!isHorizontalSwipeRef.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStartRef.current.x
      const dy = t.clientY - touchStartRef.current.y
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return

      didSwipeRef.current = true
      if (dx < 0) goToNext()
      else goToPrev()
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [isTouchLike, tieneVarias, goToNext, goToPrev])

  const handleLinkClick = (e: React.MouseEvent) => {
    if (didSwipeRef.current) {
      e.preventDefault()
      didSwipeRef.current = false
    }
  }

  return (
    <Link
      href={`/productos/${producto.slug.current}`}
      onMouseEnter={() => !isTouchLike && setIsHovering(true)}
      onMouseLeave={() => !isTouchLike && setIsHovering(false)}
      onClick={handleLinkClick}
      className="group flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div
        ref={imageAreaRef}
        className="relative aspect-[3/4] overflow-hidden bg-gray-50 shrink-0 touch-pan-y"
        aria-label={
          tieneVarias && isTouchLike
            ? `${producto.titulo}, desliza para ver más fotos`
            : undefined
        }
      >
        {imagenes.map((url, idx) => {
          const visible = idx === imagenActual
          return (
            <Image
              key={url}
              src={url}
              alt={producto.imagenPrincipal?.alt || producto.titulo}
              fill
              className={`object-cover transition-opacity duration-500 md:group-hover:scale-105 ${
                visible ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={idx === 0}
              draggable={false}
            />
          )
        })}

        {descuentoLabel && (
          <div className="absolute top-2.5 left-2.5 bg-amber-400 text-gray-900 px-2.5 py-1 rounded-lg font-bold text-xs shadow-sm z-10">
            {descuentoLabel}
          </div>
        )}

        {/* Indicadores móvil (tap/swipe manual) */}
        {tieneVarias && isTouchLike && (
          <div
            className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 px-2 pb-2 z-20 pointer-events-none"
            aria-hidden
          >
            {imagenes.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === imagenActual ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Barras de progreso (desktop hover, auto) */}
        {tieneVarias && !isTouchLike && (
          <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 px-1.5 pb-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            {imagenes.map((_, idx) => (
              <div key={idx} className="flex-1 h-[3px] rounded-full bg-black/20 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-none rounded-full"
                  style={{
                    width:
                      idx < imagenActual
                        ? '100%'
                        : idx === imagenActual
                          ? `${progress * 100}%`
                          : '0%',
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <p className="text-[11px] text-gray-400 capitalize mb-1">{producto.categoria}</p>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-auto line-clamp-2 group-hover:text-amber-700 transition-colors leading-snug">
          {producto.titulo}
        </h3>

        <div className="flex items-end justify-between gap-2 mt-3">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {vigente ? (
              <>
                <span className="text-base text-gray-800 line-through leading-none">
                  ${producto.precio.toLocaleString()}
                </span>
                <span className="text-base font-semibold text-amber-600 leading-none">
                  ${Math.round(precioFinal).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-base font-medium text-gray-800 leading-none">
                ${producto.precio.toLocaleString()}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0 group-hover:bg-amber-400 group-hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
