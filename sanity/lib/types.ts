export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Producto {
  _id: string
  titulo: string
  slug: {
    current: string
  }
  precio: number
  imagenPrincipal: SanityImage
  galeria?: SanityImage[]
  categoria: 'anillo' | 'collar' | 'aretes' | 'pulsera' | 'tobillera' | 'broche' | 'reloj' | 'otro'
  descripcion: string
  disponible: boolean
}

