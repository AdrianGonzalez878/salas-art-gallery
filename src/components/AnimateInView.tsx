'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import { useTouchLikeDevice } from '@/hooks/useTouchLikeDevice'

type AnimateTag = 'div' | 'section' | 'article'

interface AnimateInViewProps {
  as?: AnimateTag
  delay?: number
  y?: number
  className?: string
  children: ReactNode
}

/** Comprueba si el elemento ya es visible en pantalla (fallback Safari iOS). */
function isElementInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0
}

export default function AnimateInView({
  as = 'div',
  delay = 0,
  y = 24,
  className,
  children,
}: AnimateInViewProps) {
  const prefersReducedMotion = useReducedMotion()
  const isTouchLike = useTouchLikeDevice()
  const ref = useRef<HTMLElement>(null)

  // 1ª opción (todas las pantallas): animación al entrar en viewport
  const isInView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: '0px 0px -40px 0px',
  })

  // 2ª opción (solo móvil/tablet táctil): si Safari no disparó useInView
  const [fallbackShow, setFallbackShow] = useState(false)

  useEffect(() => {
    if (!isTouchLike || prefersReducedMotion || isInView) return

    const tryFallback = () => {
      const el = ref.current
      if (!el || isInView) return
      if (isElementInViewport(el)) {
        setFallbackShow(true)
      }
    }

    tryFallback()
    let innerRaf = 0
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(tryFallback)
    })
    const t1 = setTimeout(tryFallback, 50)
    const t2 = setTimeout(tryFallback, 150)

    return () => {
      cancelAnimationFrame(outerRaf)
      if (innerRaf) cancelAnimationFrame(innerRaf)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isTouchLike, prefersReducedMotion, isInView])

  const StaticTag = as

  if (prefersReducedMotion) {
    return <StaticTag className={className}>{children}</StaticTag>
  }

  const MotionTag = motion[as]
  const shouldShow = isInView || (isTouchLike && fallbackShow)

  return (
    <MotionTag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: shouldShow ? delay : 0,
      }}
    >
      {children}
    </MotionTag>
  )
}
