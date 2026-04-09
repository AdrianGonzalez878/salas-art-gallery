import { createClient } from '@sanity/client'

/**
 * Sanity client with write token for server-side mutations (e.g. crear pedidos).
 * Requiere SANITY_API_TOKEN en .env.local con permisos de escritura.
 */
export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
