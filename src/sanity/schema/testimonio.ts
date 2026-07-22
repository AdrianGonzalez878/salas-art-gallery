import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonio',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre de la clienta',
      type: 'string',
      description: 'Ej: Mariana G.',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'texto',
      title: 'Texto del testimonio',
      type: 'text',
      description: 'Lo que dice la clienta sobre Salas Art Gallery',
      validation: (Rule) => Rule.required().min(20).max(300),
    }),
    defineField({
      name: 'estrellas',
      title: 'Calificación (estrellas)',
      type: 'number',
      description: 'Del 1 al 5',
      initialValue: 5,
      options: {
        list: [
          { title: '⭐', value: 1 },
          { title: '⭐⭐', value: 2 },
          { title: '⭐⭐⭐', value: 3 },
          { title: '⭐⭐⭐⭐', value: 4 },
          { title: '⭐⭐⭐⭐⭐', value: 5 },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'activo',
      title: 'Mostrar en el sitio',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'orden',
      title: 'Orden de aparición',
      type: 'number',
      description: 'Número menor aparece primero. Ej: 1, 2, 3',
      initialValue: 1,
      validation: (Rule) => Rule.integer().positive(),
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      estrellas: 'estrellas',
      activo: 'activo',
    },
    prepare({ title, estrellas, activo }) {
      const stars = '⭐'.repeat(estrellas ?? 5)
      return {
        title: title || 'Sin nombre',
        subtitle: `${stars} ${activo ? '· Activo' : '· Oculto'}`,
      }
    },
  },
})
