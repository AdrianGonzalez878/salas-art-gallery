import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schema'

export default defineConfig({
  name: 'default',
  title: 'Salas Art Gallery',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem()
              .title('Configuración del sitio')
              .id('configuracionSitio')
              .child(
                S.document()
                  .schemaType('configuracionSitio')
                  .documentId('configuracionSitio'),
              ),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== 'configuracionSitio',
            ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
  
  // Configuración adicional para Next.js
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})

