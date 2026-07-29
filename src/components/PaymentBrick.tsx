'use client'

import { useEffect, useId, useRef, useState } from 'react'

/* ---- tipos mínimos del SDK de Mercado Pago ---- */
interface MpBricksController {
  unmount(): void
}
interface MpBricksBuilder {
  create(
    type: 'payment',
    containerId: string,
    config: {
      initialization: { amount: number; payer?: { email?: string } }
      customization?: Record<string, unknown>
      callbacks: {
        onReady?: () => void
        onSubmit?: (data: {
          selectedPaymentMethod: string
          formData: Record<string, unknown>
        }) => Promise<void>
        onError?: (error: unknown) => void
      }
    }
  ): Promise<MpBricksController>
}
interface MpInstance {
  bricks(): MpBricksBuilder
}
declare global {
  interface Window {
    MercadoPago: new (publicKey: string, opts?: { locale?: string }) => MpInstance
  }
}
/* ----------------------------------------------- */

interface Props {
  publicKey: string
  amount: number
  payerEmail?: string
  onSubmit: (formData: Record<string, unknown>) => Promise<void>
  onReady?: () => void
  onError?: (message: string) => void
}

/** MXN: máximo 2 decimales; evita NaN / montos inválidos que rompen el SDK */
function normalizeAmount(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return NaN
  return Math.round(value * 100) / 100
}

function loadMercadoPagoScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.MercadoPago) return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src*="sdk.mercadopago.com"]')
    if (existing) {
      let ticks = 0
      const maxTicks = 200 // ~20 s
      const id = window.setInterval(() => {
        if (window.MercadoPago) {
          window.clearInterval(id)
          resolve()
        } else if (++ticks > maxTicks) {
          window.clearInterval(id)
          reject(new Error('Tiempo de espera agotado al cargar Mercado Pago.'))
        }
      }, 100)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No se pudo cargar el SDK de Mercado Pago'))
    document.head.appendChild(script)
  })
}

/**
 * Variables visuales del Brick (lista oficial MP).
 * Violeta alineado con CTAs de Salas Art Gallery (logo colibrí).
 * Evitamos box-shadow con rgba, formPadding muy bajo y textTransform 'none'.
 */
const brickCustomVariables: Record<string, string> = {
  baseColor: '#8b5cf6',
  baseColorFirstVariant: '#a78bfa',
  baseColorSecondVariant: '#7c3aed',
  textPrimaryColor: '#111827',
  textSecondaryColor: '#6b7280',
  inputBackgroundColor: '#ffffff',
  outlinePrimaryColor: '#e5e7eb',
  outlineSecondaryColor: '#d1d5db',
  errorColor: '#dc2626',
  successColor: '#16a34a',
  buttonTextColor: '#ffffff',
  borderRadiusSmall: '8px',
  borderRadiusMedium: '12px',
  borderRadiusLarge: '14px',
  fontSizeExtraSmall: '12px',
  fontSizeSmall: '14px',
  inputVerticalPadding: '12px',
  inputHorizontalPadding: '14px',
}

/** Si el SDK rechaza el tema extendido, este conjunto ya probado que no rompe create() */
const brickFallbackVariables: Record<string, string> = {
  borderRadiusSmall: '8px',
  borderRadiusMedium: '12px',
  borderRadiusLarge: '14px',
  fontSizeExtraSmall: '12px',
}

function errorToMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const m = (err as { message: unknown }).message
    if (typeof m === 'string' && m) return m
  }
  return fallback
}

