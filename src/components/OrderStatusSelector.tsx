'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Estado =
  | 'pendiente_pago'
  | 'pendiente'
  | 'procesando'
  | 'enviado'
  | 'entregado'
  | 'cancelado'

interface Props {
  pedidoId: string
  estadoActual: Estado
}

const ESTADOS: { value: Estado; label: string; color: string; dot: string }[] = [
  { value: 'pendiente_pago', label: 'Pendiente de pago', color: 'text-gray-700',   dot: 'bg-gray-400'   },
  { value: 'pendiente',      label: 'Pendiente',         color: 'text-yellow-700', dot: 'bg-yellow-400' },
  { value: 'procesando',     label: 'Procesando',        color: 'text-blue-700',   dot: 'bg-blue-400'   },
  { value: 'enviado',        label: 'Enviado',           color: 'text-indigo-700', dot: 'bg-indigo-400' },
  { value: 'entregado',      label: 'Entregado',         color: 'text-green-700',  dot: 'bg-green-500'  },
  { value: 'cancelado',      label: 'Cancelado',         color: 'text-red-700',    dot: 'bg-red-400'    },
]

export default function OrderStatusSelector({ pedidoId, estadoActual }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [estado, setEstado] = useState<Estado>(estadoActual)
  const [feedback, setFeedback] = useState<'idle' | 'ok' | 'error'>('idle')
  const [open, setOpen] = useState(false)

  // Modal de guía de rastreo
  const [showGuiaModal, setShowGuiaModal] = useState(false)
  const [guiaRastreo, setGuiaRastreo] = useState('')
  const [paqueteria, setPaqueteria] = useState('')
  const [pendingEstado, setPendingEstado] = useState<Estado | null>(null)

  const currentConfig = ESTADOS.find((e) => e.value === estado) ?? ESTADOS[0]

  async function enviarCambioEstado(nuevoEstado: Estado, guia?: string, pkg?: string) {
    const prevEstado = estado
    setEstado(nuevoEstado)
    setFeedback('idle')

    try {
      const res = await fetch(`/api/admin/pedidos/${pedidoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: nuevoEstado,
          ...(guia ? { guiaRastreo: guia } : {}),
          ...(pkg  ? { paqueteria: pkg  } : {}),
        }),
      })

      if (!res.ok) {
        setEstado(prevEstado)
        setFeedback('error')
        return
      }

      setFeedback('ok')
      startTransition(() => { router.refresh() })
      setTimeout(() => setFeedback('idle'), 2500)
    } catch {
      setEstado(prevEstado)
      setFeedback('error')
    }
  }

  async function handleSelect(nuevoEstado: Estado) {
    if (nuevoEstado === estado) { setOpen(false); return }
    setOpen(false)

    if (nuevoEstado === 'enviado') {
      // Mostrar modal para capturar guía antes de confirmar
      setPendingEstado(nuevoEstado)
      setShowGuiaModal(true)
      return
    }

    await enviarCambioEstado(nuevoEstado)
  }

  async function handleConfirmGuia() {
    if (!pendingEstado) return
    setShowGuiaModal(false)
    await enviarCambioEstado(pendingEstado, guiaRastreo, paqueteria)
    setGuiaRastreo('')
    setPaqueteria('')
    setPendingEstado(null)
  }

  function handleCancelGuia() {
    setShowGuiaModal(false)
    setGuiaRastreo('')
    setPaqueteria('')
    setPendingEstado(null)
  }

  return (
    <>
      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          disabled={isPending}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-all cursor-pointer disabled:opacity-60 shadow-sm"
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${currentConfig.dot}`} />
          <span>{currentConfig.label}</span>
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Feedback inline */}
        {feedback === 'ok' && (
          <span className="ml-3 inline-flex items-center gap-1 text-xs text-green-600 font-medium animate-pulse">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Guardado
          </span>
        )}
        {feedback === 'error' && (
          <span className="ml-3 inline-flex items-center gap-1 text-xs text-red-600 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Error al guardar
          </span>
        )}

        {/* Dropdown */}
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <ul className="absolute left-0 top-full mt-1.5 z-20 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1">
              {ESTADOS.map((e) => (
                <li key={e.value}>
                  <button
                    type="button"
                    onClick={() => void handleSelect(e.value)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                      e.value === estado
                        ? 'bg-amber-50 text-amber-800 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${e.dot}`} />
                    {e.label}
                    {e.value === estado && (
                      <svg className="w-3.5 h-3.5 ml-auto text-amber-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {e.value === 'enviado' && e.value !== estado && (
                      <svg className="w-3.5 h-3.5 ml-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Modal de guía de rastreo */}
      {showGuiaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Marcar como enviado</h3>
                <p className="text-xs text-gray-500 mt-0.5">Se enviará un correo al cliente</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Paquetería <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={paqueteria}
                  onChange={(e) => setPaqueteria(e.target.value)}
                  placeholder="DHL, FedEx, Estafeta, Correos de México…"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Número de guía <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={guiaRastreo}
                  onChange={(e) => setGuiaRastreo(e.target.value)}
                  placeholder="Ej. 1Z999AA10123456784"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  Si no tienes la guía aún, puedes dejarla en blanco. El cliente recibirá el correo de todas formas.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancelGuia}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmGuia()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Confirmar y notificar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
