import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shopTheLook',
  title: 'Compra el Look',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título de la Sección',
      type: 'string',
      description: 'Ej: "Compra el Look", "Shop the Look"',
      initialValue: 'COMPRA EL LOOK',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      description: 'Texto descriptivo debajo del título (opcional)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'imagenModelo',
      title: 'Imagen de Modelo',
      type: 'image',
      description: 'Foto de modelo usando las joyas (recomendado: 1200x1600px)',
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
      name: 'productos',
      title: 'Productos Destacados',
      type: 'array',
      description: 'Agrega hasta 5 productos con su posición en la imagen',
      validation: (Rule) => Rule.required().min(1).max(5),
      of: [
        {
          type: 'object',
          title: 'Producto Destacado',
          fields: [
            {
              name: 'producto',
              title: 'Producto',
              type: 'reference',
              to: [{ type: 'producto' }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'posicionX',
              title: 'Posición Horizontal (%)',
              type: 'number',
              description: 'Posición horizontal del botón (0-100%)',
              validation: (Rule) => Rule.required().min(0).max(100),
              initialValue: 50,
            },
            {
              name: 'posicionY',
              title: 'Posición Vertical (%)',
              type: 'number',
              description: 'Posición vertical del botón (0-100%)',
              validation: (Rule) => Rule.required().min(0).max(100),
              initialValue: 50,
            },
          ],
          preview: {
            select: {
              titulo: 'producto.titulo',
              media: 'producto.imagenPrincipal',
              x: 'posicionX',
              y: 'posicionY',
            },
            prepare({ titulo, media, x, y }) {
              return {
                title: titulo || 'Producto',
                subtitle: `Posición: ${x}%, ${y}%`,
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      description: 'Mostrar esta sección en la página principal',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      titulo: 'titulo',
      media: 'imagenModelo',
      activo: 'activo',
    },
    prepare({ titulo, media, activo }) {
      return {
        title: titulo,
        subtitle: activo ? '✅ Activo' : '❌ Inactivo',
        media,
      }
    },
  },
})
