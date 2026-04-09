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
      title: 'Imagen del banner (página Conchita Plata)',
      type: 'image',
      description: 'Imagen horizontal para el banner de la página "Sobre Conchita Plata". Recomendado: 1920×600 px o similar en formato horizontal.',
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
      description: 'La historia de Conchita Plata, cómo se fundó, etc.',
      validation: (Rule) => Rule.required().min(100).max(1000),
    }),
    defineField({
      name: 'anosExperiencia',
      title: 'Años de Experiencia',
      type: 'number',
      description: 'Número de años en el negocio',
      validation: (Rule) => Rule.required().positive().integer(),
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
    defineField({
      name: 'mostrarBotonWhatsApp',
      title: 'Mostrar botón de WhatsApp (diseño a la medida)',
      type: 'boolean',
      description: 'Muestra un botón en la página Conchita Plata para que el cliente pregunte por diseños especiales',
      initialValue: true,
    }),
    defineField({
      name: 'textoBotonWhatsApp',
      title: 'Texto del botón WhatsApp',
      type: 'string',
      description: 'Ej: "¿Diseño a la medida?", "Solicitar diseño especial"',
      initialValue: '¿Diseño a la medida?',
      hidden: ({ parent }) => !parent?.mostrarBotonWhatsApp,
    }),
    defineField({
      name: 'numeroWhatsApp',
      title: 'Número de WhatsApp',
      type: 'string',
      description: 'Número con código de país, sin + ni espacios. Ej: 5219514634015',
      validation: (Rule) =>
        Rule.custom((valor, context) => {
          const parent = context.parent as any
          if (parent?.mostrarBotonWhatsApp && !valor) {
            return 'Ingresa el número para el enlace de WhatsApp'
          }
          return true
        }),
      hidden: ({ parent }) => !parent?.mostrarBotonWhatsApp,
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
