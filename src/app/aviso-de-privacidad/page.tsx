import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { configuracionSitioQuery } from '@/sanity/lib/queries'
import type { ConfiguracionSitio } from '@/sanity/lib/types'
import { formatWhatsAppDisplay, whatsappUrl } from '@/lib/whatsapp'

export const metadata = {
  title: 'Aviso de privacidad',
  description: 'Aviso de privacidad y protección de datos personales de Salas Art Gallery.',
  alternates: { canonical: '/aviso-de-privacidad' },
}

export default async function AvisoPrivacidadPage() {
  const config = await sanityFetch<ConfiguracionSitio | null>(configuracionSitioQuery)
  const contactWhatsappUrl = whatsappUrl(config?.numeroWhatsApp)
  const contactWhatsappDisplay = formatWhatsAppDisplay(config?.numeroWhatsApp)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="text-sm text-violet-700 hover:text-violet-900 font-medium mb-8 inline-block">
          ← Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Aviso de privacidad</h1>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4 text-sm sm:text-base leading-relaxed">
          <p><strong>Última actualización: 28 de julio de 2026.</strong></p>
          <p>
            <strong>Salas Art Gallery</strong> es responsable del uso y protección de los datos personales que nos
            proporcionas al navegar en este sitio, solicitar una visita o adquirir una obra.
          </p>
          <p>
            Podemos recabar nombre, correo electrónico, teléfono, dirección de envío y datos relacionados con tu
            solicitud de visita o compra. Los utilizamos para atenderte, procesar pedidos, coordinar envíos,
            confirmar visitas y dar seguimiento a tu solicitud.
          </p>
          <p>
            No vendemos tus datos ni los compartimos para fines comerciales ajenos a Salas Art Gallery. Solo podrán
            compartirse cuando sea indispensable para procesar un pago o envío, con proveedores como Mercado Pago o
            empresas de paquetería, quienes aplican sus propias políticas de privacidad.
          </p>
          <p>
            Puedes solicitar acceso, rectificación, cancelación u oposición al tratamiento de tus datos escribiendo a{' '}
            <a href="mailto:salasartgallery.casadearte@gmail.com" className="text-violet-700 hover:underline">
              salasartgallery.casadearte@gmail.com
            </a>
            {' '}o por WhatsApp al{' '}
            <a href={contactWhatsappUrl} className="text-violet-700 hover:underline">
              {contactWhatsappDisplay}
            </a>.
          </p>
          <p className="text-gray-500 text-xs pt-4">
            Este aviso puede actualizarse. Te recomendamos revisarlo periódicamente.
          </p>
        </div>
      </div>
    </div>
  )
}
