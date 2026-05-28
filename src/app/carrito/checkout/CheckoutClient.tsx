'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { urlFor } from '@/lib/sanity'
import { computeShippingCost, montoFaltanteParaEnvioGratis, UMBRAL_ENVIO_GRATIS_MXN } from '@/lib/shipping'
import { trackInitiateCheckout, trackPurchase } from '@/lib/marketingPixels'
import type { Promocion } from '@/sanity/lib/types'

/* Cargar PaymentBrick solo en el cliente (usa window.MercadoPago) */
const PaymentBrick = dynamic(() => import('@/components/PaymentBrick'), { ssr: false })

export default function CheckoutClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, subtotal, clearCart } = useCart()

  const [step, setStep] = useState<1 | 2>(1)
  const [error, setError] = useState<string | null>(null)
  const [promociones, setPromociones] = useState<Promocion[]>([])

  useEffect(() => {
    fetch('/api/promociones')
      .then((r) => r.json())
      .then((data: Promocion[]) => setPromociones(data))
      .catch(() => {})
  }, [])

  const regaloActivo = promociones.find((p) => subtotal >= p.montoMinimo) ?? null
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; descuento: number } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const envio = computeShippingCost(subtotal)
  const faltaParaEnvioGratis = montoFaltanteParaEnvioGratis(subtotal)
  const subtotalConEnvio = subtotal + envio
  const descuento = appliedCoupon?.descuento ?? 0
  const total = Math.max(0, subtotalConEnvio - descuento)

  useEffect(() => {
    if (searchParams.get('error') === 'pago_cancelado') {
      setError('El pago fue cancelado. Puedes intentar de nuevo cuando quieras.')
    }
  }, [searchParams])

  const initCheckoutTracked = useRef(false)
  useEffect(() => {
    if (items.length === 0 || initCheckoutTracked.current) return
    initCheckoutTracked.current = true
    trackInitiateCheckout({
      value: total,
      items: items.map((i) => ({
        id: i.id,
        name: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
    })
  }, [items, total])

  const handleApplyCoupon = async () => {
    setCouponError(null)
    const code = couponInput.trim()
    if (!code) return
    setCouponLoading(true)
    try {
      const res = await fetch('/api/cupones/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: code, subtotal, envio }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string; codigo?: string; descuento?: number }
      if (!res.ok || !data.ok || data.descuento == null || !data.codigo) {
        setCouponError(data.error || 'Código no válido o no aplicable')
        return
      }
      setAppliedCoupon({ code: data.codigo, descuento: data.descuento })
      setCouponInput('')
    } catch {
      setCouponError('No se pudo validar el cupón. Intenta de nuevo.')
    } finally {
      setCouponLoading(false)
    }
  }

  /* Si cambia el carrito o el envío, revalidar cupón contra Sanity */
  useEffect(() => {
    const codigo = appliedCoupon?.code
    if (!codigo) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/cupones/validar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codigo, subtotal, envio }),
        })
        const data = (await res.json()) as { ok?: boolean; error?: string; codigo?: string; descuento?: number }
        if (cancelled) return
        if (!res.ok || !data.ok || data.descuento == null || !data.codigo) {
          setAppliedCoupon(null)
          setCouponError(data.error || 'El cupón ya no aplica a tu carrito.')
          return
        }
        setCouponError(null)
        setAppliedCoupon((prev) =>
          prev && prev.code === data.codigo && prev.descuento === data.descuento
            ? prev
            : { code: data.codigo!, descuento: data.descuento! }
        )
      } catch {
        if (!cancelled) setCouponError(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [subtotal, envio, appliedCoupon?.code])

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError(null)
    setCouponInput('')
  }

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    calle: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    pais: 'México',
    notas: '',
  })

  // Rastrea si el usuario eligió "Otro" en el selector de país
  const [paisSelector, setPaisSelector] = useState('México')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePaisSelector = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setPaisSelector(val)
    if (val !== 'Otro') {
      setForm((prev) => ({ ...prev, pais: val, estado: '' }))
    } else {
      setForm((prev) => ({ ...prev, pais: '', estado: '' }))
    }
  }

  /* Paso 1 → Paso 2 (solo avanzar si el formulario es válido) */
  const handleContinuar = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setStep(2)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }

  /* Callback del Payment Brick de MP */
  const handleBrickSubmit = async (brickFormData: Record<string, unknown>) => {
    const res = await fetch('/api/mercadopago/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: brickFormData,
        cliente: {
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
        },
        direccionEnvio: {
          calle: form.calle,
          colonia: form.colonia,
          ciudad: form.ciudad,
          estado: form.estado,
          codigoPostal: form.codigoPostal,
          pais: form.pais,
        },
        productos: items.map((i) => ({
          id: i.id,
          titulo: i.title,
          cantidad: i.quantity,
          precio: i.price,
          imageUrl: i.imageUrl,
        })),
        subtotal,
        envio,
        descuento,
        total,
        ...(regaloActivo && { regaloTitulo: regaloActivo.titulo }),
        ...(regaloActivo?.imagenBanner?.asset && {
          regaloImagenUrl: urlFor(regaloActivo.imagenBanner).width(192).quality(85).url(),
        }),
        ...(appliedCoupon && { cupon: appliedCoupon.code }),
        ...(form.notas && { notas: form.notas }),
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      /* El Brick captura el error lanzado y lo muestra en su UI */
      throw new Error(data.error || 'Error al procesar el pago.')
    }

    trackPurchase({
      value: total,
      orderId: data.numeroPedido,
      items: items.map((i) => ({
        id: i.id,
        name: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
    })

    clearCart()
    const pedidoParam = encodeURIComponent(data.numeroPedido || '')
    if (data.pending) {
      router.push(`/carrito/gracias?pedido=${pedidoParam}&estado=pending`)
    } else {
      router.push(`/carrito/gracias?pedido=${pedidoParam}`)
    }
  }

  /* Cabecera del banner (reutilizada en ambos pasos) */
  const Banner = (
    <div className="bg-white border-b border-gray-200 h-28 sm:h-28 md:h-32">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center h-full py-2" aria-label="Conchita Plata - Ir al inicio">
          <Image
            src="/logo.jpg"
            alt="Conchita Plata Joyería"
            width={240}
            height={75}
            className="h-full w-auto object-contain"
            priority
          />
        </Link>
        <Link
          href="/carrito"
          className="p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
          aria-label="Volver al carrito"
        >
          <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </Link>
      </div>
    </div>
  )

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {Banner}
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 mb-6">Tu carrito está vacío.</p>
          <Link href="/productos" className="text-gray-900 font-medium underline">
            Ir a productos
          </Link>
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────────────
     PASO 2: Formulario de pago (Payment Brick de MP)
  ───────────────────────────────────────────────── */
  if (step === 2) {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? ''

    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {Banner}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {/* Navegación */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a mis datos
            </button>
            <span>·</span>
            <span className="text-gray-400">Paso 2 de 2</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:items-start">
            {/* Columna izquierda: resumen */}
            <div className="space-y-4 lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h2>
                <ul className="divide-y divide-gray-100 mb-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 py-3 first:pt-0">
                      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.quantity} × ${item.price.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 shrink-0">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </li>
                  ))}
                  {regaloActivo && (
                    <li className="flex gap-3 py-3">
                      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {regaloActivo.imagenBanner?.asset ? (
                          <Image
                            src={urlFor(regaloActivo.imagenBanner).width(96).quality(85).url()}
                            alt={regaloActivo.titulo}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🎁</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-green-800 line-clamp-2">{regaloActivo.titulo}</p>
                        <p className="text-xs text-green-600">Regalo incluido</p>
                      </div>
                      <p className="text-sm font-semibold text-green-700 shrink-0">$0</p>
                    </li>
                  )}
                </ul>
                <div className="space-y-1.5 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span><span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Envío</span>
                    <span>{envio === 0 ? 'Gratis' : `$${Number(envio).toLocaleString()}`}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-700">
                      <span>Descuento ({appliedCoupon.code})</span>
                      <span>−${appliedCoupon.descuento.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
                    <span>Total a pagar</span><span>${total.toLocaleString()} MXN</span>
                  </div>
                </div>
              </div>

              {/* Info de entrega (solo lectura) */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Entrega a</h2>
                <p className="text-sm text-gray-900 font-medium">{form.nombre}</p>
                <p className="text-sm text-gray-600">{form.email}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {form.calle}, {form.colonia}, {form.ciudad}, {form.estado} {form.codigoPostal}
                </p>
              </div>
            </div>

            {/* Columna derecha: Payment Brick */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Pago seguro</h2>
              <p className="text-sm text-gray-500 mb-5 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Tus datos están protegidos por Mercado Pago
              </p>

              {!publicKey ? (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                  Falta configurar la clave pública de Mercado Pago
                  (<code className="font-mono">NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY</code>).
                </div>
              ) : (
                <>
                  {error && (
                    <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700" role="alert">
                      {error}
                    </p>
                  )}
                  <PaymentBrick
                    key={`${items.map((i) => i.id).sort().join('-')}-${total}`}
                    publicKey={publicKey}
                    amount={total}
                    payerEmail={form.email}
                    onSubmit={handleBrickSubmit}
                    onError={(msg) => setError(msg)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────────────
     PASO 1: Datos del cliente + dirección + resumen
  ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {Banner}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <span className="text-gray-700 font-medium">Paso 1 de 2 — Tus datos</span>
        </div>

        <form
          onSubmit={handleContinuar}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:items-start"
        >
          {/* Columna izquierda: datos */}
          <div className="space-y-6 lg:min-h-0">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos de contacto</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    id="nombre" name="nombre" type="text" required
                    value={form.nombre} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email" name="email" type="email" required
                    value={form.email} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    id="telefono" name="telefono" type="tel" required
                    value={form.telefono} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dirección de envío</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
                    Calle y número *
                  </label>
                  <input
                    id="calle" name="calle" type="text" required
                    value={form.calle} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="colonia" className="block text-sm font-medium text-gray-700 mb-1">
                    Colonia *
                  </label>
                  <input
                    id="colonia" name="colonia" type="text" required
                    value={form.colonia} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      id="ciudad" name="ciudad" type="text" required
                      value={form.ciudad} onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    {paisSelector === 'México' ? (
                      <select
                        id="estado" name="estado" required
                        value={form.estado} onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
                      >
                        <option value="">Selecciona un estado</option>
                        {[
                          'Aguascalientes','Baja California','Baja California Sur','Campeche',
                          'Chiapas','Chihuahua','Ciudad de México','Coahuila','Colima','Durango',
                          'Estado de México','Guanajuato','Guerrero','Hidalgo','Jalisco',
                          'Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla',
                          'Querétaro','Quintana Roo','San Luis Potosí','Sinaloa','Sonora',
                          'Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas',
                        ].map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="estado" name="estado" type="text" required
                        placeholder="Escribe tu estado o provincia"
                        value={form.estado} onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-1">
                    Código postal *
                  </label>
                  <input
                    id="codigoPostal" name="codigoPostal" type="text" required
                    value={form.codigoPostal} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="paisSelector" className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <select
                    id="paisSelector"
                    value={paisSelector}
                    onChange={handlePaisSelector}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
                  >
                    <option value="México">México</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Canadá">Canadá</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {paisSelector === 'Otro' && (
                    <input
                      name="pais" type="text" required
                      placeholder="Escribe el nombre de tu país"
                      value={form.pais}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-2">
                Notas del pedido (opcional)
              </label>
              <textarea
                id="notas" name="notas" rows={3}
                value={form.notas} onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                placeholder="Instrucciones especiales, horario de entrega, etc."
              />
            </div>
          </div>

          {/* Columna derecha: resumen + cupón + botón continuar */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h2>
              <ul className="divide-y divide-gray-100 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 py-3 first:pt-0">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ${item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 shrink-0">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </li>
                ))}
                {regaloActivo && (
                  <li className="flex gap-3 py-3">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {regaloActivo.imagenBanner?.asset ? (
                        <Image
                          src={urlFor(regaloActivo.imagenBanner).width(112).quality(85).url()}
                          alt={regaloActivo.titulo}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🎁</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-green-800 line-clamp-2">{regaloActivo.titulo}</p>
                      <p className="text-xs text-green-600">Regalo incluido</p>
                    </div>
                    <p className="text-sm font-semibold text-green-700 shrink-0">$0</p>
                  </li>
                )}
              </ul>

              {/* Cupón */}
              <div className="border-t border-gray-100 pt-3 pb-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-4 py-2.5">
                    <span className="text-sm font-medium text-green-800">
                      Cupón {appliedCoupon.code} (−${appliedCoupon.descuento.toLocaleString()})
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-sm text-green-700 hover:text-green-900 underline cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <label htmlFor="cupon" className="sr-only">Código de cupón</label>
                    <input
                      id="cupon" type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError(null) }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (!couponLoading) void handleApplyCoupon()
                        }
                      }}
                      disabled={couponLoading}
                      placeholder="Código de descuento"
                      className="flex-1 min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => void handleApplyCoupon()}
                      disabled={couponLoading}
                      className="shrink-0 rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? '…' : 'Aplicar'}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="mt-2 text-xs text-red-600" role="alert">{couponError}</p>
                )}
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span><span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Envío</span>
                  <span>{envio === 0 ? 'Gratis' : `$${Number(envio).toLocaleString()}`}</span>
                </div>
                {faltaParaEnvioGratis > 0 && (
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
                    Te faltan <strong>${faltaParaEnvioGratis.toLocaleString()}</strong> para envío gratis
                    (a partir de ${UMBRAL_ENVIO_GRATIS_MXN.toLocaleString()}).
                  </p>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700 text-sm">
                    <span>Descuento ({appliedCoupon.code})</span>
                    <span>−${appliedCoupon.descuento.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total</span><span>${total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Incluye impuestos</p>
              </div>

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-yellow-400 text-black py-3 px-6 font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Continuar al pago
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <Link
                href="/carrito"
                className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-900"
              >
                Volver al carrito
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
