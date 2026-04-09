import { groq } from 'next-sanity'

// Productos
// - "Más nuevo": por fecha de creación
// - "Más vendido": por campo `ventas` (configurable desde Sanity)
export const productosMasNuevosQuery = groq`
  *[_type == "producto" && disponible == true] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

export const productosMasVendidosQuery = groq`
  *[_type == "producto" && disponible == true && defined(ventas) && ventas > 0] | order(ventas desc, _createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

export const productosQuery = groq`
  *[_type == "producto" && disponible == true] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

// Query para debug - muestra todos los productos
export const todosProductosQuery = groq`
  *[_type == "producto"] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

/** Slugs de productos disponibles para sitemap */
export const productosSitemapQuery = groq`
  *[_type == "producto" && disponible == true && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`

export const productoPorSlugQuery = groq`
  *[_type == "producto" && slug.current == $slug][0] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

export const productosPorCategoriaQuery = groq`
  *[_type == "producto" && categoria == $categoria && disponible == true] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

// Productos relacionados (misma categoría, excluye el actual)
export const productosRelacionadosQuery = groq`
  *[_type == "producto" && categoria == $categoria && _id != $excludeId && disponible == true] | order(_createdAt desc) [0...8] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

// Contar productos (todos o por categoría) para paginación
export const productosCountQuery = groq`
  count(*[_type == "producto" && disponible == true && (!defined($categoria) || $categoria == "" || categoria == $categoria)])
`

// Contar productos para orden "más vendidos" (solo con ventas > 0)
export const productosCountMasVendidosQuery = groq`
  count(*[_type == "producto" && disponible == true && defined(ventas) && ventas > 0 && (!defined($categoria) || $categoria == "" || categoria == $categoria)])
`

// Búsqueda por texto (titulo o descripcion). $pattern debe ser ej. "%term%" en minúsculas
export const productosBusquedaQuery = groq`
  *[_type == "producto" && disponible == true && (lower(titulo) match $pattern || lower(descripcion) match $pattern)] | order(_createdAt desc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

export const productosCountBusquedaQuery = groq`
  count(*[_type == "producto" && disponible == true && (lower(titulo) match $pattern || lower(descripcion) match $pattern)])
`

// Productos paginados - Más recientes
export const productosPaginadosRecientesQuery = groq`
  *[_type == "producto" && disponible == true && (!defined($categoria) || $categoria == "" || categoria == $categoria)] | order(_createdAt desc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

// Productos paginados - Precio menor a mayor
export const productosPaginadosPrecioAscQuery = groq`
  *[_type == "producto" && disponible == true && (!defined($categoria) || $categoria == "" || categoria == $categoria)] | order(precio asc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

// Productos paginados - Precio mayor a menor
export const productosPaginadosPrecioDescQuery = groq`
  *[_type == "producto" && disponible == true && (!defined($categoria) || $categoria == "" || categoria == $categoria)] | order(precio desc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

// Productos paginados - Más vendidos (solo con ventas definidas y > 0)
export const productosPaginadosMasVendidosQuery = groq`
  *[_type == "producto" && disponible == true && defined(ventas) && ventas > 0 && (!defined($categoria) || $categoria == "" || categoria == $categoria)] | order(ventas desc, _createdAt desc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal,
    galeria,
    categoria,
    descripcion,
    disponible,
    ventas
  }
`

// Queries para Pedidos
export const pedidosQuery = groq`
  *[_type == "pedido"] | order(_createdAt desc) {
    _id,
    numeroPedido,
    cliente,
    direccionEnvio,
    productos[] {
      producto-> {
        _id,
        titulo,
        slug,
        imagenPrincipal
      },
      cantidad,
      precio
    },
    subtotal,
    envio,
    total,
    estado,
    metodoPago,
    regaloTitulo,
    regaloImagenUrl,
    notas,
    _createdAt
  }
`

export const pedidoPorIdQuery = groq`
  *[_type == "pedido" && _id == $id][0] {
    _id,
    numeroPedido,
    cliente,
    direccionEnvio,
    productos[] {
      producto-> {
        _id,
        titulo,
        slug,
        imagenPrincipal
      },
      cantidad,
      precio
    },
    subtotal,
    envio,
    total,
    estado,
    metodoPago,
    regaloTitulo,
    regaloImagenUrl,
    notas,
    _createdAt
  }
`

export const pedidosPorEstadoQuery = groq`
  *[_type == "pedido" && estado == $estado] | order(_createdAt desc) {
    _id,
    numeroPedido,
    cliente,
    direccionEnvio,
    productos[] {
      producto-> {
        _id,
        titulo,
        slug,
        imagenPrincipal
      },
      cantidad,
      precio
    },
    subtotal,
    envio,
    total,
    estado,
    metodoPago,
    notas,
    _createdAt
  }
`

export const estadisticasQuery = groq`
  {
    "totalPedidos": count(*[_type == "pedido"]),
    "pedidosPendientes": count(*[_type == "pedido" && estado == "pendiente"]),
    "pedidosProcesando": count(*[_type == "pedido" && estado == "procesando"]),
    "pedidosEnviados": count(*[_type == "pedido" && estado == "enviado"]),
    "pedidosEntregados": count(*[_type == "pedido" && estado == "entregado"])
  }
`

// Query para Hero Section
export const heroQuery = groq`
  *[_type == "hero" && activo == true][0] {
    titulo,
    subtitulo,
    imagenesCarrusel[] {
      imagenDesktop {
        asset,
        hotspot,
        crop
      },
      imagenMobile {
        asset,
        hotspot,
        crop
      },
      alt
    },
    textoBotonPrincipal,
    hrefBotonPrincipal,
    textoBotonSecundario,
    hrefBotonSecundario,
    mostrarBadge,
    textoBadge
  }
`

// Query para Sobre Nosotros Section
export const sobreNosotrosQuery = groq`
  *[_type == "sobreNosotros" && activo == true][0] {
    titulo,
    subtitulo,
    imagenBanner {
      asset,
      alt
    },
    historia,
    anosExperiencia,
    galeria[] {
      asset,
      alt
    },
    estadisticas[] {
      numero,
      etiqueta
    },
    mostrarBotonWhatsApp,
    textoBotonWhatsApp,
    numeroWhatsApp
  }
`

// Query para Secciones Destacadas (ordenadas)
export const seccionesDestacadasQuery = groq`
  *[_type == "seccionDestacada" && activo == true] | order(orden asc) {
    _id,
    activo,
    orden,
    titulo,
    descripcion,
    categoria,
    imagenBanner {
      asset,
      alt
    },
    textoBanner,
    posicionTextoBanner,
    mostrarBoton
  }
`

// Query para Posts de Instagram
export const postsInstagramQuery = groq`
  *[_type == "postInstagram" && activo == true] | order(orden asc) [0...6] {
    _id,
    imagen {
      asset,
      alt
    },
    descripcion,
    likes,
    enlace,
    orden
  }
`

// Query para Shop the Look
export const shopTheLookQuery = groq`
  *[_type == "shopTheLook" && activo == true][0] {
    _id,
    titulo,
    descripcion,
    imagenModelo {
      asset,
      alt
    },
    productos[] {
      producto-> {
        _id,
        titulo,
        slug,
        precio,
        tieneDescuento,
        tipoDescuento,
        valorDescuento,
        imagenPrincipal,
        descripcion,
        categoria
      },
    posicionX,
    posicionY
    }
  }
`

// Query para productos con descuento
export const productosConDescuentoQuery = groq`
  *[_type == "producto" && tieneDescuento == true && disponible == true] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    imagenPrincipal {
      asset,
      alt
    },
    categoria,
    descripcion,
    ventas,
    _createdAt
  }
`

// Query para Promociones de compra mínima
export const promocionesCompraMinima = groq`
  *[_type == "promocion" && activo == true] | order(orden asc) {
    _id,
    titulo,
    descripcion,
    imagenBanner {
      asset
    },
    montoMinimo,
    fechaInicio,
    fechaFin
  }
`

/** Cupones activos (validación de fechas en servidor / cliente) */
export const cuponesActivosQuery = groq`
  *[_type == "cupon" && activo == true] {
    _id,
    codigo,
    activo,
    tipoDescuento,
    valor,
    montoMinimo,
    fechaInicio,
    fechaFin
  }
`