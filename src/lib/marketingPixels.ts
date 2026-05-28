export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ''
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? ''

export const CURRENCY = 'MXN'

export interface ProductEventData {
  id: string
  name: string
  price: number
  quantity?: number
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    ttq?: {
      track: (event: string, data?: Record<string, unknown>) => void
      page: () => void
    }
  }
}

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function shouldTrack(pathname?: string): boolean {
  if (!pathname) return true
  return !pathname.startsWith('/admin') && !pathname.startsWith('/studio')
}

export function trackPageView(pathname?: string): void {
  if (!isBrowser() || !shouldTrack(pathname)) return

  if (META_PIXEL_ID && window.fbq) {
    window.fbq('track', 'PageView')
  }

  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.page()
  }
}

export function trackViewContent(product: ProductEventData): void {
  if (!isBrowser()) return

  const value = product.price * (product.quantity ?? 1)

  if (META_PIXEL_ID && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value,
      currency: CURRENCY,
    })
  }

  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.track('ViewContent', {
      content_id: product.id,
      content_name: product.name,
      content_type: 'product',
      value,
      currency: CURRENCY,
    })
  }
}

export function trackAddToCart(product: ProductEventData): void {
  if (!isBrowser()) return

  const quantity = product.quantity ?? 1
  const value = product.price * quantity

  if (META_PIXEL_ID && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value,
      currency: CURRENCY,
      contents: [{ id: product.id, quantity }],
    })
  }

  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.track('AddToCart', {
      content_id: product.id,
      content_name: product.name,
      content_type: 'product',
      value,
      currency: CURRENCY,
      quantity,
    })
  }
}

export function trackInitiateCheckout(params: {
  value: number
  items: ProductEventData[]
}): void {
  if (!isBrowser()) return

  const contentIds = params.items.map((i) => i.id)
  const numItems = params.items.reduce((acc, i) => acc + (i.quantity ?? 1), 0)

  if (META_PIXEL_ID && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      value: params.value,
      currency: CURRENCY,
      num_items: numItems,
    })
  }

  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.track('InitiateCheckout', {
      content_id: contentIds.join(','),
      value: params.value,
      currency: CURRENCY,
      quantity: numItems,
    })
  }
}

export function trackPurchase(params: {
  value: number
  orderId?: string
  items: ProductEventData[]
}): void {
  if (!isBrowser()) return

  const contentIds = params.items.map((i) => i.id)
  const numItems = params.items.reduce((acc, i) => acc + (i.quantity ?? 1), 0)

  if (META_PIXEL_ID && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_ids: contentIds,
      value: params.value,
      currency: CURRENCY,
      num_items: numItems,
      ...(params.orderId && { order_id: params.orderId }),
    })
  }

  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.track('CompletePayment', {
      content_id: contentIds.join(','),
      value: params.value,
      currency: CURRENCY,
      quantity: numItems,
      ...(params.orderId && { order_id: params.orderId }),
    })
  }
}
