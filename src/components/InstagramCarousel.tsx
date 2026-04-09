'use client'

import { useMemo, useRef } from 'react'
import Image from 'next/image'
import type { PostInstagram } from '@/sanity/lib/types'

interface InstagramCarouselProps {
  posts: PostInstagram[]
  imageUrls: string[] // URLs pre-generadas desde el servidor
}

export default function InstagramCarousel({ posts, imageUrls }: InstagramCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollAmount = useMemo(() => {
    return 0
  }, [])

  function scrollByPage(direction: -1 | 1) {
    const el = scrollerRef.current
    if (!el) return

    const amount = scrollAmount || Math.round(el.clientWidth * 0.85)
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  if (posts.length === 0) return null

  return (
    <div className="relative">
      {/* Botones (desktop) */}
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow hover:bg-white transition"
        aria-label="Desplazar posts hacia la izquierda"
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
        aria-label="Desplazar posts hacia la derecha"
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
          'flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth',
          'snap-x snap-mandatory',
          '-mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0',
          'pb-2',
        ].join(' ')}
      >
        {posts.map((post, index) => {
          const PostContent = (
            <div className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer">
              <Image
                src={imageUrls[index]}
                alt={post.imagen.alt || 'Instagram post'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 60vw, (max-width: 768px) 40vw, 280px"
              />
              
              {/* Overlay en Desktop - Solo hover (pantallas grandes) */}
              <div className="hidden lg:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center p-4">
                {/* Likes */}
                {post.likes !== undefined && post.likes !== null && (
                  <div className="flex items-center gap-2 text-white mb-2">
                    <svg
                      className="w-6 h-6 fill-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="font-semibold">{post.likes.toLocaleString()}</span>
                  </div>
                )}
                
                {/* Descripción */}
                {post.descripcion && (
                  <p className="text-white text-sm text-center line-clamp-3">
                    {post.descripcion}
                  </p>
                )}
              </div>

              {/* Overlay en Móvil - Siempre visible en la parte inferior (< lg) */}
              <div className="lg:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-8">
                {/* Likes */}
                {post.likes !== undefined && post.likes !== null && (
                  <div className="flex items-center gap-1.5 text-white mb-1.5">
                    <svg
                      className="w-4 h-4 fill-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="font-semibold text-sm">{post.likes.toLocaleString()}</span>
                  </div>
                )}
                
                {/* Descripción */}
                {post.descripcion && (
                  <p className="text-white text-xs line-clamp-2 leading-snug">
                    {post.descripcion}
                  </p>
                )}
              </div>
            </div>
          )

          // Si tiene enlace, envolver en <a>
          if (post.enlace) {
            return (
              <div
                key={post._id}
                className={[
                  'snap-start shrink-0',
                  'w-[60vw] xs:w-[56vw] sm:w-[260px] md:w-[280px] lg:w-[280px]',
                  'max-w-[320px]',
                ].join(' ')}
              >
                <a
                  href={post.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {PostContent}
                </a>
              </div>
            )
          }

          // Sin enlace, solo mostrar la imagen
          return (
            <div
              key={post._id}
              className={[
                'snap-start shrink-0',
                'w-[60vw] xs:w-[56vw] sm:w-[260px] md:w-[280px] lg:w-[280px]',
                'max-w-[320px]',
              ].join(' ')}
            >
              {PostContent}
            </div>
          )
        })}
      </div>
    </div>
  )
}
