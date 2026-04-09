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
      initialValue: 'Joyería Excepcional',
    }),
    defineField({
      name: 'subtitulo',
      title: 'Subtítulo',
      type: 'text',
      rows: 3,
      initialValue: 'Descubre nuestra colección única de anillos, collares, aretes y más. Cada pieza está diseñada con pasión y atención al detalle.',
    }),
    defineField({
      name: 'imagenesCarrusel',
      title: 'Imágenes del Carrusel',
      type: 'array',
      description: 'Agrega de 1 a 5 slides. Cada slide tiene una imagen para desktop (16:9) y otra para móvil (1:1 o 4:5)',
      validation: (Rule) => Rule.required().min(1).max(5),
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
              description: 'Imagen cuadrada o vertical para móvil (1080x1080px o 1080x1350px recomendado)',
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
                subtitle: '🖥️ Desktop + 📱 Móvil',
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
      initialValue: 'Ver Productos',
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
      initialValue: 'Explorar Categorías',
    }),
    defineField({
      name: 'hrefBotonSecundario',
      title: 'Enlace Botón Secundario',
      type: 'string',
      initialValue: '/productos?categoria=anillos',
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
      media: 'imagenesCarrusel.0',
      activo: 'activo',
    },
    prepare(selection) {
      const { activo } = selection
      return {
        ...selection,
        subtitle: activo ? 'Activo' : 'Inactivo',
      }
    },
  },
})

