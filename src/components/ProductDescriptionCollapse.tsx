'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@/sanity/lib/types'

interface ProductDescriptionCollapseProps {
  descripcion: PortableTextBlock[] | string
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-600 leading-relaxed mb-2 last:mb-0">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-1 text-gray-600 mb-2">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-1 text-gray-600 mb-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-gray-800">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
  },
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
        <div className="mt-3">
          {typeof descripcion === 'string' ? (
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{descripcion}</p>
          ) : (
            <PortableText value={descripcion} components={portableTextComponents} />
          )}
        </div>
      )}
    </div>
  )
}
