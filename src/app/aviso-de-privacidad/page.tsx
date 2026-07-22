import Link from 'next/link'

export const metadata = {
  title: 'Aviso de privacidad | Salas Art Gallery',
  description: 'Aviso de privacidad y protección de datos personales.',
}

export default function AvisoPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 font-medium mb-8 inline-block">
          ← Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Aviso de privacidad</h1>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>Salas Art Gallery</strong> se compromete a proteger la privacidad de los datos personales que nos
            proporcionas al usar nuestro sitio web o realizar una compra.
          </p>
          <p>
            Los datos que recabamos (nombre, correo electrónico, teléfono, dirección de envío) se utilizan únicamente
            para procesar pedidos, contactarte respecto a tu compra y mejorar tu experiencia como cliente.
          </p>
          <p>
            No vendemos ni compartimos tu información con terceros con fines comerciales ajenos al servicio, salvo
            cuando sea necesario para el envío o el procesamiento del pago (por ejemplo, paquetería o Mercado Pago),
            conforme a sus propias políticas.
          </p>
          <p>
            Puedes solicitar acceso, rectificación o eliminación de tus datos escribiendo a{' '}
            <a href="mailto:contacto@salasartgallery.com" className="text-amber-700 hover:underline">
              contacto@salasartgallery.com
            </a>
            .
          </p>
          <p className="text-gray-500 text-xs pt-4">
            Este aviso puede actualizarse. Te recomendamos revisarlo periódicamente.
          </p>
        </div>
      </div>
    </div>
  )
}
