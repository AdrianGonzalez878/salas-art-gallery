import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cupon',
  title: 'Cupón de descuento',
  type: 'document',
  fields: [
    defineField({
      name: 'codigo',
      title: 'Código',
      type: 'string',
      description: 'Lo que el cliente escribe en checkout (ej. VERANO2025). Se compara sin importar mayúsculas.',
      validation: (Rule) =>
        Rule.required().custom((codigo) => {
          if (!codigo || !String(codigo).trim()) return 'Ingresa un código'
          return true
        }),
    }),
    defineField({
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      description: 'Desactiva para dejar de aceptar este cupón sin borrarlo',
      initialValue: true,
    }),
    defineField({
      name: 'tipoDescuento',
      title: 'Tipo de descuento',
      type: 'string',
      options: {
        list: [
          { title: 'Porcentaje sobre subtotal + envío', value: 'porcentaje' },
          { title: 'Monto fijo (MXN)', value: 'monto' },
        ],
        layout: 'radio',
      },
      initialValue: 'porcentaje',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'valor',
      title: 'Valor',
      type: 'number',
      description: 'Ej: 10 = 10% o $10 según el tipo. El descuento no puede superar subtotal + envío.',
      validation: (Rule) =>
        Rule.required()
          .positive()
          .error('Debe ser un número mayor a 0'),
    }),
    defineField({
      name: 'montoMinimo',
      title: 'Compra mínima (subtotal, MXN)',
      type: 'number',
      description: 'Opcional. Solo aplica si el subtotal del carrito (sin envío) es mayor o igual a este monto.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'fechaInicio',
      title: 'Válido desde',
      type: 'datetime',
      description: 'Opcional. Si lo dejas vacío, aplica desde ya.',
    }),
    defineField({
      name: 'fechaFin',
      title: 'Válido hasta',
      type: 'datetime',
      description: 'Opcional. Si lo dejas vacío, no expira por fecha.',
    }),
  ],
  preview: {
    select: {
      codigo: 'codigo',
      tipoDescuento: 'tipoDescuento',
      valor: 'valor',
      activo: 'activo',
      montoMinimo: 'montoMinimo',
    },
    prepare({ codigo, tipoDescuento, valor, activo, montoMinimo }) {
      const tipo = tipoDescuento === 'monto' ? `$${valor}` : `${valor}%`
      const min = montoMinimo ? ` · min $${Number(montoMinimo).toLocaleString()}` : ''
      return {
        title: codigo || 'Sin código',
        subtitle: `${activo ? '✅' : '❌'} ${tipo}${min}`,
      }
    },
  },
})
