'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface ProductSearchFormProps {
  initialQuery?: string
}

export default function ProductSearchForm({ initialQuery = '' }: ProductSearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    const q = query.trim()
    if (q) params.set('q', q)
    else params.delete('q')
    params.set('page', '1')
    const qs = params.toString()
    router.push(qs ? `/productos?${qs}` : '/productos')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <label htmlFor="productos-search" className="sr-only">
        Buscar obras
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </span>
        <input
          id="productos-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar obra o artista..."
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 sm:py-2.5 pl-11 pr-20 sm:pr-24 text-base sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
        />
        <button
          type="submit"
          className="absolute inset-y-1.5 right-1.5 rounded-full bg-gray-900 px-3.5 sm:px-4 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Buscar
        </button>
      </div>
    </form>
  )
}
