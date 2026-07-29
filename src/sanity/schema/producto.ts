import { defineField, defineType } from 'sanity'
import { descuentoVigente } from '@/lib/descuento'
import { categoriaOptions, subcategoriaCeramicaOptions } from '@/lib/categorias'

export default defineType({
  name: 'producto',
  title: 'Obra',
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
      name: 'artista',
      title: 'Artista',
      type: 'reference',
      to: [{ type: 'artista' }],
      description: 'Artista de esta obra',
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
      description: 'Activar para mostrar esta obra en la página de Promociones',
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
      name: 'textoBadge',
      title: 'Texto del badge (opcional)',
      type: 'string',
      description: 'Personaliza el texto del badge de descuento. Si se deja vacío se muestra el descuento automáticamente.',
      placeholder: 'Ej: 25% OFF',
      hidden: ({ parent }) => !parent?.tieneDescuento,
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'fechaInicioDescuento',
      title: 'Inicio de la promoción',
      type: 'datetime',
      description: 'Opcional — si se deja vacío la promoción inicia de inmediato',
      hidden: ({ parent }) => !parent?.tieneDescuento,
      options: { dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', timeStep: 30 },
    }),
    defineField({
      name: 'fechaFinDescuento',
      title: 'Fin de la promoción',
      type: 'datetime',
      description: 'Opcional — si se deja vacío la promoción no tiene fecha límite',
      hidden: ({ parent }) => !parent?.tieneDescuento,
      options: { dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', timeStep: 30 },
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
        list: categoriaOptions,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategoria',
      title: 'Subcategoría (cerámica)',
      type: 'string',
      description: 'Solo aplica cuando la categoría es Cerámica',
      options: {
        list: subcategoriaCeramicaOptions,
        layout: 'radio',
      },
      hidden: ({ parent }) => parent?.categoria !== 'ceramica',
      validation: (Rule) =>
        Rule.custom((valor, context) => {
          const parent = context.parent as { categoria?: string }
          if (parent?.categoria === 'ceramica' && !valor) {
            return 'Selecciona alta o baja temperatura'
          }
          return true
        }),
    }),
    defineField({
      name: 'tecnica',
      title: 'Técnica / material',
      type: 'string',
      description: 'Ej. Óleo sobre lienzo, bronce patinado, cerámica de alta temperatura',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'dimensiones',
      title: 'Dimensiones',
      type: 'string',
      description: 'Ej. 80 × 60 cm · 45 × 30 × 20 cm',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'anio',
      title: 'Año',
      type: 'number',
      validation: (Rule) => Rule.min(1800).max(new Date().getFullYear() + 1).integer(),
    }),
    defineField({
      name: 'destacada',
      title: 'Destacar en inicio',
      type: 'boolean',
      description: 'Muestra esta obra en la sección "Obras destacadas" del home',
      initialValue: false,
    }),
    defineField({
      name: 'disponible',
      title: 'Disponible en tienda',
      type: 'boolean',
      description:
        'Desactiva esta casilla si la obra ya se vendió o no quieres mostrarla en la web.',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Disponibles primero',
      name: 'disponibleDesc',
      by: [
        { field: 'disponible', direction: 'desc' },
        { field: 'titulo', direction: 'asc' },
      ],
    },
    {
      title: 'No disponibles primero',
      name: 'disponibleAsc',
      by: [
        { field: 'disponible', direction: 'asc' },
        { field: 'titulo', direction: 'asc' },
      ],
    },
    {
      title: 'Con descuento primero',
      name: 'descuentoDesc',
      by: [
        { field: 'tieneDescuento', direction: 'desc' },
        { field: 'titulo', direction: 'asc' },
      ],
    },
    {
      title: 'Título A–Z',
      name: 'tituloAsc',
      by: [{ field: 'titulo', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'titulo',
      media: 'imagenPrincipal',
      categoria: 'categoria',
      subcategoria: 'subcategoria',
      artistaNombre: 'artista.nombre',
      disponible: 'disponible',
      destacada: 'destacada',
      tieneDescuento: 'tieneDescuento',
      tipoDescuento: 'tipoDescuento',
      valorDescuento: 'valorDescuento',
      fechaInicioDescuento: 'fechaInicioDescuento',
      fechaFinDescuento: 'fechaFinDescuento',
      tecnica: 'tecnica',
    },
    prepare(selection) {
      const {
        title,
        categoria,
        subcategoria,
        artistaNombre,
        disponible,
        destacada,
        tieneDescuento,
        tipoDescuento,
        valorDescuento,
        fechaInicioDescuento,
        fechaFinDescuento,
        tecnica,
      } = selection

      const parts: string[] = []

      if (artistaNombre) parts.push(artistaNombre)

      if (disponible === false) {
        parts.push('Vendida')
      } else {
        parts.push('Disponible · Obra única')
      }

      if (destacada) parts.push('Destacada')

      if (tieneDescuento && tipoDescuento && valorDescuento) {
        const descuentoText =
          tipoDescuento === 'porcentaje'
            ? `${valorDescuento}% OFF`
            : `$${valorDescuento} OFF`

        const ahora = new Date()
        let estadoExtra = ''
        if (fechaInicioDescuento && new Date(fechaInicioDescuento) > ahora) {
          estadoExtra = ' (programado)'
        } else if (fechaFinDescuento && new Date(fechaFinDescuento) < ahora) {
          estadoExtra = ' (expirado)'
        } else if (!descuentoVigente(tieneDescuento, fechaInicioDescuento, fechaFinDescuento)) {
          estadoExtra = ' (inactivo)'
        }

        parts.push(`${descuentoText}${estadoExtra}`)
      }

      if (tecnica) parts.push(tecnica)

      if (categoria) {
        let cat = String(categoria)
        if (categoria === 'ceramica' && subcategoria) {
          cat = `${categoria} · ${subcategoria}`
        }
        parts.push(cat)
      }

      return {
        title,
        subtitle: parts.join(' · '),
        media: selection.media,
      }
    },
  },
})
