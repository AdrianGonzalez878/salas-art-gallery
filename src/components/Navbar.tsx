'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'

interface SearchObraItem {
  _id: string
  titulo: string
  slug: string
  precio: number
  precioFinal: number
  tieneDescuento?: boolean
  imagenUrl: string | null
  artistaNombre?: string | null
}

interface SearchArtistaItem {
  _id: string
  nombre: string
  slug: string
  resumen?: string | null
  imagenUrl: string | null
}

interface SearchResults {
  obras: SearchObraItem[]
  artistas: SearchArtistaItem[]
}

const emptySearchResults: SearchResults = { obras: [], artistas: [] }

/** Desktop — estilo editorial galería (Salas) */
function navLinkClass(active: boolean) {
  return [
    'relative px-3 py-2 font-display text-[13px] uppercase tracking-[0.16em] transition-colors duration-200',
    active
      ? 'text-neutral-900 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:bg-gradient-to-r after:from-fuchsia-500 after:via-violet-500 after:to-sky-400'
      : 'text-neutral-600 hover:text-neutral-900',
  ].join(' ')
}

const desktopDropdownLink =
  'block w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-violet-50 hover:text-violet-900 transition-colors duration-150'

const desktopDropdownLinkStrong =
  'block w-full text-left px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-violet-50 hover:text-violet-900 transition-colors duration-150'

function desktopDropdownPanelClass(open: boolean) {
  return [
    'absolute left-0 top-[calc(100%-2px)] z-[60] w-56 transition-[opacity,transform] duration-200 ease-out',
    open
      ? 'opacity-100 visible pointer-events-auto translate-y-0'
      : 'opacity-0 invisible pointer-events-none -translate-y-1',
  ].join(' ')
}

const desktopDropdownList =
  'rounded-lg border border-neutral-200 bg-white shadow-lg shadow-neutral-900/10 overflow-hidden list-none m-0 p-0'

/** Menú móvil — estilo galería Salas */
const mobileNavItem =
  'block font-display text-[15px] uppercase tracking-[0.14em] text-neutral-800 py-3.5 border-b border-neutral-100 transition-colors active:bg-violet-50/60'

const mobileNavItemActive = 'text-violet-800'

const mobileNavButton =
  `${mobileNavItem} flex w-full items-center justify-between text-left cursor-pointer`

const mobileSubBack =
  'flex items-center gap-2 text-left text-[11px] font-semibold text-violet-700 uppercase tracking-[0.2em] mb-5 py-1'

