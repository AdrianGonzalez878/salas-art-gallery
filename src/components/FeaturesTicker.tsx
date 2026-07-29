'use client'

const iconWrapClass =
  'bg-gradient-to-br from-fuchsia-100 via-violet-100 to-sky-100 text-violet-900 ring-2 ring-violet-200/60'

const items = [
  {
    label: 'Calidad Garantizada',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    label: 'Envío Rápido y Seguro',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Hecho con Amor',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    label: 'Piezas Únicas',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
]

const repeated = [...items, ...items, ...items, ...items]

export default function FeaturesTicker() {
  return (
    <div className="w-full bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="flex flex-nowrap py-4">
        <div className="flex animate-marquee-half shrink-0 flex-nowrap gap-10 pr-10">
          {repeated.map((item, idx) => (
            <span
              key={idx}
              className="whitespace-nowrap text-base font-semibold text-gray-900 flex items-center gap-3"
            >
              <span
                className={`inline-flex items-center justify-center rounded-full p-1.5 shrink-0 ${iconWrapClass}`}
              >
                {item.icon}
              </span>
              {item.label}
              <span className="text-gray-300 ml-6">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
