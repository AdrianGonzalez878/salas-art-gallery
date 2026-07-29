import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'artista',
  title: 'Artista',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'nombre',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'foto',
      title: 'Foto / retrato',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
        },
      ],
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen corto',
      type: 'text',
      rows: 3,
      description: 'Una o dos líneas para listados y tarjetas',
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: 'biografia',
      title: 'Biografía',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [
            { title: 'Lista con viñetas', value: 'bullet' },
            { title: 'Lista numerada', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'activo',
      title: 'Visible en el sitio',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      media: 'foto',
      activo: 'activo',
    },
    prepare({ title, media, activo }) {
      return {
        title,
        subtitle: activo === false ? 'Oculto' : 'Visible',
        media,
      }
    },
  },
})
