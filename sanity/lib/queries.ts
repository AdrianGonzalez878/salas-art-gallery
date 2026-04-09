import { groq } from 'next-sanity'

export const productosQuery = groq`
  *[_type == "producto" && disponible == true] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible
  }
`

export const productoPorSlugQuery = groq`
  *[_type == "producto" && slug.current == $slug][0] {
    _id,
    titulo,
    slug,
    precio,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible
  }
`

export const productosPorCategoriaQuery = groq`
  *[_type == "producto" && categoria == $categoria && disponible == true] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible
  }
`



