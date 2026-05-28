'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'

interface SearchPreviewItem {
  _id: string
  titulo: string
  slug: string
  precio: number
  precioFinal: number
  tieneDescuento?: boolean
  imagenUrl: string | null
}

const categorias = [
  { nombre: 'Anillos', href: '/productos?categoria=anillos' },
  { nombre: 'Collares', href: '/productos?categoria=collares' },
  { nombre: 'Aretes', href: '/productos?categoria=aretes' },
  { nombre: 'Pulseras', href: '/productos?categoria=pulseras' },
  { nombre: 'Dijes', href: '/productos?categoria=dijes' },
  { nombre: 'Cadenas', href: '/productos?categoria=cadenas' },
  { nombre: 'Juegos', href: '/productos?categoria=juegos' },
]

/** Misma línea que el footer: ámbar al hover + transición (fondo claro → texto más oscuro) */
const desktopNavLink =
  'text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 underline-offset-[6px] decoration-amber-500/80 decoration-2 hover:underline'

const desktopNavButton =
  `${desktopNavLink} cursor-pointer bg-transparent border-0 p-0 inline-flex items-center`

const desktopDropdownLink =
  'block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors duration-200'

const desktopDropdownLinkStrong =
  'block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-900 transition-colors duration-200 border-b border-gray-100'

/** Menú móvil (fondo amarillo): hover tipo footer pero legible sobre amarillo */
const mobileNavItem =
  'transition-colors duration-200 text-black hover:text-amber-950 hover:bg-black/[0.08] rounded-lg -mx-2 px-2'

