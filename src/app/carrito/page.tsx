import { client } from '@/lib/sanity'
import { productosMasVendidosQuery } from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'
import CarritoContent from '@/components/CarritoContent'
import MSIStaticBanner from '@/components/MSIStaticBanner'

export default async function CarritoPage() {
  const productosMasVendidos = await client.fetch<Producto[]>(productosMasVendidosQuery)
  const list = productosMasVendidos.slice(0, 8)

  return (
    <>
      <div className="w-full">
        <MSIStaticBanner />
      </div>
      <CarritoContent productosMasVendidos={list} />
    </>
  )
}
