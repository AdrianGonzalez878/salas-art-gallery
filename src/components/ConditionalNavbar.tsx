'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import WhatsAppButton from './WhatsAppButton'

interface ConditionalNavbarProps {
  whatsappUrl: string
}

export default function ConditionalNavbar({ whatsappUrl }: ConditionalNavbarProps) {
  const pathname = usePathname()

  // No mostrar nada en el studio
  if (pathname?.startsWith('/studio')) {
    return null
  }

  // En checkout: solo el botón de WhatsApp, sin navbar
  if (pathname?.startsWith('/carrito/checkout')) {
    return <WhatsAppButton whatsappUrl={whatsappUrl} />
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton whatsappUrl={whatsappUrl} />
    </>
  )
}