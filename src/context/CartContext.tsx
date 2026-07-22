'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const CART_STORAGE_KEY = 'salas-cart'

export interface CartItem {
  id: string
  slug: string
  title: string
  price: number
  imageUrl?: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(loadFromStorage())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    saveToStorage(items)
  }, [mounted, items])

  const addItem = useCallback(
    (input: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === input.id)
        // Piezas únicas: máximo 1 por producto.
        // Si ya está pero cambió precio o título (ej. cliente eligió complemento), actualizar.
        if (existing) {
          const cambio =
            existing.price !== input.price || existing.title !== input.title
          if (!cambio) return prev
          return prev.map((i) =>
            i.id === input.id
              ? { ...i, price: input.price, title: input.title, imageUrl: input.imageUrl }
              : i
          )
        }
        return [
          ...prev,
          {
            id: input.id,
            slug: input.slug,
            title: input.title,
            price: input.price,
            imageUrl: input.imageUrl,
            quantity: 1,
          },
        ]
      })
    },
    []
  )

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.id !== productId))
      return
    }
    // Piezas únicas: máximo 1 por producto
    const capped = Math.min(1, quantity)
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity: capped } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items]
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
