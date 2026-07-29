'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Testimonio } from '@/sanity/lib/types'

interface Props {
  testimonios: Testimonio[]
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-violet-500' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsCarousel({ testimonios }: Props) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = testimonios.length

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  useEffect(() => {
    if (paused || total <= 1) return
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [paused, next, total])

  if (total === 0) return null

  const visible = (): number[] => {
    if (total === 1) return [0]
    if (total === 2) return [0, 1]
    return [(current - 1 + total) % total, current, (current + 1) % total]
  }

  const visibleIndexes = visible()

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cards visible en desktop (3), mobile (1) */}
      <div className="relative">
        {/* Desktop: 3 cards */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-6">
          {visibleIndexes.map((idx, pos) => {
            const t = testimonios[idx]
            const isCenter = total >= 3 ? pos === 1 : pos === 0
            return (
              <div
                key={t._id}
                className={`rounded-2xl p-6 flex flex-col gap-4 transition-all duration-500 ${
                  isCenter
                    ? 'bg-white border border-violet-200 shadow-md scale-[1.02]'
                    : 'bg-white/60 border border-gray-100 opacity-75'
                }`}
              >
                <StarRating count={t.estrellas} />
                <p className="text-gray-600 text-sm leading-relaxed flex-1 text-center">
                  &ldquo;{t.texto}&rdquo;
                </p>
                <p className="text-sm font-semibold text-gray-900 text-center">{t.nombre}</p>
              </div>
            )
          })}
        </div>

        {/* Mobile: 1 card */}
        <div className="sm:hidden">
          <div className="bg-white border border-violet-200 shadow-md rounded-2xl p-6 flex flex-col gap-4 mx-4">
            <StarRating count={testimonios[current].estrellas} />
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              &ldquo;{testimonios[current].texto}&rdquo;
            </p>
            <p className="text-sm font-semibold text-gray-900 text-center">
              {testimonios[current].nombre}
            </p>
          </div>
        </div>

        {/* Flechas */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:text-violet-700 hover:border-violet-300 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:text-violet-700 hover:border-violet-300 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {total > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonios.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al testimonio ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? 'w-6 h-2 bg-violet-600' : 'w-2 h-2 bg-gray-300 hover:bg-violet-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
