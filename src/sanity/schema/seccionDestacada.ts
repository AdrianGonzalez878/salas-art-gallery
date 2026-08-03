import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seccionDestacada',
  title: 'Sección Destacada',
  type: 'document',
  fields: [
    defineField({
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      description: 'Mostrar esta sección en la página principal',
      initialValue: true,
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      description: 'Orden de aparición en la página (menor número = aparece primero)',
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'titulo',
      title: 'Título de la Sección',
      type: 'string',
      description: 'Ej: "Cerámica", "Óleos recientes"',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      description: 'Texto debajo del título',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'etiqueta',
      title: 'Palabra clave a mostrar',
      type: 'string',
      description:
        'Debe coincidir con una palabra clave de las obras (ej: Óleo, Cerámica, Paisaje)',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'imagenBanner',
      title: 'Imagen Banner',
      type: 'image',
      description: 'Imagen destacada de la sección',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'textoBanner',
      title: 'Texto sobre el Banner',
      type: 'string',
      description: 'Texto que aparece sobre la imagen del banner (opcional)',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'posicionTextoBanner',
      title: 'Posición del Texto en el Banner',
      type: 'string',
      options: {
        list: [
          { title: 'Izquierda', value: 'left' },
          { title: 'Centro', value: 'center' },
          { title: 'Derecha', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'mostrarBoton',
      title: 'Mostrar Botón',
      type: 'boolean',
      description: 'Mostrar botón "Ver Todos" al final del catálogo',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      titulo: 'titulo',
      etiqueta: 'etiqueta',
      activo: 'activo',
      orden: 'orden',
      media: 'imagenBanner',
    },
    prepare({ titulo, etiqueta, activo, orden, media }) {
      return {
        title: titulo || 'Sección Destacada',
        subtitle: `${activo ? '✅' : '❌'} | Orden: ${orden} | Etiqueta: ${etiqueta || 'N/A'}`,
        media,
      }
    },
  },
})