const mobileSafeBottom = 'max(1rem, calc(1rem + env(safe-area-inset-bottom, 0px)))'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isExploraOpen, setIsExploraOpen] = useState(false)
  const [isTiendaOpen, setIsTiendaOpen] = useState(false)
  const [isDesktopExploraOpen, setIsDesktopExploraOpen] = useState(false)
  const [isDesktopTiendaOpen, setIsDesktopTiendaOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults>(emptySearchResults)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  /** Escritorio: solo ícono de lupa hasta que el usuario abre el campo */
  const [desktopSearchExpanded, setDesktopSearchExpanded] = useState(false)
  const [canHoverNav, setCanHoverNav] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const desktopSearchInputRef = useRef<HTMLInputElement>(null)
  const exploraMenuRef = useRef<HTMLDivElement>(null)
  const tiendaMenuRef = useRef<HTMLDivElement>(null)
  const { totalItems } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsDesktopExploraOpen(false)
    setIsDesktopTiendaOpen(false)
    setIsMenuOpen(false)
    setIsExploraOpen(false)
    setIsTiendaOpen(false)
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
      setSearchResults(emptySearchResults)
      setSearchOpen(false)
      return
    }
    setSearchOpen(true)
    const t = setTimeout(() => {
      setSearchLoading(true)
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((data) =>
          setSearchResults({
            obras: Array.isArray(data?.obras) ? data.obras : [],
            artistas: Array.isArray(data?.artistas) ? data.artistas : [],
          })
        )
        .catch(() => setSearchResults(emptySearchResults))
        .finally(() => setSearchLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const hasSearchHits =
    searchResults.obras.length > 0 || searchResults.artistas.length > 0

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
    setDesktopSearchExpanded(false)
  }

  const closeMobileSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
    setIsSearchOpen(false)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        if (searchQuery.trim() === '') {
          setDesktopSearchExpanded(false)
        }
      }
      if (
        exploraMenuRef.current &&
        !exploraMenuRef.current.contains(e.target as Node)
      ) {
        setIsDesktopExploraOpen(false)
      }
      if (
        tiendaMenuRef.current &&
        !tiendaMenuRef.current.contains(e.target as Node)
      ) {
        setIsDesktopTiendaOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchQuery])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDesktopExploraOpen(false)
        setIsDesktopTiendaOpen(false)
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

  const isHome = pathname === '/'
  const isTienda = pathname === '/productos' || pathname.startsWith('/productos/')
  const isExplora =
    pathname === '/artistas' ||
    pathname.startsWith('/artistas/') ||
    pathname === '/exposiciones' ||
    pathname.startsWith('/exposiciones/')
  const isPromociones = pathname === '/promociones'
  const isGaleria = pathname === '/galeria'
  const isSobre = pathname === '/sobre-nosotros'

  return (
    <>
      {/* Desktop Navbar — editorial galería */}
      <nav className="hidden lg:block sticky top-0 z-50">
        <div className="bg-white/92 backdrop-blur-md border-b border-neutral-200/70 shadow-[0_1px_0_rgba(0,0,0,0.03)] overflow-visible">
          <div className="max-w-7xl mx-auto px-6 xl:px-8 overflow-visible">
            <div className="flex items-center justify-between gap-6 h-[4.75rem] overflow-visible">
              {/* Logo + marca */}
              <Link
                href="/"
                className="group flex items-center gap-4 shrink-0 min-w-0 rounded-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500"
              >
                <Image
                  src="/logo.png"
                  alt="Salas Art Gallery"
                  width={280}
                  height={80}
                  className="h-14 xl:h-[3.75rem] w-auto object-contain"
                  quality={100}
                  priority
                />
                <span className="hidden xl:flex flex-col border-l border-neutral-200 pl-4">
                  <span className="font-display text-[11px] uppercase tracking-[0.28em] text-neutral-400">
                    Casa de arte
                  </span>
                  <span className="font-display text-sm italic text-neutral-700 -mt-0.5">
                    Salas Art Gallery
                  </span>
                </span>
              </Link>

              {/* Navegación central */}
              <div className="flex items-center justify-center gap-0.5 flex-1 min-w-0 overflow-visible">
                <Link href="/" className={navLinkClass(isHome)}>
                  Inicio
                </Link>

                <span className="mx-1 h-4 w-px bg-neutral-200 shrink-0" aria-hidden />

                {/* Tienda — obras y categorías */}
                <div
                  ref={tiendaMenuRef}
                  className="relative shrink-0"
                  onMouseEnter={() => {
                    if (canHoverNav) {
                      setIsDesktopTiendaOpen(true)
                      setIsDesktopExploraOpen(false)
                    }
                  }}
                  onMouseLeave={() => {
                    if (canHoverNav) setIsDesktopTiendaOpen(false)
                  }}
                >
                  <button
                    type="button"
                    className={`${navLinkClass(isTienda)} cursor-pointer bg-transparent border-0 inline-flex items-center gap-1`}
                    aria-expanded={isDesktopTiendaOpen}
                    aria-haspopup="true"
                    onClick={() => {
                      setIsDesktopExploraOpen(false)
                      setIsDesktopTiendaOpen((open) => !open)
                    }}
                  >
                    Tienda
                    <svg
                      className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${
                        isDesktopTiendaOpen ? 'rotate-180' : ''
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

                  <div className={desktopDropdownPanelClass(isDesktopTiendaOpen)}>
                    <ul className={desktopDropdownList} role="menu" aria-label="Tienda">
                      <li role="none">
                        <Link
                          href="/productos"
                          className={desktopDropdownLinkStrong}
                          onClick={() => setIsDesktopTiendaOpen(false)}
                          role="menuitem"
                        >
                          Ver todas las obras
                        </Link>
                      </li>
                      <li role="none" className="border-t border-neutral-100">
                        <Link
                          href="/promociones"
                          className={desktopDropdownLink}
                          onClick={() => setIsDesktopTiendaOpen(false)}
                          role="menuitem"
                        >
                          Promociones
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <span className="mx-1 h-4 w-px bg-neutral-200 shrink-0" aria-hidden />

                {/* Explora — artistas y exposiciones */}
                <div
                  ref={exploraMenuRef}
                  className="relative shrink-0"
                  onMouseEnter={() => {
                    if (canHoverNav) {
                      setIsDesktopExploraOpen(true)
                      setIsDesktopTiendaOpen(false)
                    }
                  }}
                  onMouseLeave={() => {
                    if (canHoverNav) setIsDesktopExploraOpen(false)
                  }}
                >
                  <button
                    type="button"
                    className={`${navLinkClass(isExplora)} cursor-pointer bg-transparent border-0 inline-flex items-center gap-1`}
                    aria-expanded={isDesktopExploraOpen}
                    aria-haspopup="true"
                    onClick={() => {
                      setIsDesktopTiendaOpen(false)
                      setIsDesktopExploraOpen((open) => !open)
                    }}
                  >
                    Explora
                    <svg
                      className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${
                        isDesktopExploraOpen ? 'rotate-180' : ''
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

                  <div className={desktopDropdownPanelClass(isDesktopExploraOpen)}>
                    <ul className={desktopDropdownList} role="menu" aria-label="Explora">
                      <li role="none" className="border-b border-neutral-100">
                        <Link
                          href="/artistas"
                          className={desktopDropdownLink}
                          onClick={() => setIsDesktopExploraOpen(false)}
                          role="menuitem"
                        >
                          Artistas
                        </Link>
                      </li>
                      <li role="none">
                        <Link
                          href="/exposiciones"
                          className={desktopDropdownLink}
                          onClick={() => setIsDesktopExploraOpen(false)}
                          role="menuitem"
                        >
                          Exposiciones
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <span className="mx-1 h-4 w-px bg-neutral-200 shrink-0" aria-hidden />

                <Link href="/promociones" className={navLinkClass(isPromociones)}>
                  Promociones
                </Link>

                <span className="mx-1 h-4 w-px bg-neutral-200 shrink-0" aria-hidden />

                <Link href="/galeria" className={navLinkClass(isGaleria)}>
                  Galería
                </Link>

                <span className="mx-1 h-4 w-px bg-neutral-200 shrink-0" aria-hidden />

                <Link href="/sobre-nosotros" className={navLinkClass(isSobre)}>
                  Nosotros
                </Link>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 shrink-0">
                <div
                  ref={searchRef}
                  className={`relative transition-[width] duration-200 ease-out ${
                    desktopSearchExpanded ? 'w-48 xl:w-56' : 'w-10'
                  }`}
                >
                  {!desktopSearchExpanded ? (
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/80 bg-neutral-50/80 text-neutral-600 hover:text-violet-700 hover:border-violet-200 hover:bg-violet-50/50 transition-all duration-200"
                      aria-label="Buscar obras o artistas"
                      aria-expanded={false}
                      onClick={() => {
                        setDesktopSearchExpanded(true)
                        queueMicrotask(() => desktopSearchInputRef.current?.focus())
                      }}
                    >
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  ) : (
                    <form onSubmit={handleSearch}>
                      <label htmlFor="nav-search" className="sr-only">Buscar obras o artistas</label>
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
                          placeholder="Buscar obras o artistas..."
                          className="w-full min-w-0 rounded-full border border-neutral-200 bg-white py-2 pl-4 pr-9 text-sm text-neutral-900 placeholder-neutral-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-300/50"
                          aria-label="Buscar obras o artistas"
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-violet-600 transition-colors rounded-full"
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
                    <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl border border-neutral-200/80 bg-white shadow-xl z-50 max-h-[min(80vh,420px)] overflow-y-auto">
                      {searchLoading ? (
                        <div className="p-4 text-center text-sm text-neutral-500">Buscando...</div>
                      ) : !hasSearchHits ? (
                        <div className="p-4 text-center text-sm text-neutral-500">No hay resultados</div>
                      ) : (
                        <>
                          {searchResults.artistas.length > 0 && (
                            <div>
                              <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                                Artistas
                              </p>
                              <ul className="pb-1">
                                {searchResults.artistas.map((item) => (
                                  <li key={item._id}>
                                    <Link
                                      href={`/artistas/${item.slug}`}
                                      onClick={closeSearch}
                                      className="flex gap-3 px-3 py-2.5 hover:bg-violet-50/80 transition-colors duration-200"
                                    >
                                      <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-neutral-100">
                                        {item.imagenUrl ? (
                                          <Image src={item.imagenUrl} alt="" fill className="object-cover" sizes="48px" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">—</div>
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-neutral-900 line-clamp-1">{item.nombre}</p>
                                        <p className="text-xs text-neutral-500">Artista</p>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {searchResults.obras.length > 0 && (
                            <div>
                              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                                Obras
                              </p>
                              <ul className="pb-1">
                                {searchResults.obras.map((item) => (
                                  <li key={item._id}>
                                    <Link
                                      href={`/productos/${item.slug}`}
                                      onClick={closeSearch}
                                      className="flex gap-3 px-3 py-2.5 hover:bg-violet-50/80 transition-colors duration-200"
                                    >
                                      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                                        {item.imagenUrl ? (
                                          <Image src={item.imagenUrl} alt="" fill className="object-cover" sizes="48px" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">—</div>
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-neutral-900 line-clamp-2">{item.titulo}</p>
                                        <p className="text-sm text-neutral-600">
                                          {item.tieneDescuento ? (
                                            <>
                                              <span className="line-through text-neutral-400">${item.precio.toLocaleString()}</span>
                                              {' '}
                                              <span className="font-semibold text-neutral-900">${item.precioFinal.toLocaleString()}</span>
                                            </>
                                          ) : (
                                            <span className="font-semibold text-neutral-900">${item.precio.toLocaleString()}</span>
                                          )}
                                        </p>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <Link
                            href={`/productos?q=${encodeURIComponent(searchQuery.trim())}`}
                            onClick={closeSearch}
                            className="block border-t border-neutral-100 px-3 py-3 text-center text-sm font-medium text-violet-800 hover:bg-violet-50 transition-colors duration-200"
                          >
                            Ver todas las obras
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  href="/carrito"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/80 bg-neutral-50/80 text-neutral-700 hover:text-violet-700 hover:border-violet-200 hover:bg-violet-50/50 transition-all duration-200"
                  aria-label={`Carrito${totalItems > 0 ? ` (${totalItems} obra${totalItems !== 1 ? 's' : ''})` : ''}`}
                >
                  <svg
                    className="h-[18px] w-[18px]"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.75"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[2px] bg-salas-gradient" aria-hidden />
      </nav>

      {/* Mobile Navbar — dock inferior estilo galería */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        {/* Dock cerrado */}
        {!isMenuOpen && (
          <div
            className="pointer-events-auto fixed inset-x-3 grid min-h-16 grid-cols-4 rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-md shadow-[0_8px_32px_rgba(88,28,135,0.12)] overflow-hidden"
            style={{ bottom: mobileSafeBottom }}
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-salas-gradient" aria-hidden />
            <Link
              href="/"
              className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors ${
                isHome ? 'text-violet-800' : 'text-neutral-600 active:bg-violet-50/50'
              }`}
              aria-label="Inicio"
            >
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />
              </svg>
              <span>Inicio</span>
            </Link>
            <Link
              href="/productos"
              className={`flex min-h-16 flex-col items-center justify-center gap-1 border-l border-neutral-100 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors ${
                isTienda ? 'text-violet-800' : 'text-neutral-600 active:bg-violet-50/50'
              }`}
              aria-label="Ver obras"
            >
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11ZM8 8h8M8 12h8M8 16h5" />
              </svg>
              <span>Obras</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="flex min-h-16 flex-col items-center justify-center gap-1 border-l border-neutral-100 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-800 active:bg-violet-50/50 transition-colors"
              aria-label="Abrir menú"
              aria-expanded={false}
            >
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <span>Menú</span>
            </button>
            <Link
              href="/carrito"
              className="relative flex min-h-16 flex-col items-center justify-center gap-1 border-l border-neutral-100 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-700 active:bg-violet-50/50 transition-colors"
              aria-label={`Carrito${totalItems > 0 ? ` (${totalItems} obra${totalItems !== 1 ? 's' : ''})` : ''}`}
            >
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="absolute top-2 right-[calc(50%-1.5rem)] flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Panel del menú */}
        {isMenuOpen && (
          <>
            <div
              className="pointer-events-auto fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] z-40"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden
            />
            <div
              className="pointer-events-auto fixed inset-x-3 flex flex-col max-h-[min(88vh,640px)] z-50 rounded-2xl border border-neutral-200/80 bg-white shadow-2xl shadow-violet-500/10 overflow-hidden animate-slide-up"
              style={{
                bottom: mobileSafeBottom,
              }}
              role="dialog"
              aria-label="Menú de navegación"
            >
              <div className="h-[2px] bg-salas-gradient shrink-0" aria-hidden />

              <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
                {!isExploraOpen && !isTiendaOpen && !isSearchOpen ? (
                  <div className="overflow-y-auto flex-1 min-h-0 px-5 pt-5 pb-3">
                    <div className="mb-5 flex flex-col items-center text-center">
                      <Link href="/" onClick={() => setIsMenuOpen(false)} className="mb-2">
                        <Image
                          src="/logo.png"
                          alt="Salas Art Gallery"
                          width={180}
                          height={64}
                          className="h-14 w-auto object-contain"
                          quality={100}
                        />
                      </Link>
                      <p className="font-display text-[10px] uppercase tracking-[0.28em] text-neutral-400">
                        Casa de arte
                      </p>
                    </div>

                    <nav className="space-y-0">
                      <Link
                        href="/"
                        className={`${mobileNavItem} ${isHome ? mobileNavItemActive : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Inicio
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setIsTiendaOpen(true); setIsExploraOpen(false); setIsSearchOpen(false) }}
                        className={`${mobileNavButton} ${isTienda ? mobileNavItemActive : ''}`}
                        aria-expanded={false}
                      >
                        Tienda
                        <svg className="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsExploraOpen(true); setIsTiendaOpen(false); setIsSearchOpen(false) }}
                        className={`${mobileNavButton} ${isExplora ? mobileNavItemActive : ''}`}
                        aria-expanded={false}
                      >
                        Explora
                        <svg className="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <Link
                        href="/promociones"
                        className={`${mobileNavItem} ${isPromociones ? mobileNavItemActive : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Promociones
                      </Link>
                      <Link
                        href="/galeria"
                        className={`${mobileNavItem} ${isGaleria ? mobileNavItemActive : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Galería
                      </Link>
                      <Link
                        href="/sobre-nosotros"
                        className={`${mobileNavItem} ${isSobre ? mobileNavItemActive : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Nosotros
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setIsSearchOpen(true); setIsExploraOpen(false); setIsTiendaOpen(false) }}
                        className={mobileNavButton}
                        aria-expanded={false}
                      >
                        Buscar
                        <svg className="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                ) : null}

                {isTiendaOpen ? (
                  <div className="overflow-y-auto flex-1 min-h-0 px-5 pt-5 pb-3">
                    <button
                      type="button"
                      onClick={() => setIsTiendaOpen(false)}
                      className={mobileSubBack}
                      aria-label="Volver al menú"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Menú
                    </button>
                    <p className="font-display text-lg uppercase tracking-[0.12em] text-neutral-900 mb-4">Tienda</p>
                    <div className="space-y-0">
                      <Link
                        href="/productos"
                        className={`${mobileNavItem} font-semibold text-violet-900 bg-violet-50/50 border-violet-100`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Todas las obras
                      </Link>
                      <Link
                        href="/promociones"
                        className={mobileNavItem}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Promociones
                      </Link>
                    </div>
                  </div>
                ) : null}

                {isExploraOpen ? (
                  <div className="overflow-y-auto flex-1 min-h-0 px-5 pt-5 pb-3">
                    <button
                      type="button"
                      onClick={() => setIsExploraOpen(false)}
                      className={mobileSubBack}
                      aria-label="Volver al menú"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Menú
                    </button>
                    <p className="font-display text-lg uppercase tracking-[0.12em] text-neutral-900 mb-4">Explora</p>
                    <div className="space-y-0">
                      <Link
                        href="/artistas"
                        className={mobileNavItem}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Artistas
                      </Link>
                      <Link
                        href="/exposiciones"
                        className={mobileNavItem}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Exposiciones
                      </Link>
                    </div>
                  </div>
                ) : null}

                {isSearchOpen ? (
                  <div className="overflow-y-auto flex-1 min-h-0 px-5 pt-5 pb-3 flex flex-col">
                    <button
                      type="button"
                      onClick={() => { setIsSearchOpen(false); setSearchQuery('') }}
                      className={`${mobileSubBack} shrink-0`}
                      aria-label="Volver al menú"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Buscar
                    </button>
                    <form onSubmit={handleSearch} className="shrink-0">
                      <label htmlFor="nav-search-mobile" className="sr-only">Buscar obras o artistas</label>
                      <div className="relative">
                        <input
                          id="nav-search-mobile"
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar obras o artistas..."
                          className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-3 pl-4 pr-12 text-base text-neutral-900 placeholder-neutral-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-300/50 focus:bg-white"
                          aria-label="Buscar obras o artistas"
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 active:text-violet-700"
                          aria-label="Buscar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                    <div className="flex-1 min-h-0 overflow-y-auto mt-4">
                      {searchQuery.trim().length >= 2 ? (
                        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
                          {searchLoading ? (
                            <div className="p-4 text-center text-sm text-neutral-500">Buscando...</div>
                          ) : !hasSearchHits ? (
                            <div className="p-4 text-center text-sm text-neutral-500">No hay resultados</div>
                          ) : (
                            <>
                              {searchResults.artistas.length > 0 && (
                                <div>
                                  <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                                    Artistas
                                  </p>
                                  <ul>
                                    {searchResults.artistas.map((item) => (
                                      <li key={item._id}>
                                        <Link
                                          href={`/artistas/${item.slug}`}
                                          onClick={closeMobileSearch}
                                          className="flex gap-3 px-3 py-3 active:bg-violet-50/80 transition-colors border-b border-neutral-100"
                                        >
                                          <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-neutral-100">
                                            {item.imagenUrl ? (
                                              <Image src={item.imagenUrl} alt="" fill className="object-cover" sizes="48px" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">—</div>
                                            )}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-neutral-900 line-clamp-1">{item.nombre}</p>
                                            <p className="text-xs text-neutral-500">Artista</p>
                                          </div>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {searchResults.obras.length > 0 && (
                                <div>
                                  <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                                    Obras
                                  </p>
                                  <ul>
                                    {searchResults.obras.map((item) => (
                                      <li key={item._id}>
                                        <Link
                                          href={`/productos/${item.slug}`}
                                          onClick={closeMobileSearch}
                                          className="flex gap-3 px-3 py-3 active:bg-violet-50/80 transition-colors border-b border-neutral-100 last:border-0"
                                        >
                                          <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                                            {item.imagenUrl ? (
                                              <Image src={item.imagenUrl} alt="" fill className="object-cover" sizes="48px" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">—</div>
                                            )}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-neutral-900 line-clamp-2">{item.titulo}</p>
                                            <p className="text-sm text-neutral-600">
                                              {item.tieneDescuento ? (
                                                <>
                                                  <span className="line-through text-neutral-400">${item.precio.toLocaleString()}</span>
                                                  {' '}
                                                  <span className="font-semibold">${item.precioFinal.toLocaleString()}</span>
                                                </>
                                              ) : (
                                                <span className="font-semibold">${item.precio.toLocaleString()}</span>
                                              )}
                                            </p>
                                          </div>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <Link
                                href={`/productos?q=${encodeURIComponent(searchQuery.trim())}`}
                                onClick={closeMobileSearch}
                                className="block border-t border-neutral-100 px-4 py-3 text-center text-sm font-medium text-violet-800 active:bg-violet-50"
                              >
                                Ver todas las obras
                              </Link>
                            </>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-400 text-center py-6">Escribe al menos 2 caracteres</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Barra inferior del panel */}
              <div
                className="flex items-center border-t border-neutral-100 bg-neutral-50/80 shrink-0"
                style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
              >
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 py-3.5 min-h-[48px] text-neutral-700 active:bg-violet-50/60 transition-colors"
                  aria-label="Cerrar menú"
                  aria-expanded={true}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-display text-[13px] uppercase tracking-[0.18em]">Cerrar</span>
                </button>
                <div className="w-px h-8 bg-neutral-200" aria-hidden />
                <Link
                  href="/carrito"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative flex items-center justify-center w-14 min-h-[48px] text-neutral-700 active:bg-violet-50/60"
                  aria-label={`Carrito${totalItems > 0 ? ` (${totalItems} obra${totalItems !== 1 ? 's' : ''})` : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute top-1.5 right-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
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
