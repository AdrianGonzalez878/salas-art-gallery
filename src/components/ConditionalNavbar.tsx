'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // No mostrar Navbar en el studio ni en checkout
  if (pathname?.startsWith('/studio') || pathname?.startsWith('/carrito/checkout')) {
    return null
  }
  
  return <Navbar />
}