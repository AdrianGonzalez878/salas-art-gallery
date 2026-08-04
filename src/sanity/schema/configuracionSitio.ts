import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'configuracionSitio',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'numeroWhatsApp',
      title: 'Número de WhatsApp',
      type: 'string',
      description: 'Incluye lada internacional, solo dígitos. Ejemplo: 529515471306',
      initialValue: '529515471306',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return 'El número es obligatorio'
          const digits = String(value).replace(/\D/g, '')
          if (digits.length < 10) return 'Debe tener al menos 10 dígitos'
          return true
        }),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuración del sitio',
        subtitle: 'WhatsApp y ajustes generales',
      }
    },
  },
})
