import Link from 'next/link'

export const metadata = {
  title: 'Términos y condiciones | Conchita Plata',
  description: 'Términos y condiciones de uso de la tienda Conchita Plata.',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 font-medium mb-8 inline-block">
          ← Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Términos y condiciones</h1>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4 text-sm sm:text-base leading-relaxed">
          <p>
            Al usar el sitio web de <strong>Conchita Plata</strong> y realizar pedidos, aceptas estos términos.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Los precios publicados incluyen IVA y pueden cambiar sin previo aviso, salvo pedidos ya confirmados y pagados.</li>
            <li>Las piezas están sujetas a disponibilidad. En caso de no poder surtir un artículo, te contactaremos.</li>
            <li>Los envíos se coordinan según la información de contacto y dirección que proporciones.</li>
            <li>Los pagos se procesan de forma segura a través de Mercado Pago.</li>
            <li>Las promociones, envío gratis desde el monto indicado en el sitio y meses sin intereses aplican según las condiciones publicadas en cada momento.</li>
          </ul>
          <p>
            Para dudas sobre tu pedido o estos términos, contáctanos por{' '}
            <a href="mailto:conchita-plata04@hotmail.com" className="text-amber-700 hover:underline">
              correo
            </a>{' '}
            o WhatsApp.
          </p>
        </div>
      </div>
    </div>
  )
}
