import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sobreNosotros',
  title: 'Sobre Nosotros',
  type: 'document',
  fields: [
    defineField({
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      description: 'Solo puede haber una sección "Sobre Nosotros" activa a la vez',
      initialValue: true,
    }),
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      initialValue: 'Un espacio para encontrarse con el arte',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'subtitulo',
      title: 'Subtítulo',
      type: 'string',
      description: 'Una frase breve que presente la mirada de Salas Art Gallery',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'imagenBanner',
      title: 'Imagen del banner (página Sobre nosotros)',
      type: 'image',
      description: 'Imagen del espacio, una exposición o una obra en contexto. Recomendado: formato horizontal de 1920×900 px.',
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
      name: 'historia',
      title: 'Texto sobre la galería',
      type: 'text',
      description: 'Describe la propuesta de Salas Art Gallery, su relación con los artistas y el arte contemporáneo.',
      validation: (Rule) => Rule.required().min(100).max(1000),
    }),
    defineField({
      name: 'galeria',
      title: 'Imágenes del espacio',
      type: 'array',
      description: 'Fotografías de la galería, exposiciones, artistas u obras en contexto.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'estadisticas',
      title: 'Hitos de la galería',
      type: 'array',
      description: 'Datos opcionales sobre la galería, por ejemplo: exposiciones, artistas colaboradores o años de trayectoria.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'numero',
              type: 'string',
              title: 'Número',
              description: 'Ej: "20+", "8", "2024"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'etiqueta',
              type: 'string',
              title: 'Etiqueta',
              description: 'Ej: "Artistas colaboradores", "Exposiciones realizadas"',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              numero: 'numero',
              etiqueta: 'etiqueta',
            },
            prepare({ numero, etiqueta }) {
              return {
                title: `${numero} - ${etiqueta}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
  ],
  preview: {
    select: {
      titulo: 'titulo',
      activo: 'activo',
    },
    prepare({ titulo, activo }) {
      return {
        title: titulo || 'Sobre Nosotros',
        subtitle: activo ? '✅ Activo' : '❌ Inactivo',
      }
    },
  },
})
