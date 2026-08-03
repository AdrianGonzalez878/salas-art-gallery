import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título Principal',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Salas Art Gallery',
    }),
    defineField({
      name: 'subtitulo',
      title: 'Subtítulo',
      type: 'text',
      rows: 3,
      initialValue:
        'Casa de arte. Descubre obras de artistas seleccionados en litografía, óleos, cerámica, bronce y más.',
    }),
    defineField({
      name: 'tipoMedia',
      title: 'Tipo de fondo',
      type: 'string',
      description: 'Elige si el hero usa video o un carrusel de imágenes',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Carrusel de imágenes', value: 'imagenes' },
        ],
        layout: 'radio',
      },
      initialValue: 'imagenes',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoDesktop',
      title: 'Video desktop',
      type: 'file',
      description:
        'MP4 horizontal (recomendado ≤ 15–20 MB). Se muestra en tablet y escritorio.',
      options: {
        accept: 'video/mp4,video/webm',
      },
      hidden: ({ parent }) => parent?.tipoMedia !== 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { tipoMedia?: string }
          if (parent?.tipoMedia === 'video' && !value) {
            return 'Sube un video para desktop'
          }
          return true
        }),
    }),
    defineField({
      name: 'videoMobile',
      title: 'Video móvil (opcional)',
      type: 'file',
      description:
        'MP4 vertical u horizontal para móvil. Si lo dejas vacío, se usa el video desktop.',
      options: {
        accept: 'video/mp4,video/webm',
      },
      hidden: ({ parent }) => parent?.tipoMedia !== 'video',
    }),
    defineField({
      name: 'posterDesktop',
      title: 'Poster desktop (opcional)',
      type: 'image',
      description: 'Imagen que se muestra mientras carga el video en desktop',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.tipoMedia !== 'video',
    }),
    defineField({
      name: 'posterMobile',
      title: 'Poster móvil (opcional)',
      type: 'image',
      description: 'Imagen que se muestra mientras carga el video en móvil',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.tipoMedia !== 'video',
    }),
    defineField({
      name: 'imagenesCarrusel',
      title: 'Imágenes del Carrusel',
      type: 'array',
      description:
        'Agrega de 1 a 5 slides. Cada slide tiene una imagen para desktop (16:9) y otra para móvil (1:1 o 4:5)',
      hidden: ({ parent }) => parent?.tipoMedia !== 'imagenes',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { tipoMedia?: string }
          if (parent?.tipoMedia === 'imagenes') {
            if (!value || value.length < 1) {
              return 'Agrega al menos una imagen al carrusel'
            }
            if (value.length > 5) {
              return 'Máximo 5 slides'
            }
          }
          return true
        }),
      of: [
        {
          type: 'object',
          title: 'Slide',
          fields: [
            {
              name: 'imagenDesktop',
              title: 'Imagen Desktop (16:9)',
              type: 'image',
              description: 'Imagen horizontal para desktop y tablet (1920x1080px recomendado)',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'imagenMobile',
              title: 'Imagen Móvil (1:1 o 4:5)',
              type: 'image',
              description:
                'Imagen cuadrada o vertical para móvil (1080x1080px o 1080x1350px recomendado)',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo',
              description: 'Descripción de la imagen para accesibilidad',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              mediaDesktop: 'imagenDesktop',
              mediaMobile: 'imagenMobile',
              alt: 'alt',
            },
            prepare({ mediaDesktop, mediaMobile, alt }) {
              return {
                title: alt || 'Slide del carrusel',
                subtitle: 'Desktop + Móvil',
                media: mediaDesktop || mediaMobile,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'textoBotonPrincipal',
      title: 'Texto Botón Principal',
      type: 'string',
      initialValue: 'Ver obras',
    }),
    defineField({
      name: 'hrefBotonPrincipal',
      title: 'Enlace Botón Principal',
      type: 'string',
      initialValue: '/productos',
    }),
    defineField({
      name: 'textoBotonSecundario',
      title: 'Texto Botón Secundario',
      type: 'string',
      initialValue: 'Agendar una visita',
    }),
    defineField({
      name: 'hrefBotonSecundario',
      title: 'Enlace Botón Secundario',
      type: 'string',
      initialValue: '/galeria',
    }),
    defineField({
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      initialValue: true,
      description: 'Si está desactivado, se mostrará el hero por defecto',
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      media: 'imagenesCarrusel.0.imagenDesktop',
      tipoMedia: 'tipoMedia',
      activo: 'activo',
    },
    prepare({ title, media, tipoMedia, activo }) {
      const tipo = tipoMedia === 'video' ? 'Video' : 'Imágenes'
      return {
        title: title || 'Hero',
        subtitle: `${activo ? 'Activo' : 'Inactivo'} · ${tipo}`,
        media,
      }
    },
  },
})
