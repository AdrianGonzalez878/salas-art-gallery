import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'codigoColaboracion',
  title: 'Código de colaboración',
  type: 'document',
  fields: [
    defineField({
      name: 'codigo',
      title: 'Código',
      type: 'string',
      description:
        'Lo que escribe el cliente o la exposición en el checkout (ej. EXPO-OAXACA). Se compara sin importar mayúsculas.',
      validation: (Rule) =>
        Rule.required().custom((codigo) => {
          if (!codigo || !String(codigo).trim()) return 'Ingresa un código'
          return true
        }),
    }),
    defineField({
      name: 'nombre',
      title: 'Nombre / etiqueta',
      type: 'string',
      description:
        'Nombre interno para identificar quién vende (ej. nombre de la exposición o colaborador).',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'exposicion',
      title: 'Exposición relacionada',
      type: 'reference',
      to: [{ type: 'exposicion' }],
      description: 'Opcional. Vincula este código a una exposición del sitio.',
    }),
    defineField({
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      description: 'Desactiva para dejar de aceptar este código sin borrarlo.',
      initialValue: true,
    }),
    defineField({
      name: 'notas',
      title: 'Notas internas',
      type: 'text',
      rows: 2,
      description: 'Solo visible en Sanity. Ej. % de comisión o contacto del colaborador.',
    }),
  ],
  preview: {
    select: {
      codigo: 'codigo',
      nombre: 'nombre',
      activo: 'activo',
      exposicionTitulo: 'exposicion.titulo',
    },
    prepare({ codigo, nombre, activo, exposicionTitulo }) {
      return {
        title: codigo || 'Sin código',
        subtitle: [
          activo === false ? 'Inactivo' : 'Activo',
          nombre,
          exposicionTitulo,
        ]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
