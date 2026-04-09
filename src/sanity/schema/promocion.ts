import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'promocion',
  title: 'Promoción de Compra Mínima',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      description: 'Ej: "Llévate un portanillos de regalo"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      description: 'Detalles de la promoción',
    }),
    defineField({
      name: 'imagenBanner',
      title: 'Imagen del Banner',
      type: 'image',
      description: 'Imagen para el banner de la promoción (recomendado: 1200x600px, horizontal)',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'montoMinimo',
      title: 'Monto mínimo de compra',
      type: 'number',
      description: 'Ej: 3000 para "Compra mínimo $3,000"',
      validation: (Rule) =>
        Rule.required()
          .positive()
          .error('Debes ingresar un monto mayor a 0'),
    }),
    defineField({
      name: 'fechaInicio',
      title: 'Fecha de inicio',
      type: 'datetime',
      description: 'Opcional: cuándo empieza la promoción',
    }),
    defineField({
      name: 'fechaFin',
      title: 'Fecha de fin',
      type: 'datetime',
      description: 'Opcional: cuándo termina la promoción',
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      description: 'Orden de aparición (menor = primero)',
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'activo',
      title: 'Activa',
      type: 'boolean',
      description: 'Mostrar esta promoción en la página',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      titulo: 'titulo',
      montoMinimo: 'montoMinimo',
      activo: 'activo',
      media: 'imagenBanner',
    },
    prepare({ titulo, montoMinimo, activo, media }) {
      const infoExtra = montoMinimo
        ? `$${montoMinimo.toLocaleString()}`
        : ''
      return {
        title: titulo,
        subtitle: `${activo ? '✅' : '❌'} Compra +${infoExtra}`,
        media,
      }
    },
  },
})
