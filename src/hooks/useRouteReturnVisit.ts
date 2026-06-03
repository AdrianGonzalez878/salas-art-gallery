'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * true si el usuario ya visitó esta ruta en la sesión y vuelve (atrás, Link, etc.).
 * Evita reiniciar animaciones desde opacity: 0 al regresar.
 */
export function useRouteReturnVisit() {
  const pathname = usePathname()
  const key = `route-visited:${pathname}`
  const [isReturnVisit] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(key) === '1'
  })

  useEffect(() => {
    return () => {
      sessionStorage.setItem(key, '1')
    }
  }, [key])

  return isReturnVisit
}
