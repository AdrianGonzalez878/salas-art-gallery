import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'paginaArtistas',
  title: 'Página Artistas',
  type: 'document',
  fields: [
    defineField({
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      description: 'Solo puede haber una configuración activa para /artistas',
      initialValue: true,
    }),
    defineField({
      name: 'album',
      title: 'Álbum de fotos (sección final)',
      type: 'array',
      description:
        'Fotos que rotan solas al final de /artistas. Sin texto. Recomendado: horizontal 1600×900 px.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'textoCierreSecundario',
      title: 'Texto secundario (visita)',
      type: 'text',
      rows: 2,
      description: 'Texto junto al botón de agendar visita, debajo del álbum.',
      initialValue:
        'Programa una visita a nuestro espacio y descubre el lugar donde el arte sucede.',
    }),
  ],
  preview: {
    select: {
      activo: 'activo',
      media: 'album.0',
    },
    prepare({ activo, media }) {
      return {
        title: 'Página Artistas',
        subtitle: activo ? '✅ Activo' : '❌ Inactivo',
        media,
      }
    },
  },
})
