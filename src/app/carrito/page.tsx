import { sanityFetch } from '@/lib/sanity'
import { productosDestacadosQuery } from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'
import CarritoContent from '@/components/CarritoContent'
import MSIStaticBanner from '@/components/MSIStaticBanner'
import TestimonialsSection from '@/components/TestimonialsSection'

export default async function CarritoPage() {
  const productosDestacados = await sanityFetch<Producto[]>(productosDestacadosQuery)
  const list = productosDestacados.slice(0, 5)

  return (
    <>
      <div className="w-full">
        <MSIStaticBanner />
      </div>
      <CarritoContent productosDestacados={list} />
      <TestimonialsSection />
    </>
  )
}
