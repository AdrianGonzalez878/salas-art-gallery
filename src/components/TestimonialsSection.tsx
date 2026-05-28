import AnimateInView from '@/components/AnimateInView'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { sanityFetch } from '@/lib/sanity'
import { testimoniosActivosQuery } from '@/sanity/lib/queries'
import type { Testimonio } from '@/sanity/lib/types'

export default async function TestimonialsSection() {
  const testimonios = await sanityFetch<Testimonio[]>(testimoniosActivosQuery)

  if (!testimonios || testimonios.length === 0) return null

  return (
    <AnimateInView as="section" className="py-14 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-10 lg:px-16">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Lo que dicen nuestras clientas
            </span>
            <div className="w-8 h-0.5 bg-amber-400" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Testimonios
          </h2>
        </div>

        <TestimonialsCarousel testimonios={testimonios} />
      </div>
    </AnimateInView>
  )
}