/** El primer create() que falla puede dejar nodos en el div; el reintento falla igual sin vaciar. */
function clearBrickMountNode(mountId: string) {
  const el = document.getElementById(mountId)
  if (el) el.replaceChildren()
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

export default function PaymentBrick({
  publicKey,
  amount,
  payerEmail,
  onSubmit,
  onReady,
  onError,
}: Props) {
  const [loading, setLoading] = useState(true)
  const reactId = useId().replace(/:/g, '')
  const containerId = `mp_payment_brick_${reactId}`
  const controllerRef = useRef<MpBricksController | null>(null)

  const onSubmitRef = useRef(onSubmit)
  const onReadyRef = useRef(onReady)
  const onErrorRef = useRef(onError)
  onSubmitRef.current = onSubmit
  onReadyRef.current = onReady
  onErrorRef.current = onError

  const payerEmailTrimmed = payerEmail?.trim() ?? ''

  useEffect(() => {
    if (!publicKey) {
      setLoading(false)
      return
    }

    const safeAmount = normalizeAmount(amount)
    if (Number.isNaN(safeAmount)) {
      setLoading(false)
      onErrorRef.current?.(
        'El total del pedido no es válido. Vuelve al carrito e inténtalo de nuevo.'
      )
      return
    }

    let cancelled = false

    async function init() {
      setLoading(true)

      try {
        await loadMercadoPagoScript()
      } catch (e) {
        if (!cancelled) {
          onErrorRef.current?.(errorToMessage(e, 'Error al cargar Mercado Pago.'))
          setLoading(false)
        }
        return
      }

      if (cancelled) return

      const brickCallbacks = {
        onReady: () => {
          if (!cancelled) {
            setLoading(false)
            onReadyRef.current?.()
          }
        },
        onSubmit: async ({ formData }: { formData: Record<string, unknown> }) => {
          await onSubmitRef.current(formData)
        },
        onError: (err: unknown) => {
          if (!err || (typeof err === 'object' && Object.keys(err as object).length === 0)) return
          const mpErr = err as { type?: string; message?: string }
          if (mpErr.type === 'non_critical') return

          const msg =
            err instanceof Error
              ? err.message
              : typeof mpErr.message === 'string' && mpErr.message
                ? mpErr.message
                : 'Error inesperado en el formulario de pago.'
          console.error('Mercado Pago Brick error:', err)
          onErrorRef.current?.(msg)
        },
      }

      async function mountPaymentBrick(
        customVars: Record<string, string> | null
      ): Promise<MpBricksController> {
        const mp = new window.MercadoPago(publicKey, { locale: 'es-MX' })
        const builder = mp.bricks()
        const visual: Record<string, unknown> = { hideFormTitle: true }
        if (customVars && Object.keys(customVars).length > 0) {
          visual.style = { customVariables: customVars }
        }
        return builder.create('payment', containerId, {
          initialization: {
            amount: safeAmount,
            ...(payerEmailTrimmed && { payer: { email: payerEmailTrimmed } }),
          },
          customization: {
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
              ticket: 'all',
              atm: 'all',
              prepaidCard: 'all',
            },
            visual,
          },
          callbacks: brickCallbacks,
        })
      }

      try {
        let controller: MpBricksController

        try {
          controller = await mountPaymentBrick(brickCustomVariables)
        } catch (themeErr) {
          console.warn(
            'PaymentBrick: tema extendido falló, reintentando con tema mínimo:',
            themeErr
          )
          clearBrickMountNode(containerId)
          await sleep(80)
          try {
            controller = await mountPaymentBrick(brickFallbackVariables)
          } catch (fallbackErr) {
            console.warn(
              'PaymentBrick: tema mínimo falló, usando Brick por defecto (sin customVariables):',
              fallbackErr
            )
            clearBrickMountNode(containerId)
            await sleep(80)
            controller = await mountPaymentBrick(null)
          }
        }

        if (cancelled) {
          controller.unmount()
        } else {
          controllerRef.current = controller
        }
      } catch (err: unknown) {
        if (!cancelled) {
          console.error('PaymentBrick create failed:', err)
          onErrorRef.current?.(
            errorToMessage(
              err,
              'No se pudo cargar el formulario de pago. Actualiza la página o inténtalo de nuevo en unos segundos.'
            )
          )
          setLoading(false)
        }
      }
    }

    void init()

    return () => {
      cancelled = true
      controllerRef.current?.unmount()
      controllerRef.current = null
    }
  }, [publicKey, amount, payerEmailTrimmed, containerId])

  return (
    <div className="relative min-h-[200px]">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10">
          <div className="w-8 h-8 rounded-full border-3 border-gray-200 border-t-blue-600 animate-spin" />
          <p className="text-sm text-gray-500">Cargando formulario de pago…</p>
        </div>
      )}
      <div id={containerId} />
    </div>
  )
}
