'use client'

import { useState } from 'react'

export default function ProductFlexiblePayments() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <h2 className="text-lg font-semibold text-gray-900">Pagos flexibles</h2>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 leading-relaxed">
          <p className="flex items-start gap-2">
            <span className="text-blue-500 shrink-0 mt-0.5" aria-hidden>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </span>
            <span>
              <strong>Hasta 3 meses sin intereses (MSI)</strong> cuando el total de tu compra sea de{' '}
              <strong>$5,000 MXN</strong> o más, pagando con <strong>tarjeta de crédito</strong> a través de
              Mercado Pago. Aplica según tu tarjeta y las condiciones del banco y de Mercado Pago.
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
