'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()

  // No mostrar Footer en el studio ni en checkout
  if (pathname?.startsWith('/studio') || pathname?.startsWith('/carrito/checkout')) {
    return null
  }

  return <Footer />
}
