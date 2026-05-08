'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import WhatsAppButton from './WhatsAppButton'

export default function ConditionalNavbar() {
  const pathname = usePathname()

  // No mostrar nada en el studio
  if (pathname?.startsWith('/studio')) {
    return null
  }

  // En checkout: solo el botón de WhatsApp, sin navbar
  if (pathname?.startsWith('/carrito/checkout')) {
    return <WhatsAppButton />
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton />
    </>
  )
}