'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import { useTouchLikeDevice } from '@/hooks/useTouchLikeDevice'
import { useRouteReturnVisit } from '@/hooks/useRouteReturnVisit'

type AnimateTag = 'div' | 'section' | 'article'

interface AnimateInViewProps {
  as?: AnimateTag
  delay?: number
  y?: number
  className?: string
  children: ReactNode
}

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
  const isReturnVisit = useRouteReturnVisit()
  const ref = useRef<HTMLElement>(null)

  // 2ª opción (solo táctil, 1ª visita): Safari a veces no dispara whileInView
  const [safariFallback, setSafariFallback] = useState(false)

  useEffect(() => {
    if (!isTouchLike || prefersReducedMotion || isReturnVisit || safariFallback) return

    const tryFallback = () => {
      const el = ref.current
      if (!el) return
      if (isElementInViewport(el)) {
        setSafariFallback(true)
      }
    }

    tryFallback()
    let innerRaf = 0
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(tryFallback)
    })
    const t1 = setTimeout(tryFallback, 50)
    const t2 = setTimeout(tryFallback, 200)

    return () => {
      cancelAnimationFrame(outerRaf)
      if (innerRaf) cancelAnimationFrame(innerRaf)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isTouchLike, prefersReducedMotion, isReturnVisit, safariFallback])

  const StaticTag = as

  if (prefersReducedMotion) {
    return <StaticTag className={className}>{children}</StaticTag>
  }

  const MotionTag = motion[as]
  const showImmediately = isReturnVisit || safariFallback

  const transition = {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as const,
    delay: showImmediately ? 0 : delay,
  }

  return (
    <MotionTag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      initial={showImmediately ? false : { opacity: 0, y }}
      whileInView={
        showImmediately ? undefined : { opacity: 1, y: 0, transition }
      }
      animate={
        showImmediately ? { opacity: 1, y: 0, transition } : undefined
      }
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
    >
      {children}
    </MotionTag>
  )
}
