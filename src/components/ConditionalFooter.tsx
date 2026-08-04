'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

interface ConditionalFooterProps {
  whatsappUrl: string
  whatsappDisplay: string
  phoneTelUrl: string
}

export default function ConditionalFooter({
  whatsappUrl,
  whatsappDisplay,
  phoneTelUrl,
}: ConditionalFooterProps) {
  const pathname = usePathname()

  // No mostrar Footer en el studio ni en checkout
  if (pathname?.startsWith('/studio') || pathname?.startsWith('/carrito/checkout')) {
    return null
  }

  return (
    <Footer
      whatsappUrl={whatsappUrl}
      whatsappDisplay={whatsappDisplay}
      phoneTelUrl={phoneTelUrl}
    />
  )
}
