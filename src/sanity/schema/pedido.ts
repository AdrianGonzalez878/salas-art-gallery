import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pedido',
  title: 'Pedido',
  type: 'document',
  fields: [
    defineField({
      name: 'numeroPedido',
      title: 'Número de Pedido',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: () => `PED-${Date.now()}`,
    }),
    defineField({
      name: 'cliente',
      title: 'Información del Cliente',
      type: 'object',
      fields: [
        {
          name: 'nombre',
          type: 'string',
          title: 'Nombre Completo',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'email',
          type: 'string',
          title: 'Email',
          validation: (Rule) => Rule.required().email(),
        },
        {
          name: 'telefono',
          type: 'string',
          title: 'Teléfono',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'direccionEnvio',
      title: 'Dirección de Envío',
      type: 'object',
      fields: [
        {
          name: 'calle',
          type: 'string',
          title: 'Calle y Número',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'colonia',
          type: 'string',
          title: 'Colonia',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'ciudad',
          type: 'string',
          title: 'Ciudad',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'estado',
          type: 'string',
          title: 'Estado',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'codigoPostal',
          type: 'string',
          title: 'Código Postal',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'pais',
          type: 'string',
          title: 'País',
          initialValue: 'México',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productos',
      title: 'Productos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'producto',
              type: 'reference',
              to: [{ type: 'producto' }],
              title: 'Producto',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'cantidad',
              type: 'number',
              title: 'Cantidad',
              validation: (Rule) => Rule.required().positive().integer(),
            },
            {
              name: 'precio',
              type: 'number',
              title: 'Precio Unitario',
              validation: (Rule) => Rule.required().positive(),
            },
          ],
          preview: {
            select: {
              title: 'producto.titulo',
              cantidad: 'cantidad',
              precio: 'precio',
            },
            prepare({ title, cantidad, precio }) {
              return {
                title: title || 'Producto sin nombre',
                subtitle: `${cantidad} x $${precio?.toLocaleString() || 0}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'envio',
      title: 'Costo de Envío',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'descuentoCupon',
      title: 'Descuento por cupón (MXN)',
      type: 'number',
      description: 'Monto descontado si el cliente usó un cupón de Sanity',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'cuponCodigo',
      title: 'Código de cupón aplicado',
      type: 'string',
      description: 'Vacío si no hubo cupón',
    }),
    defineField({
      name: 'codigoColaboracion',
      title: 'Código de colaboración',
      type: 'string',
      description:
        'Código usado en checkout para saber qué exposición o colaborador vendió la obra. No afecta el precio.',
    }),
    defineField({
      name: 'colaboracionNombre',
      title: 'Nombre del colaborador / exposición',
      type: 'string',
      description: 'Etiqueta guardada al momento de la venta (histórico).',
    }),
    defineField({
      name: 'exposicionColaboracionTitulo',
      title: 'Exposición de colaboración',
      type: 'string',
      description: 'Título de la exposición vinculada al código, si existía.',
    }),
    defineField({
      name: 'total',
      title: 'Total',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'estado',
      title: 'Estado del Pedido',
      type: 'string',
      options: {
        list: [
          { title: 'Pendiente de pago', value: 'pendiente_pago' },
          { title: 'Pendiente', value: 'pendiente' },
          { title: 'Procesando', value: 'procesando' },
          { title: 'Enviado', value: 'enviado' },
          { title: 'Entregado', value: 'entregado' },
          { title: 'Cancelado', value: 'cancelado' },
        ],
        layout: 'radio',
      },
      initialValue: 'pendiente',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metodoPago',
      title: 'Método de Pago',
      type: 'string',
      options: {
        list: [
          { title: 'Efectivo', value: 'efectivo' },
          { title: 'Tarjeta de Crédito', value: 'tarjeta' },
          { title: 'Transferencia', value: 'transferencia' },
          { title: 'PayPal', value: 'paypal' },
          { title: 'Otro', value: 'otro' },
        ],
      },
    }),
    defineField({
      name: 'regaloTitulo',
      title: 'Regalo incluido',
      type: 'string',
      description: 'Título del regalo por promoción aplicada al pedido',
    }),
    defineField({
      name: 'regaloImagenUrl',
      title: 'Imagen del regalo (URL)',
      type: 'url',
      description: 'URL de la imagen del regalo',
    }),
    defineField({
      name: 'guiaRastreo',
      title: 'Número de guía / rastreo',
      type: 'string',
      description: 'Número de guía de la paquetería para rastrear el envío',
    }),
    defineField({
      name: 'paqueteria',
      title: 'Paquetería',
      type: 'string',
      description: 'Nombre de la paquetería (ej. DHL, FedEx, Estafeta, Correos de México)',
    }),
    defineField({
      name: 'notas',
      title: 'Notas',
      type: 'text',
      description: 'Notas adicionales sobre el pedido',
    }),
  ],
  preview: {
    select: {
      numero: 'numeroPedido',
      cliente: 'cliente.nombre',
      estado: 'estado',
      total: 'total',
      fecha: '_createdAt',
    },
    prepare({ numero, cliente, estado, total, fecha }) {
      const fechaFormateada = fecha
        ? new Date(fecha).toLocaleDateString('es-MX')
        : ''
      return {
        title: numero || 'Sin número',
        subtitle: `${cliente || 'Sin cliente'} - $${total?.toLocaleString() || 0} - ${estado || 'pendiente'}`,
        media: () => '📦',
      }
    },
  },
  orderings: [
    {
      title: 'Fecha de Creación (Más reciente)',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Fecha de Creación (Más antiguo)',
      name: 'createdAtAsc',
      by: [{ field: '_createdAt', direction: 'asc' }],
    },
    {
      title: 'Total (Mayor a menor)',
      name: 'totalDesc',
      by: [{ field: 'total', direction: 'desc' }],
    },
  ],
})



