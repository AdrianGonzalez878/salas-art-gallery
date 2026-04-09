import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'postInstagram',
  title: 'Post de Instagram',
  type: 'document',
  fields: [
    defineField({
      name: 'imagen',
      title: 'Imagen del Post',
      type: 'image',
      description: 'Captura de pantalla o imagen del post de Instagram',
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
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      description: 'Texto del post',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      description: 'Número de likes (aproximado)',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'enlace',
      title: 'Enlace al Post',
      type: 'url',
      description: 'URL del post en Instagram (opcional)',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      description: 'Orden de aparición (menor número = aparece primero)',
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      description: 'Mostrar este post en la página principal',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      titulo: 'descripcion',
      media: 'imagen',
      orden: 'orden',
      activo: 'activo',
      likes: 'likes',
    },
    prepare({ titulo, media, orden, activo, likes }) {
      return {
        title: titulo ? titulo.substring(0, 60) + '...' : 'Post de Instagram',
        subtitle: `${activo ? '✅' : '❌'} | Orden: ${orden} | ❤️ ${likes || 0} likes`,
        media,
      }
    },
  },
})
