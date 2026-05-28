'use client'

import { useEffect, useRef } from 'react'
import { trackViewContent } from '@/lib/marketingPixels'

interface ProductViewTrackerProps {
  id: string
  name: string
  price: number
}

export default function ProductViewTracker({ id, name, price }: ProductViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    trackViewContent({ id, name, price })
  }, [id, name, price])

  return null
}
