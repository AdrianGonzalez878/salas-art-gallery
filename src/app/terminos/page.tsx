import Link from 'next/link'

export const metadata = {
  title: 'Términos y condiciones | Salas Art Gallery',
  description: 'Términos y condiciones de uso de la tienda Salas Art Gallery.',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="text-sm text-violet-700 hover:text-violet-900 font-medium mb-8 inline-block">
          ← Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Términos y condiciones</h1>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4 text-sm sm:text-base leading-relaxed">
          <p><strong>Última actualización: 28 de julio de 2026.</strong></p>
          <p>
            Al usar el sitio web de <strong>Salas Art Gallery</strong>, solicitar una visita o realizar un pedido,
            aceptas estos términos y condiciones.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Las obras son piezas únicas y están sujetas a disponibilidad. Si una obra ya no está disponible, te contactaremos para informarte y acordar la mejor alternativa.</li>
            <li>Los precios, promociones y condiciones de envío pueden cambiar sin previo aviso; los pedidos ya confirmados y pagados conservan las condiciones aplicables al momento de la compra.</li>
            <li>Los envíos se coordinan con la información de contacto y dirección que proporciones. Los plazos pueden variar según el destino, las características y el embalaje de la obra.</li>
            <li>Los pagos se procesan de forma segura a través de Mercado Pago.</li>
            <li>Las visitas a la galería son con cita previa. Una solicitud de visita no constituye una confirmación hasta que Salas Art Gallery la confirme por correo o WhatsApp.</li>
            <li>Las imágenes de las obras procuran representar fielmente cada pieza; sin embargo, el color puede variar según la pantalla del dispositivo.</li>
          </ul>
          <p>
            Para dudas sobre una obra, pedido o estos términos, escríbenos a{' '}
            <a href="mailto:salasartgallery.casadearte@gmail.com" className="text-violet-700 hover:underline">
              salasartgallery.casadearte@gmail.com
            </a>{' '}
            {' '}o por WhatsApp al{' '}
            <a href="https://wa.me/529515471306" className="text-violet-700 hover:underline">
              +52 951 547 1306
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
