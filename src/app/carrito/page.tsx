import { sanityFetch } from '@/lib/sanity'
import { productosMasVendidosQuery } from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'
import CarritoContent from '@/components/CarritoContent'
import MSIStaticBanner from '@/components/MSIStaticBanner'
import TestimonialsSection from '@/components/TestimonialsSection'

export default async function CarritoPage() {
  const productosMasVendidos = await sanityFetch<Producto[]>(productosMasVendidosQuery)
  const list = productosMasVendidos.slice(0, 8)

  return (
    <>
      <div className="w-full">
        <MSIStaticBanner />
      </div>
      <CarritoContent productosMasVendidos={list} />
      <TestimonialsSection />
    </>
  )
}
