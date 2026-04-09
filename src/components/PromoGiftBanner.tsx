'use client'

import { useEffect, useState } from 'react'
import type { Promocion } from '@/sanity/lib/types'

interface Props {
  subtotal: number
}

export default function PromoGiftBanner({ subtotal }: Props) {
  const [promociones, setPromociones] = useState<Promocion[]>([])

  useEffect(() => {
    fetch('/api/promociones')
      .then((r) => r.json())
      .then((data: Promocion[]) => setPromociones(data))
      .catch(() => {})
  }, [])

  if (promociones.length === 0) return null

  return (
    <div className="space-y-3 mb-4">
      {promociones.map((promo) => {
        const falta = promo.montoMinimo - subtotal
        const alcanzada = subtotal >= promo.montoMinimo
        const porcentaje = Math.min(100, Math.round((subtotal / promo.montoMinimo) * 100))

        return (
          <div
            key={promo._id}
            className={`rounded-xl border px-4 py-3 transition-all ${
              alcanzada
                ? 'bg-green-50 border-green-300'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            {alcanzada ? (
              /* ── Promoción desbloqueada ── */
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">🎁</span>
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    ¡Regalo desbloqueado!
                  </p>
                  <p className="text-sm text-green-700 mt-0.5">
                    {promo.titulo}
                  </p>
                  {promo.descripcion && (
                    <p className="text-xs text-green-600 mt-0.5">{promo.descripcion}</p>
                  )}
                </div>
              </div>
            ) : (
              /* ── Progreso hacia la promoción ── */
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-amber-800 flex items-center gap-1">
                    <span>🎁</span>
                    <span>
                      Te faltan{' '}
                      <span className="font-bold">${falta.toLocaleString()}</span>{' '}
                      para obtener: <span className="font-semibold">{promo.titulo}</span>
                    </span>
                  </p>
                  <span className="text-xs text-amber-700 font-semibold shrink-0 ml-2">
                    {porcentaje}%
                  </span>
                </div>
                {/* Barra de progreso */}
                <div className="w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