const mobileNavButton =
  `${mobileNavItem} flex w-full items-center justify-between text-left cursor-pointer`

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductosOpen, setIsProductosOpen] = useState(false)
  const [isDesktopProductosOpen, setIsDesktopProductosOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchPreviewItem[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  /** Escritorio: solo ícono de lupa hasta que el usuario abre el campo */
  const [desktopSearchExpanded, setDesktopSearchExpanded] = useState(false)
  const [canHoverNav, setCanHoverNav] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const desktopSearchInputRef = useRef<HTMLInputElement>(null)
  const productosMenuRef = useRef<HTMLDivElement>(null)
  const { totalItems } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsDesktopProductosOpen(false)
    setIsMenuOpen(false)
    setIsProductosOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setCanHoverNav(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < 2) {
      setSearchResults([])
      setSearchOpen(false)
      return
    }
    setSearchOpen(true)
    const t = setTimeout(() => {
      setSearchLoading(true)
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(Array.isArray(data) ? data : []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        if (searchQuery.trim() === '') {
          setDesktopSearchExpanded(false)
        }
      }
      if (
        productosMenuRef.current &&
        !productosMenuRef.current.contains(e.target as Node)
      ) {
        setIsDesktopProductosOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchQuery])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDesktopProductosOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/productos?q=${encodeURIComponent(q)}`)
      setSearchQuery('')
    } else {
      router.push('/productos')
    }
    setIsMenuOpen(false)
    setSearchOpen(false)
    setDesktopSearchExpanded(false)
  }

  return (
    <>
      {/* Desktop Navbar - Parte superior */}
      <nav className="hidden lg:block sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 rounded-lg transition-opacity duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              <Image
                src="/logo.jpg"
                alt="Conchita Logo"
                width={320}
                height={100}
                className="h-16 lg:h-20 w-auto object-contain"
                quality={100}
                priority
              />
            </Link>

            {/* Desktop Navigation: Inicio → Productos → Promociones → Sobre Conchita Plata */}
            <div className="flex items-center space-x-6 lg:space-x-8 flex-1 justify-center min-w-0">
              <Link href="/" className={`${desktopNavLink} shrink-0`}>
                Inicio
              </Link>

              {/* Productos con dropdown de categorías */}
              <div
                ref={productosMenuRef}
                className="relative shrink-0"
                onMouseEnter={() => {
                  if (canHoverNav) setIsDesktopProductosOpen(true)
                }}
                onMouseLeave={() => {
                  if (canHoverNav) setIsDesktopProductosOpen(false)
                }}
              >
                <button
                  type="button"
                  className={`${desktopNavButton} shrink-0`}
                  aria-expanded={isDesktopProductosOpen}
                  aria-haspopup="true"
                  onClick={() => setIsDesktopProductosOpen((open) => !open)}
                >
                  Productos
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      isDesktopProductosOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg transition-all duration-200 border border-gray-100 z-50 ${
                    isDesktopProductosOpen
                      ? 'opacity-100 visible pointer-events-auto'
                      : 'opacity-0 invisible pointer-events-none'
                  }`}
                >
                  <div className="py-1">
                    <Link
                      href="/productos"
                      className={desktopDropdownLinkStrong}
                      onClick={() => setIsDesktopProductosOpen(false)}
                    >
                      Todos los productos
                    </Link>
                    {categorias.map((categoria) => (
                      <Link
                        key={categoria.href}
                        href={categoria.href}
                        className={desktopDropdownLink}
                        onClick={() => setIsDesktopProductosOpen(false)}
                      >
                        {categoria.nombre}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/promociones" className={`${desktopNavLink} shrink-0`}>
                Promociones
              </Link>
              <Link
                href="/sobre-conchita-plata"
                className={`${desktopNavLink} shrink-0 text-sm lg:text-base whitespace-nowrap`}
              >
                Sobre Conchita Plata
              </Link>
            </div>

            {/* Right side — Buscar, Carrito (admin no se muestra en público) */}
            <div className="flex items-center space-x-3 lg:space-x-4 shrink-0">
              <div
                ref={searchRef}
                className={`hidden lg:block relative shrink-0 transition-[width] duration-200 ease-out ${
                  desktopSearchExpanded ? 'w-44 lg:w-56' : 'w-10'
                }`}
              >
                {!desktopSearchExpanded ? (
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-amber-600 hover:border-amber-300/80 transition-all duration-200 shadow-sm"
                    aria-label="Abrir búsqueda de productos"
                    aria-expanded={false}
                    onClick={() => {
                      setDesktopSearchExpanded(true)
                      queueMicrotask(() => desktopSearchInputRef.current?.focus())
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                ) : (
                <form onSubmit={handleSearch}>
                  <label htmlFor="nav-search" className="sr-only">Buscar productos</label>
                  <div className="relative min-w-0">
                    <input
                      ref={desktopSearchInputRef}
                      id="nav-search"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.trim().length >= 2 && setSearchOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setSearchOpen(false)
                          if (searchQuery.trim() === '') {
                            setDesktopSearchExpanded(false)
                            ;(e.target as HTMLInputElement).blur()
                          }
                        }
                      }}
                      placeholder="Buscar..."
                      title="Buscar productos"
                      className="w-full min-w-0 rounded-lg border border-gray-200 py-2 pl-3 pr-9 text-sm text-gray-900 placeholder-gray-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      aria-label="Buscar productos"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-amber-600 transition-colors duration-200 rounded-md"
                      aria-label="Buscar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>
                )}
                {searchOpen && searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg z-50 max-h-[min(80vh,400px)] overflow-y-auto">
                    {searchLoading ? (
                      <div className="p-4 text-center text-sm text-gray-500">Buscando...</div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">No hay resultados</div>
                    ) : (
                      <>
                        <ul className="py-1">
                          {searchResults.map((item) => (
                            <li key={item._id}>
                              <Link
                                href={`/productos/${item.slug}`}
                                onClick={() => {
                                  setSearchOpen(false)
                                  setSearchQuery('')
                                  setDesktopSearchExpanded(false)
                                }}
                                className="flex gap-3 px-3 py-2 hover:bg-amber-50/90 transition-colors duration-200"
                              >
                                <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-gray-100">
                                  {item.imagenUrl ? (
                                    <Image src={item.imagenUrl} alt="" fill className="object-cover" sizes="48px" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.titulo}</p>
                                  <p className="text-sm text-gray-600">
                                    {item.tieneDescuento ? (
                                      <>
                                        <span className="line-through text-gray-400">${item.precio.toLocaleString()}</span>
                                        {' '}
                                        <span className="font-semibold text-gray-900">${item.precioFinal.toLocaleString()}</span>
                                      </>
                                    ) : (
                                      <span className="font-semibold text-gray-900">${item.precio.toLocaleString()}</span>
                                    )}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/productos?q=${encodeURIComponent(searchQuery.trim())}`}
                          onClick={() => {
                            setSearchOpen(false)
                            setSearchQuery('')
                            setDesktopSearchExpanded(false)
                          }}
                          className="block border-t border-gray-100 px-3 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors duration-200"
                        >
                          Ver todos los resultados
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Link
                href="/carrito"
                className="relative p-2 rounded-lg text-gray-700 hover:text-amber-600 transition-colors duration-200 hover:bg-amber-50/80"
                aria-label={`Carrito${totalItems > 0 ? ` (${totalItems} producto${totalItems !== 1 ? 's' : ''})` : ''}`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-gray-900 ring-2 ring-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Parte inferior flotante */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Barra inferior: cuando el menú está cerrado, solo la barra flotante */}
        {!isMenuOpen && (
          <div
            className="fixed left-1/2 -translate-x-1/2 flex items-center bg-yellow-400 shadow-2xl z-50 w-[320px] rounded-full px-2 py-3 box-border"
            style={{
              bottom: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))',
              paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom, 0px))',
            }}
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-1 items-center justify-center gap-3 text-black py-3 hover:bg-yellow-500/80 hover:text-amber-950 transition-all duration-200 min-h-[52px] rounded-full"
              aria-label="Abrir menú de navegación"
              aria-expanded={false}
            >
              <svg
                className="w-7 h-7 shrink-0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="font-bold uppercase text-base tracking-wide">Navegación</span>
            </button>
            <Link
              href="/carrito"
              className="relative flex items-center justify-center text-black pl-5 pr-6 py-3 hover:bg-yellow-500/80 hover:text-amber-950 transition-all duration-200 border-l border-black/10 min-h-[52px] rounded-r-full shrink-0"
              aria-label={`Carrito${totalItems > 0 ? ` (${totalItems} producto${totalItems !== 1 ? 's' : ''})` : ''}`}
            >
              <svg
                className="w-6 h-6 shrink-0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-gray-900 ring-2 ring-yellow-400">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Menú abierto: un solo bloque = navbar (barra con X + Carrito) + contenido de navegación encima */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden
            />
            <div
              className="fixed left-1/2 -translate-x-1/2 flex flex-col w-[320px] max-w-[100vw] max-h-[85vh] z-50 rounded-3xl shadow-2xl overflow-hidden bg-yellow-400 animate-slide-up"
              style={{
                bottom: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              }}
              role="dialog"
              aria-label="Menú de navegación"
            >
              {/* Contenido de navegación (scroll) — menú principal, productos o búsqueda */}
              <div className="relative flex-1 min-h-0 overflow-hidden flex">
                {!isProductosOpen && !isSearchOpen ? (
                  <div className="overflow-y-auto flex-1 min-h-0 p-6 pb-4 w-full">
                    <div className="mb-6 flex justify-center">
                      <Link href="/" onClick={() => setIsMenuOpen(false)}>
                        <Image
                          src="/logo.jpg"
                          alt="Conchita Logo"
                          width={200}
                          height={70}
                          className="h-16 w-auto object-contain"
                          quality={100}
                        />
                      </Link>
                    </div>

                    <div className="space-y-0 mb-6">
                      <Link
                        href="/"
                        className={`block text-lg font-medium py-3 border-b border-black/20 ${mobileNavItem}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Inicio
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setIsProductosOpen(true); setIsSearchOpen(false) }}
                        className={`${mobileNavButton} text-lg font-medium py-3 border-b border-black/20`}
                        aria-expanded={false}
                      >
                        Productos
                        <svg
                          className="w-5 h-5 shrink-0"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <Link
                        href="/promociones"
                        className={`block text-lg font-medium py-3 border-b border-black/20 ${mobileNavItem}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Promociones
                      </Link>
                      <Link
                        href="/sobre-conchita-plata"
                        className={`block text-lg font-medium py-3 border-b border-black/20 ${mobileNavItem}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sobre Conchita Plata
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setIsSearchOpen(true); setIsProductosOpen(false) }}
                        className={`${mobileNavButton} text-lg font-medium py-3 border-b border-black/20`}
                        aria-expanded={false}
                      >
                        Buscar
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : null}
                {isProductosOpen ? (
                  <div className="overflow-y-auto flex-1 min-h-0 p-6 pb-4 w-full">
                    <button
                      type="button"
                      onClick={() => setIsProductosOpen(false)}
                      className="flex items-center gap-3 text-left text-sm font-semibold text-black/70 uppercase tracking-wider mb-6 rounded-lg px-2 -ml-2 py-1 hover:text-amber-950 hover:bg-black/[0.08] transition-colors duration-200 cursor-pointer"
                      aria-label="Volver al menú"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M15 19l-7-7 7-7" />
                      </svg>
                      Productos
                    </button>
                    <div className="space-y-1">
                      <Link
                        href="/productos"
                        className={`block text-lg font-medium py-3 border-b border-black/20 ${mobileNavItem}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Todos los productos
                      </Link>
                      {categorias.map((categoria) => (
                        <Link
                          key={categoria.href}
                          href={categoria.href}
                          className={`block text-lg font-medium py-3 border-b border-black/20 ${mobileNavItem}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {categoria.nombre}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                {/* Vista búsqueda móvil — mismo patrón que Productos (sin absolute para que no colapse el layout) */}
                {isSearchOpen ? (
                  <div className="overflow-y-auto flex-1 min-h-0 p-6 pb-4 w-full flex flex-col lg:hidden">
                    <button
                      type="button"
                      onClick={() => { setIsSearchOpen(false); setSearchQuery('') }}
                      className="flex items-center gap-3 text-left text-sm font-semibold text-black/70 uppercase tracking-wider mb-6 rounded-lg px-2 -ml-2 py-1 hover:text-amber-950 hover:bg-black/[0.08] transition-colors duration-200 cursor-pointer shrink-0"
                      aria-label="Volver al menú"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M15 19l-7-7 7-7" />
                      </svg>
                      Buscar
                    </button>
                    <form onSubmit={handleSearch} className="shrink-0">
                      <label htmlFor="nav-search-mobile" className="sr-only">Buscar productos</label>
                      <div className="relative">
                        <input
                          id="nav-search-mobile"
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar productos..."
                          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-12 text-base text-gray-900 placeholder-gray-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                          aria-label="Buscar productos"
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-amber-700 transition-colors duration-200 rounded-md"
                          aria-label="Buscar"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                    <div className="flex-1 min-h-0 overflow-y-auto mt-4">
                      {searchQuery.trim().length >= 2 ? (
                        <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                          {searchLoading ? (
                            <div className="p-4 text-center text-sm text-gray-500">Buscando...</div>
                          ) : searchResults.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">No hay resultados</div>
                          ) : (
                            <>
                              <ul className="py-1">
                                {searchResults.map((item) => (
                                  <li key={item._id}>
                                    <Link
                                      href={`/productos/${item.slug}`}
                                      onClick={() => { setSearchOpen(false); setSearchQuery(''); setIsSearchOpen(false); setIsMenuOpen(false) }}
                                      className="flex gap-3 px-4 py-3 hover:bg-amber-50/90 transition-colors duration-200 border-b border-gray-100 last:border-0"
                                    >
                                      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        {item.imagenUrl ? (
                                          <Image src={item.imagenUrl} alt="" fill className="object-cover" sizes="56px" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.titulo}</p>
                                        <p className="text-sm text-gray-600">
                                          {item.tieneDescuento ? (
                                            <>
                                              <span className="line-through text-gray-400">${item.precio.toLocaleString()}</span>
                                              {' '}
                                              <span className="font-semibold text-gray-900">${item.precioFinal.toLocaleString()}</span>
                                            </>
                                          ) : (
                                            <span className="font-semibold text-gray-900">${item.precio.toLocaleString()}</span>
                                          )}
                                        </p>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <Link
                                href={`/productos?q=${encodeURIComponent(searchQuery.trim())}`}
                                onClick={() => { setSearchOpen(false); setSearchQuery(''); setIsSearchOpen(false); setIsMenuOpen(false) }}
                                className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors duration-200"
                              >
                                Ver todos los resultados
                              </Link>
                            </>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-black/60 text-center py-4">Escribe al menos 2 caracteres para buscar</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Navbar (barra con X y Carrito) — abajo, misma pieza */}
              <div
                className="flex items-center bg-yellow-400 border-t border-black/10 px-2 py-3 shrink-0 rounded-b-3xl"
                style={{
                  paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom, 0px))',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-1 items-center justify-center gap-3 text-black py-3 hover:bg-yellow-500/80 hover:text-amber-950 transition-all duration-200 min-h-[52px] rounded-full"
                  aria-label="Cerrar menú"
                  aria-expanded={true}
                >
                  <svg className="w-7 h-7 shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-bold uppercase text-base tracking-wide">Cerrar</span>
                </button>
                <Link
                  href="/carrito"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative flex items-center justify-center text-black pl-5 pr-6 py-3 hover:bg-yellow-500/80 hover:text-amber-950 transition-all duration-200 border-l border-black/10 min-h-[52px] rounded-r-full shrink-0"
                  aria-label={`Carrito${totalItems > 0 ? ` (${totalItems} producto${totalItems !== 1 ? 's' : ''})` : ''}`}
                >
                  <svg
                    className="w-6 h-6 shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute top-1.5 right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-gray-900 ring-2 ring-yellow-400">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  )
}
