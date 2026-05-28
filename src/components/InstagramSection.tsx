import AnimateInView from '@/components/AnimateInView'
import InstagramCarousel from './InstagramCarousel'
import type { PostInstagram } from '@/sanity/lib/types'

interface InstagramSectionProps {
  posts: PostInstagram[]
  imageUrls: string[]
}

export default function InstagramSection({ posts, imageUrls }: InstagramSectionProps) {
  if (!posts || posts.length === 0) return null

  const igIcon = (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )

  return (
    <AnimateInView as="section" className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">Síguenos</span>
            <div className="w-8 h-0.5 bg-amber-400" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Instagram</h2>
          <p className="text-gray-500 max-w-md text-sm sm:text-base mb-4">
            Descubre nuestras últimas creaciones y el día a día de Conchita Plata
          </p>
          <a
            href="https://www.instagram.com/conchitaplata.925"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
          >
            {igIcon}
            @conchitaplata.925
          </a>
        </div>

        <InstagramCarousel posts={posts} imageUrls={imageUrls} />

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/conchitaplata.925"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
          >
            {igIcon}
            Seguir en Instagram
          </a>
        </div>
      </div>
    </AnimateInView>
  )
}
