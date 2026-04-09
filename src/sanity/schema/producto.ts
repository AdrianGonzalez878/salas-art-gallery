import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'producto',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'titulo',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'precio',
      title: 'Precio',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'tieneDescuento',
      title: '¿Tiene descuento?',
      type: 'boolean',
      description: 'Activar para mostrar este producto en la página de Promociones',
      initialValue: false,
    }),
    defineField({
      name: 'tipoDescuento',
      title: 'Tipo de descuento',
      type: 'string',
      options: {
        list: [
          { title: 'Porcentaje (%)', value: 'porcentaje' },
          { title: 'Monto fijo ($)', value: 'monto' },
        ],
        layout: 'radio',
      },
      initialValue: 'porcentaje',
      hidden: ({ parent }) => !parent?.tieneDescuento,
      validation: (Rule) =>
        Rule.custom((tipo, context) => {
          const parent = context.parent as any
          if (parent?.tieneDescuento && !tipo) {
            return 'Debes seleccionar un tipo de descuento'
          }
          return true
        }),
    }),
    defineField({
      name: 'valorDescuento',
      title: 'Valor del descuento',
      type: 'number',
      description: 'Ej: 20 para 20%, o 150 para $150 de descuento',
      hidden: ({ parent }) => !parent?.tieneDescuento,
      validation: (Rule) =>
        Rule.custom((valor, context) => {
          const parent = context.parent as any
          if (parent?.tieneDescuento) {
            if (valor === undefined || valor === null) {
              return 'Debes ingresar un valor de descuento'
            }
            if (valor <= 0) {
              return 'El valor debe ser mayor a 0'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Imagen Principal',
      type: 'image',
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
      name: 'galeria',
      title: 'Galería de Imágenes',
      type: 'array',
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
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Anillos', value: 'anillos' },
          { title: 'Collares', value: 'collares' },
          { title: 'Aretes', value: 'aretes' },
          { title: 'Pulseras', value: 'pulseras' },
          { title: 'Dijes', value: 'dijes' },
          { title: 'Cadenas', value: 'cadenas' },
          { title: 'Juegos (Dijes y Aretes)', value: 'juegos' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      validation: (Rule) => Rule.required().min(50).max(500),
    }),
    defineField({
      name: 'disponible',
      title: 'Disponible',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'ventas',
      title: 'Cantidad de Ventas',
      type: 'number',
      description: 'Número de veces que se ha vendido este producto (para mostrar en "Lo Más Vendido")',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).integer(),
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      media: 'imagenPrincipal',
      categoria: 'categoria',
      tieneDescuento: 'tieneDescuento',
      tipoDescuento: 'tipoDescuento',
      valorDescuento: 'valorDescuento',
    },
    prepare(selection) {
      const { categoria, tieneDescuento, tipoDescuento, valorDescuento } = selection
      let subtitle = categoria ? categoria.charAt(0).toUpperCase() + categoria.slice(1) : ''
      
      if (tieneDescuento && tipoDescuento && valorDescuento) {
        const descuentoText = tipoDescuento === 'porcentaje' 
          ? `${valorDescuento}% OFF` 
          : `$${valorDescuento} OFF`
        subtitle = `${subtitle} • 🏷️ ${descuentoText}`
      }
      
      return {
        ...selection,
        subtitle,
      }
    },
  },
})

