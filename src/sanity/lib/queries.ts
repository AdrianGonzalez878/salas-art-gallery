import { groq } from 'next-sanity'

// Productos
// - "Más nuevo": por fecha de creación
// - "Destacadas": obras marcadas como destacada en Sanity
export const productosMasNuevosQuery = groq`
  *[_type == "producto" && disponible == true] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible
  }
`

export const productosDestacadosQuery = groq`
  *[_type == "producto" && disponible == true && destacada == true] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
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
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
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
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
  }
`

/** Slugs de productos disponibles para sitemap */
export const productosSitemapQuery = groq`
  *[_type == "producto" && disponible == true && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`

export const productoMetadataQuery = groq`
  *[_type == "producto" && slug.current == $slug][0] {
    titulo,
    etiquetas,
    artista->{
      nombre,
      slug
    },
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    "slug": slug.current
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
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
    tecnica,
    dimensiones,
    anio,
    destacada
  }
`

export const productosPorEtiquetaQuery = groq`
  *[_type == "producto" && disponible == true && (!defined($etiqueta) || $etiqueta == "" || $etiqueta in etiquetas[])] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
  }
`

// Productos relacionados (comparten alguna etiqueta; si no hay, recientes)
export const productosRelacionadosQuery = groq`
  *[_type == "producto" && _id != $excludeId && disponible == true && (
    count($etiquetas) == 0 || count((etiquetas[])[@ in $etiquetas]) > 0
  )] | order(_createdAt desc) [0...8] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
  }
`

// Contar productos (todos o por categoría) para paginación
export const productosCountQuery = groq`
  count(*[_type == "producto" && disponible == true && (!defined($etiqueta) || $etiqueta == "" || $etiqueta in etiquetas[])])
`

// Contar productos para orden "destacadas"
export const productosCountDestacadosQuery = groq`
  count(*[_type == "producto" && disponible == true && destacada == true && (!defined($etiqueta) || $etiqueta == "" || $etiqueta in etiquetas[])])
`

// Palabras clave usadas en obras disponibles (para filtros)
export const etiquetasDisponiblesQuery = groq`
  array::unique(*[_type == "producto" && disponible == true && defined(etiquetas) && count(etiquetas) > 0].etiquetas[])
`

// Búsqueda por texto (título o artista). $pattern debe ser ej. "%term%" en minúsculas
export const productosBusquedaQuery = groq`
  *[_type == "producto" && disponible == true && ((lower(titulo) match $pattern || lower(artista->nombre) match $pattern))] | order(_createdAt desc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
  }
`

export const productosCountBusquedaQuery = groq`
  count(*[_type == "producto" && disponible == true && ((lower(titulo) match $pattern || lower(artista->nombre) match $pattern))])
`

// Productos paginados - Más recientes
export const productosPaginadosRecientesQuery = groq`
  *[_type == "producto" && disponible == true && (!defined($etiqueta) || $etiqueta == "" || $etiqueta in etiquetas[])] | order(_createdAt desc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
  }
`

// Productos paginados - Precio menor a mayor
export const productosPaginadosPrecioAscQuery = groq`
  *[_type == "producto" && disponible == true && (!defined($etiqueta) || $etiqueta == "" || $etiqueta in etiquetas[])] | order(precio asc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
  }
`

// Productos paginados - Precio mayor a menor
export const productosPaginadosPrecioDescQuery = groq`
  *[_type == "producto" && disponible == true && (!defined($etiqueta) || $etiqueta == "" || $etiqueta in etiquetas[])] | order(precio desc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
  }
`

// Productos paginados - Destacadas
export const productosPaginadosDestacadosQuery = groq`
  *[_type == "producto" && disponible == true && destacada == true && (!defined($etiqueta) || $etiqueta == "" || $etiqueta in etiquetas[])] | order(_createdAt desc) [$skip...$end] {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
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
    etiqueta,
    imagenBanner {
      asset,
      alt
    },
    textoBanner,
    posicionTextoBanner,
    mostrarBoton
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
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal {
      asset,
      alt
    },
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    destacada,
    _createdAt
  }
`

/** Testimonios activos ordenados */
export const testimoniosActivosQuery = groq`
  *[_type == "testimonio" && activo == true] | order(orden asc) {
    _id,
    nombre,
    texto,
    estrellas
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

// Primer producto disponible que coincida con un término (para atajos de categoría en home)
export const productoImagenPorTerminoQuery = groq`
  *[_type == "producto" && disponible == true && (
    lower(titulo) match $pattern || lower(artista->nombre) match $pattern
  )] | order(_createdAt desc) [0] {
    imagenPrincipal {
      asset,
      alt
    }
  }
`


// Artistas
export const artistasQuery = groq`
  *[_type == "artista" && activo != false] | order(nombre asc) {
    _id,
    nombre,
    slug,
    foto,
    resumen,
    biografia
  }
`

export const paginaArtistasQuery = groq`
  *[_type == "paginaArtistas" && activo == true][0] {
    imagenCierre {
      asset,
      alt
    },
    textoCierre,
    textoCierreSecundario
  }
`

export const artistaPorSlugQuery = groq`
  *[_type == "artista" && slug.current == $slug && activo != false][0] {
    _id,
    nombre,
    slug,
    foto,
    resumen,
    biografia
  }
`

export const productosPorArtistaQuery = groq`
  *[_type == "producto" && disponible == true && artista._ref == $artistaId] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    precio,
    tieneDescuento,
    tipoDescuento,
    valorDescuento,
    textoBadge,
    fechaInicioDescuento,
    fechaFinDescuento,
    imagenPrincipal,
    galeria,
    etiquetas,
    artista->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    },
    disponible,
  }
`

export const artistasSitemapQuery = groq`
  *[_type == "artista" && activo != false && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`

// Exposiciones
export const exposicionesQuery = groq`
  *[_type == "exposicion" && activo != false] | order(orden asc, fechaInicio desc) {
    _id,
    titulo,
    slug,
    resumen,
    imagenPrincipal,
    fechaInicio,
    fechaFin,
    ubicacion,
    destacada,
    orden
  }
`

export const exposicionPorSlugQuery = groq`
  *[_type == "exposicion" && slug.current == $slug && activo != false][0] {
    _id,
    titulo,
    slug,
    resumen,
    imagenPrincipal,
    galeria,
    fechaInicio,
    fechaFin,
    ubicacion,
    enlaceExterno,
    artistas[]->{
      _id,
      nombre,
      slug,
      foto,
      resumen
    }
  }
`

export const exposicionesDestacadasQuery = groq`
  *[_type == "exposicion" && activo != false && destacada == true] | order(orden asc, fechaInicio desc) {
    _id,
    titulo,
    slug,
    resumen,
    imagenPrincipal,
    fechaInicio,
    fechaFin,
    ubicacion,
    destacada,
    orden
  }
`

export const exposicionesSitemapQuery = groq`
  *[_type == "exposicion" && activo != false && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`
