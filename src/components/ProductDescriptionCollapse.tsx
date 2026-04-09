'use client'

import { useState } from 'react'

interface ProductDescriptionCollapseProps {
  descripcion: string
}

export default function ProductDescriptionCollapse({ descripcion }: ProductDescriptionCollapseProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <h2 className="text-lg font-semibold text-gray-900">Descripción</h2>
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
        <p className="mt-3 text-gray-600 leading-relaxed">
          {descripcion}
        </p>
      )}
    </div>
  )
}
