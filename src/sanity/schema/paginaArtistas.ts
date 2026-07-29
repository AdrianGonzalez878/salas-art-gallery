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
      name: 'imagenCierre',
      title: 'Imagen (sección final)',
      type: 'image',
      description: 'Foto horizontal para la sección final de /artistas (a la izquierda del texto). Recomendado: 1500×900 px (5:3).',
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
      name: 'textoCierre',
      title: 'Texto principal (cierre)',
      type: 'text',
      rows: 4,
      initialValue:
        'Salas Art Gallery trabaja en colaboración con artistas contemporáneos, explorando de forma constante nuevas formas de diálogo, exhibición y adquisición de obra.',
    }),
    defineField({
      name: 'textoCierreSecundario',
      title: 'Texto secundario (cierre)',
      type: 'text',
      rows: 2,
      initialValue:
        'Programa una visita a nuestro espacio y descubre el lugar donde el arte sucede.',
    }),
  ],
  preview: {
    select: {
      activo: 'activo',
      media: 'imagenCierre',
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
