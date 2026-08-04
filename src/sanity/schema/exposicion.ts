import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'exposicion',
  title: 'Exposición',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
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
      name: 'resumen',
      title: 'Resumen corto',
      type: 'text',
      rows: 3,
      description: 'Una o dos líneas para listados y tarjetas',
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
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
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Texto alternativo' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'galeria',
      title: 'Galería de la exposición',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Texto alternativo' }],
        },
      ],
    }),
    defineField({
      name: 'video',
      title: 'Video de la exposición',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm',
      },
      description: 'Video que se mostrará al abrir la página de la exposición.',
    }),
    defineField({
      name: 'fechaInicio',
      title: 'Fecha de inicio',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fechaFin',
      title: 'Fecha de fin',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ubicacion',
      title: 'Ubicación',
      type: 'object',
      fields: [
        {
          name: 'nombre',
          title: 'Nombre del espacio',
          type: 'string',
          description: 'Ej. Galería Salas, Museo de Arte Contemporáneo',
        },
        {
          name: 'ciudad',
          title: 'Ciudad',
          type: 'string',
        },
        {
          name: 'direccion',
          title: 'Dirección',
          type: 'text',
          rows: 2,
        },
        {
          name: 'enlaceMapa',
          title: 'Enlace a mapa',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'artistas',
      title: 'Artistas participantes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artista' }] }],
    }),
    defineField({
      name: 'enlaceExterno',
      title: 'Enlace externo',
      type: 'url',
      description: 'Sitio del venue, evento en Facebook, etc.',
    }),
    defineField({
      name: 'destacada',
      title: 'Destacar en inicio',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      initialValue: 1,
      description: 'Menor número = más arriba en listados',
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
      title: 'titulo',
      media: 'imagenPrincipal',
      ciudad: 'ubicacion.ciudad',
      activo: 'activo',
      fechaInicio: 'fechaInicio',
    },
    prepare({ title, media, ciudad, activo, fechaInicio }) {
      const fecha = fechaInicio
        ? new Date(fechaInicio).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'America/Mexico_City',
          })
        : null
      return {
        title,
        subtitle: [activo === false ? 'Oculta' : 'Visible', ciudad, fecha].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
