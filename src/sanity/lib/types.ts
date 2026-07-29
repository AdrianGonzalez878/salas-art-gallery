export interface Testimonio {
  _id: string
  nombre: string
  texto: string
  estrellas: number
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface PortableTextBlock {
  _type: 'block'
  _key: string
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs?: { _key: string; _type: string }[]
  children: { _key: string; _type: 'span'; marks?: string[]; text: string }[]
}

export interface Artista {
  _id: string
  nombre: string
  slug: {
    current: string
  }
  foto?: SanityImage
  resumen?: string
  biografia?: PortableTextBlock[]
  activo?: boolean
}

export interface PaginaArtistas {
  imagenCierre?: SanityImage
  textoCierre?: string
  textoCierreSecundario?: string
}

export interface UbicacionExposicion {
  nombre?: string
  ciudad?: string
  direccion?: string
  enlaceMapa?: string
}

export interface Exposicion {
  _id: string
  titulo: string
  slug: {
    current: string
  }
  resumen?: string
  descripcion?: PortableTextBlock[]
  imagenPrincipal: SanityImage
  galeria?: SanityImage[]
  fechaInicio: string
  fechaFin: string
  ubicacion?: UbicacionExposicion
  artistas?: Artista[]
  enlaceExterno?: string
  destacada?: boolean
  orden?: number
  activo?: boolean
}

export type CategoriaProducto =
  | 'litografia'
  | 'acrilicos'
  | 'arte-objeto'
  | 'oleos'
  | 'madera-tallada'
  | 'ceramica'
  | 'bronce'

export type SubcategoriaCeramica = 'alta-temperatura' | 'baja-temperatura'

export interface Producto {
  _id: string
  titulo: string
  slug: {
    current: string
  }
  precio: number
  tieneDescuento?: boolean
  tipoDescuento?: 'porcentaje' | 'monto'
  valorDescuento?: number
  textoBadge?: string
  fechaInicioDescuento?: string
  fechaFinDescuento?: string
  imagenPrincipal: SanityImage
  galeria?: SanityImage[]
  categoria: CategoriaProducto
  subcategoria?: SubcategoriaCeramica
  artista?: Pick<Artista, '_id' | 'nombre' | 'slug' | 'foto' | 'resumen'> | null
  disponible: boolean
  tecnica?: string
  dimensiones?: string
  anio?: number
  destacada?: boolean
}

export interface Cliente {
  nombre: string
  email: string
  telefono: string
}

export interface DireccionEnvio {
  calle: string
  colonia: string
  ciudad: string
  estado: string
  codigoPostal: string
  pais?: string
}

export interface ProductoPedido {
  producto: {
    _id: string
    titulo: string
    slug: {
      current: string
    }
    imagenPrincipal: SanityImage
  }
  cantidad: number
  precio: number
}

export interface Pedido {
  _id: string
  numeroPedido: string
  cliente: Cliente
  direccionEnvio: DireccionEnvio
  productos: ProductoPedido[]
  subtotal: number
  envio: number
  total: number
  estado: 'pendiente_pago' | 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado'
  metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia' | 'paypal' | 'otro'
  regaloTitulo?: string
  regaloImagenUrl?: string
  guiaRastreo?: string
  paqueteria?: string
  notas?: string
  _createdAt: string
}

export interface Estadisticas {
  totalPedidos: number
  pedidosPendientes: number
  pedidosProcesando: number
  pedidosEnviados: number
  pedidosEntregados: number
  ventasTotales: number
  ventasHoy?: number
  pedidosHoy?: number
}

export interface Hero {
  titulo: string
  subtitulo?: string
  imagenesCarrusel: {
    imagenDesktop: SanityImage
    imagenMobile: SanityImage
    alt: string
  }[]
  textoBotonPrincipal?: string
  hrefBotonPrincipal?: string
  textoBotonSecundario?: string
  hrefBotonSecundario?: string
  mostrarBadge?: boolean
  textoBadge?: string
}

export interface Estadistica {
  numero: string
  etiqueta: string
}export interface SobreNosotros {
  titulo: string
  subtitulo?: string
  imagenBanner?: SanityImage
  historia: string
  galeria: SanityImage[]
  estadisticas?: Estadistica[]
}export interface SeccionDestacada {
  _id: string
  activo: boolean
  orden: number
  titulo: string
  descripcion?: string
  categoria: CategoriaProducto
  imagenBanner: SanityImage
  textoBanner?: string
  posicionTextoBanner?: 'left' | 'center' | 'right'
  mostrarBoton?: boolean
}

export interface Cupon {
  _id: string
  codigo: string
  activo: boolean
  tipoDescuento: 'porcentaje' | 'monto'
  valor: number
  montoMinimo?: number | null
  fechaInicio?: string | null
  fechaFin?: string | null
}
