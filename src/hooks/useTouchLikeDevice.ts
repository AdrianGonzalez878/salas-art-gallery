'use client'

import { useSyncExternalStore } from 'react'

/** iPhone, Android, iPad en layout móvil (alineado con breakpoint lg del sitio). */
const QUERY = '(hover: none), (pointer: coarse), (max-width: 1023px)'

function getMediaQuery() {
  return window.matchMedia(QUERY)
}

function subscribe(callback: () => void) {
  const mq = getMediaQuery()
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSnapshot() {
  return getMediaQuery().matches
}

function getServerSnapshot() {
  return false
}

/** Móvil / tablet táctil (sin hover fino con mouse). */
export function useTouchLikeDevice() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
