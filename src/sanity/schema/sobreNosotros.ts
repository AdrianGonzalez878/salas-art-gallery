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
      initialValue: 'Nuestra Historia',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'subtitulo',
      title: 'Subtítulo',
      type: 'string',
      description: 'Texto corto debajo del título',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'imagenBanner',
      title: 'Imagen del banner (página Sobre nosotros)',
      type: 'image',
      description: 'Imagen horizontal para el banner de la página "Sobre nosotros". Recomendado: 1920×600 px o similar en formato horizontal.',
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
      title: 'Historia',
      type: 'text',
      description: 'La historia de Salas Art Gallery, cómo se fundó, etc.',
      validation: (Rule) => Rule.required().min(100).max(1000),
    }),
    defineField({
      name: 'galeria',
      title: 'Galería de Fotos',
      type: 'array',
      description: 'Fotos de la dueña, el taller, las joyas, etc.',
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
      title: 'Estadísticas Destacadas',
      type: 'array',
      description: 'Números que resaltan el negocio (clientes satisfechos, productos vendidos, etc.)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'numero',
              type: 'string',
              title: 'Número',
              description: 'Ej: "500+", "10", "1000+"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'etiqueta',
              type: 'string',
              title: 'Etiqueta',
              description: 'Ej: "Clientes Satisfechos", "Años de Experiencia"',
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
