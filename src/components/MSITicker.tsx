'use client'

const text =
  'Hasta 3 MSI desde $5,000 MXN · Tarjeta de crédito con Mercado Pago'

export default function MSITicker() {
  return (
    <div className="w-full bg-amber-50 border-b border-amber-100 overflow-hidden">
      <div className="flex flex-nowrap py-3 md:py-4">
        {/* Una sola pista con contenido duplicado: -50% hace bucle perfecto */}
        <div className="flex animate-marquee-half shrink-0 flex-nowrap gap-6 pr-6 md:gap-8 md:pr-8">
          {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((i, idx) => (
            <span
              key={idx}
              className="whitespace-nowrap text-base md:text-lg font-semibold text-amber-900"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
