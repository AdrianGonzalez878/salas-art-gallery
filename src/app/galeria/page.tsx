import type { Metadata } from 'next'
import AnimateInView from '@/components/AnimateInView'
import VisitaGaleriaForm from '@/components/VisitaGaleriaForm'

export const metadata: Metadata = {
  title: 'Visita la galería | Salas Art Gallery',
  description:
    'Programa una visita privada a Salas Art Gallery. Nuestro espacio físico atiende con cita previa para una experiencia personalizada.',
  alternates: {
    canonical: '/galeria',
  },
}

const pasos = [
  {
    titulo: 'Solicita tu visita',
    desc: 'Completa el formulario con la fecha y horario que prefieras.',
  },
  {
    titulo: 'Confirmamos contigo',
    desc: 'Te contactamos para validar disponibilidad y coordinar los detalles.',
  },
  {
    titulo: 'Vive la experiencia',
    desc: 'Recorre la galería con atención personalizada en un espacio reservado.',
  },
]

export default function GaleriaPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <AnimateInView y={16}>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-0.5 bg-violet-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-violet-700">
                  Espacio privado
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-5">
                Visita la galería
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Salas Art Gallery no es un espacio de acceso libre al público. Las visitas al showroom
                se programan con cita previa para ofrecerte una experiencia tranquila y personalizada.
              </p>
            </div>
          </AnimateInView>
        </div>
      </section>

      <AnimateInView as="section" className="py-14 sm:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pasos.map((paso, idx) => (
              <div
                key={paso.titulo}
                className="rounded-2xl border border-gray-100 bg-gray-50/80 p-6 sm:p-7"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800 mb-4">
                  {idx + 1}
                </span>
                <h2 className="font-display text-lg font-bold text-gray-900 mb-2">{paso.titulo}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateInView>

      <AnimateInView as="section" className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Programa tu visita
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Cuéntanos cuándo te gustaría venir. Revisaremos la agenda de la galería y te
                responderemos para confirmar tu cita.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-violet-600 shrink-0" aria-hidden>•</span>
                  <span>Visitas con horario acordado previamente</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-600 shrink-0" aria-hidden>•</span>
                  <span>Ideal para conocer obras en persona o recibir asesoría</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-600 shrink-0" aria-hidden>•</span>
                  <span>Grupos pequeños (máximo 12 personas por solicitud)</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
              <VisitaGaleriaForm />
            </div>
          </div>
        </div>
      </AnimateInView>
    </div>
  )
}
