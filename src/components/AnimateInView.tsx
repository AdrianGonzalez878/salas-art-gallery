'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react'

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
  const ref = useRef<HTMLElement>(null)

  // 1ª opción: animación normal al entrar en viewport
  const isInView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: '0px 0px -40px 0px',
  })

  // 2ª opción: solo si Safari no disparó useInView pero el elemento ya está visible
  const [fallbackShow, setFallbackShow] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || isInView) return

    const tryFallback = () => {
      const el = ref.current
      if (!el || isInView) return
      if (isElementInViewport(el)) {
        setFallbackShow(true)
      }
    }

    const timer = setTimeout(tryFallback, 350)
    window.addEventListener('load', tryFallback, { once: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', tryFallback)
    }
  }, [prefersReducedMotion, isInView])

  const StaticTag = as

  if (prefersReducedMotion) {
    return <StaticTag className={className}>{children}</StaticTag>
  }

  const MotionTag = motion[as]
  const shouldShow = isInView || fallbackShow

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
