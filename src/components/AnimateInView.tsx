'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type Ref } from 'react'
import { useTouchLikeDevice } from '@/hooks/useTouchLikeDevice'

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

/** false en SSR y en el primer paint del cliente; evita mismatches de hidratación */
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export default function AnimateInView({
  as = 'div',
  delay = 0,
  y = 24,
  className,
  children,
}: AnimateInViewProps) {
  const hasMounted = useHasMounted()
  const prefersReducedMotion = useReducedMotion()
  const isTouchLike = useTouchLikeDevice()
  const ref = useRef<HTMLElement>(null)

  const isInView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: '0px 0px -80px 0px',
  })

  const [safariFallback, setSafariFallback] = useState(false)

  useEffect(() => {
    if (!isTouchLike || prefersReducedMotion || isInView || safariFallback) return

    const tryFallback = () => {
      const el = ref.current
      if (!el || isInView) return
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
  }, [isTouchLike, prefersReducedMotion, isInView, safariFallback])

  const StaticTag = as

  // Mismo markup en servidor y primer paint del cliente.
  // Solo después de montar activamos motion / reduced-motion.
  if (!hasMounted || prefersReducedMotion) {
    return <StaticTag className={className}>{children}</StaticTag>
  }

  const MotionTag = motion[as]
  const useFallback = safariFallback
  const alreadyVisible = isInView || useFallback

  const transition = {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as const,
    delay: useFallback ? 0 : delay,
  }

  return (
    <MotionTag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      initial={alreadyVisible ? false : { opacity: 0, y }}
      whileInView={useFallback ? undefined : { opacity: 1, y: 0, transition }}
      animate={useFallback ? { opacity: 1, y: 0, transition } : undefined}
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </MotionTag>
  )
}
