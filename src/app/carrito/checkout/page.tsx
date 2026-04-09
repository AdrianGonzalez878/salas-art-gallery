import { Suspense } from 'react'
import CheckoutClient from './CheckoutClient'

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <p className="text-gray-600 text-sm">Cargando checkout…</p>
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  )
}
