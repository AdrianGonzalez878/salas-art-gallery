'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function GraciasContent() {
  const searchParams = useSearchParams()
  const numeroPedido = searchParams.get('pedido') || ''
  const isPending = searchParams.get('estado') === 'pending'

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="rounded-2xl bg-white p-8 sm:p-12 shadow-sm border border-gray-100">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${isPending ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isPending ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              )}
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isPending ? 'Pago pendiente' : '¡Pedido recibido!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isPending
              ? 'Tu pedido está registrado. Cuando recibamos la confirmación del pago (OXXO, transferencia, etc.), te contactaremos para el envío.'
              : 'Gracias por tu compra. Te contactaremos pronto para confirmar el envío.'}
          </p>
          {numeroPedido && (
            <p className="text-sm font-medium text-gray-700 mb-2">Número de pedido</p>
          )}
          {numeroPedido && (
            <p className="text-lg font-mono font-semibold text-gray-900 mb-8 bg-gray-100 px-4 py-2 rounded-lg inline-block">
              {numeroPedido}
            </p>
          )}
          <Link
            href="/productos"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function GraciasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      }
    >
      <GraciasContent />
    </Suspense>
  )
}
