'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { trackAddToCart } from '@/lib/marketingPixels'

export interface AddToCartButtonProps {
  id: string
  slug: string
  title: string
  price: number
  imageUrl?: string
  quantity?: number
  className?: string
  variant?: 'primary' | 'secondary' | 'icon'
  stopPropagation?: boolean
  children?: React.ReactNode
}

export default function AddToCartButton({
  id,
  slug,
  title,
  price,
  imageUrl,
  quantity = 1,
  className = '',
  variant = 'primary',
  stopPropagation = false,
  children,
}: AddToCartButtonProps) {
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  const isInCart = items.some((i) => i.id === id)

  const handleClick = (e: React.MouseEvent) => {
    if (isInCart) return
    if (stopPropagation) {
      e.preventDefault()
      e.stopPropagation()
    }
    addItem({ id, slug, title, price, imageUrl, quantity })
    trackAddToCart({ id, name: title, price, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const baseClass = 'font-semibold transition-colors inline-flex items-center justify-center gap-2'
  const variants = {
    primary: 'bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800',
    secondary: 'border-2 border-gray-900 text-gray-900 py-3 px-6 rounded-xl hover:bg-gray-900 hover:text-white',
    icon: 'p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100',
  }
  const disabledClass = 'opacity-70 cursor-not-allowed'

  const disabled = added || isInCart
  const label = added ? 'Añadido' : isInCart ? 'Ya añadido al carrito' : (children ?? 'Agregar al carrito')

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClass} ${variants[variant]} ${disabled ? disabledClass : 'cursor-pointer'} ${className}`}
      disabled={disabled}
      aria-label={isInCart ? 'Ya en el carrito' : added ? 'Añadido al carrito' : 'Agregar al carrito'}
    >
      {variant === 'icon' && !disabled && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )}
      {label}
    </button>
  )
}
