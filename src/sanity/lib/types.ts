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
  imagenPrincipal: SanityImage
  galeria?: SanityImage[]
  categoria: 'anillos' | 'collares' | 'aretes' | 'pulseras' | 'dijes' | 'cadenas' | 'juegos'
  tieneOpcionExtra?: boolean
  nombreOpcionExtra?: string
  precioOpcionExtra?: number
  descripcion: PortableTextBlock[]
  disponible: boolean
  stock?: number
  ventas?: number
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
  categoria: 'anillo' | 'collar' | 'aretes' | 'pulsera' | 'tobillera' | 'broche' | 'reloj' | 'otro'
  imagenBanner: SanityImage
  textoBanner?: string
  posicionTextoBanner?: 'left' | 'center' | 'right'
  mostrarBoton?: boolean
}

export interface PostInstagram {
  _id: string
  imagen: SanityImage
  descripcion?: string
  likes?: number
  enlace?: string
  orden: number
  activo: boolean
}

export interface ShopTheLook {
  _id: string
  titulo: string
  descripcion?: string
  imagenModelo: SanityImage
  productos: {
    producto: Producto
    posicionX: number
    posicionY: number
  }[]
  activo: boolean
}

export interface Promocion {
  _id: string
  titulo: string
  descripcion?: string
  imagenBanner: SanityImage
  montoMinimo: number
  fechaInicio?: string
  fechaFin?: string
  orden: number
  activo: boolean
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
