'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
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
  const vh = window.innerHeight || document.documentElement.clientHeight
  return rect.top < vh * 0.98 && rect.bottom > vh * 0.02
}

function sessionKey(pathname: string) {
  return `conchita-anim-seen:${pathname}`
}

export default function AnimateInView({
  as = 'div',
  delay = 0,
  y = 24,
  className,
  children,
}: AnimateInViewProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const isTouchLike = useTouchLikeDevice()
  const ref = useRef<HTMLElement>(null)
  const revealedRef = useRef(false)

  const [skipAnimation, setSkipAnimation] = useState(false)
  const [fallbackShow, setFallbackShow] = useState(false)

  const isInView = useInView(ref, {
    once: true,
    amount: isTouchLike ? 0.05 : 0.12,
    margin: isTouchLike ? '0px' : '0px 0px -40px 0px',
  })

  const markRevealed = useCallback(() => {
    if (revealedRef.current) return
    revealedRef.current = true
    setFallbackShow(true)
  }, [])

  // Al volver atrás en la misma sesión: sin re-animar (evita sensación de “refresh”)
  useLayoutEffect(() => {
    if (!isTouchLike || typeof window === 'undefined') return
    try {
      if (sessionStorage.getItem(sessionKey(pathname))) {
        revealedRef.current = true
        setSkipAnimation(true)
        setFallbackShow(true)
      }
    } catch {
      /* sessionStorage bloqueado */
    }
  }, [pathname, isTouchLike])

  useEffect(() => {
    if (isInView) markRevealed()
  }, [isInView, markRevealed])

  useEffect(() => {
    if (!isInView && !fallbackShow) return
    if (!isTouchLike || typeof window === 'undefined') return
    try {
      sessionStorage.setItem(sessionKey(pathname), '1')
    } catch {
      /* ignore */
    }
  }, [isInView, fallbackShow, isTouchLike, pathname])

  // Móvil: fallback en mount, scroll e IntersectionObserver (Safari no dispara useInView)
  useEffect(() => {
    if (!isTouchLike || prefersReducedMotion || skipAnimation) return

    const el = ref.current
    if (!el) return

    const tryReveal = () => {
      if (revealedRef.current || isInView) return
      if (isElementInViewport(el)) markRevealed()
    }

    tryReveal()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            markRevealed()
            observer.disconnect()
            return
          }
        }
      },
      { threshold: [0, 0.05, 0.1, 0.2], rootMargin: '0px' },
    )
    observer.observe(el)

    let scrollPending = false
    const onScroll = () => {
      if (scrollPending || revealedRef.current) return
      scrollPending = true
      requestAnimationFrame(() => {
        scrollPending = false
        tryReveal()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', tryReveal, { passive: true })

    const t1 = setTimeout(tryReveal, 80)
    const t2 = setTimeout(tryReveal, 300)
    const t3 = setTimeout(tryReveal, 700)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', tryReveal)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [
    isTouchLike,
    prefersReducedMotion,
    skipAnimation,
    isInView,
    markRevealed,
  ])

  const StaticTag = as

  if (prefersReducedMotion) {
    return <StaticTag className={className}>{children}</StaticTag>
  }

  const MotionTag = motion[as]
  const shouldShow = skipAnimation || isInView || fallbackShow

  // Móvil: nunca opacity 0 (Safari dejaba el bloque invisible)
  const hiddenState = isTouchLike ? { opacity: 1, y } : { opacity: 0, y }
  const visibleState = { opacity: 1, y: 0 }

  return (
    <MotionTag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      initial={skipAnimation ? false : hiddenState}
      animate={shouldShow ? visibleState : hiddenState}
      transition={{
        duration: skipAnimation ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: shouldShow && !skipAnimation ? delay : 0,
      }}
    >
      {children}
    </MotionTag>
  )
}
