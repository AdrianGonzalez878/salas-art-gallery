# Configuración de Sanity

## Pasos para configurar Sanity

### 1. Crear cuenta y proyecto en Sanity

1. Ve a [https://sanity.io](https://sanity.io) y crea una cuenta (es gratis)
2. Crea un nuevo proyecto
3. Elige un nombre para tu proyecto (ej: "salas-art-gallery")
4. Selecciona el dataset (por defecto es "production")

### 2. Obtener las credenciales

1. Ve a [https://sanity.io/manage](https://sanity.io/manage)
2. Selecciona tu proyecto
3. En la sección "API", encontrarás:
   - **Project ID**: Copia este valor
   - **Dataset**: Por defecto es "production"

### 3. Configurar variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las siguientes variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id_aqui
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Acceder a Sanity Studio

✅ **Sanity Studio ya está configurado y listo para usar!**

1. Asegúrate de que tu servidor de desarrollo esté corriendo:
   ```bash
   yarn dev
   ```

2. Ve a: **http://localhost:3000/studio**

3. La primera vez, Sanity te pedirá autenticarte con tu cuenta

4. Una vez autenticado, podrás:
   - Ver el esquema de Productos
   - Crear, editar y eliminar productos
   - Subir imágenes
   - Gestionar todo el contenido de tu tienda

### 5. El esquema ya está desplegado

El esquema de productos está en `sanity/schema/producto.ts` y se carga automáticamente cuando accedes al Studio.

## Estructura creada

- `sanity/schema/producto.ts` - Esquema del producto
- `sanity/lib/client.ts` - Cliente de Sanity (legacy, puedes usar el de src/lib)
- `sanity/lib/queries.ts` - Queries GROQ para productos
- `sanity/lib/types.ts` - Tipos TypeScript
- `src/lib/sanity.ts` - Cliente de Sanity para usar en Next.js

## Uso en Next.js

```typescript
import { client } from '@/lib/sanity'
import { productosQuery } from '@/sanity/lib/queries'
import type { Producto } from '@/sanity/lib/types'

// En un Server Component
const productos: Producto[] = await client.fetch(productosQuery)
```

## Campos del Producto

- **titulo**: Título del producto
- **slug**: URL amigable (se genera automáticamente)
- **precio**: Precio en número
- **imagenPrincipal**: Imagen principal del producto
- **galeria**: Array de imágenes adicionales
- **categoria**: anillo, collar, aretes, pulsera, tobillera, broche, reloj, otro
- **descripcion**: Descripción del producto (50-500 caracteres)
- **disponible**: Boolean para mostrar/ocultar producto

## ⚠️ Recordatorios para Producción

Cuando despliegues el proyecto a producción, **NO OLVIDES**:

### 1. Configurar CORS Origins en Sanity
1. Ve a [https://sanity.io/manage](https://sanity.io/manage)
2. Selecciona tu proyecto
3. Ve a **Settings → API → CORS origins**
4. Agrega tu dominio de producción:
   - `https://tu-dominio.com`
   - `https://www.tu-dominio.com`
   - `https://tu-dominio.vercel.app` (si usas Vercel)
5. Asegúrate de que "Allow credentials" esté habilitado
6. Guarda los cambios

**Sin esto, Sanity Studio no funcionará en producción.**

### 2. Variables de Entorno en Producción
Asegúrate de configurar las variables de entorno en tu plataforma de hosting:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

### 3. Verificar que todo funcione
- Accede a `https://tu-dominio.com/studio` y verifica que funcione
- Prueba crear/editar un producto desde producción


