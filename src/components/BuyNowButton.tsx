'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export interface BuyNowButtonProps {
  id: string
  slug: string
  title: string
  price: number
  imageUrl?: string
  quantity?: number
  className?: string
}

export default function BuyNowButton({
  id,
  slug,
  title,
  price,
  imageUrl,
  quantity = 1,
  className = '',
}: BuyNowButtonProps) {
  const router = useRouter()
  const { addItem } = useCart()

  const handleClick = () => {
    addItem({ id, slug, title, price, imageUrl, quantity })
    router.push('/carrito/checkout')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex-1 inline-flex items-center justify-center bg-yellow-400 text-black py-3 px-6 rounded-xl font-semibold hover:bg-yellow-500 transition-colors ${className} cursor-pointer`}
    >
      Comprar ahora
    </button>
  )
}
