import AnimateInView from '@/components/AnimateInView'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { sanityFetch } from '@/lib/sanity'
import { testimoniosActivosQuery } from '@/sanity/lib/queries'
import type { Testimonio } from '@/sanity/lib/types'

export default async function TestimonialsSection() {
  const testimonios = await sanityFetch<Testimonio[]>(testimoniosActivosQuery)

  if (!testimonios || testimonios.length === 0) return null

  return (
    <AnimateInView as="section" className="py-14 md:py-20 bg-[#f7f6f8] border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-10 lg:px-16">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-violet-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
              Experiencias en la galería
            </span>
            <div className="w-8 h-px bg-violet-500" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-light text-gray-900">
            Voces que acompañan a Salas
          </h2>
        </div>

        <TestimonialsCarousel testimonios={testimonios} />
      </div>
    </AnimateInView>
  )
}
