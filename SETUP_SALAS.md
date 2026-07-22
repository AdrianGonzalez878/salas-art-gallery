# Salas Art Gallery — setup

Proyecto basado en un **clon local** del código de Conchita Plata.
El repo, Vercel, Sanity y credenciales de Conchita **no se tocan**.

## 1. Git (desacoplado)

En esta copia ya se eliminó `origin` → `conchita-plata`.

Crea un repo vacío en GitHub (ej. `salas-art-gallery`) y enlázalo:

```bash
git remote add origin https://github.com/TU_USUARIO/salas-art-gallery.git
git push -u origin main
```

(Opcional) Renombra la carpeta local a `salas-art-gallery`.

## 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Rellena **solo credenciales nuevas**:

| Servicio | Qué crear |
|----------|-----------|
| Sanity | Proyecto nuevo "Salas Art Gallery" + token API con escritura |
| Mercado Pago | App/credenciales nuevas (test y luego prod) |
| Resend | Cuenta/API key nuevas; dominio verificado para el `FROM` |
| Admin | Usuario, password y `ADMIN_SESSION_SECRET` nuevos |
| URLs | `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL` |

El `FROM` de emails está en `src/lib/email.ts` (`notificaciones@salasartgallery.com`).
Ajústalo al dominio que verifiques en Resend.

## 3. Sanity

1. Crea el proyecto en https://sanity.io/manage
2. Dataset: `production`
3. Pega `NEXT_PUBLIC_SANITY_PROJECT_ID` y `SANITY_API_TOKEN` en `.env.local`
4. CORS: `http://localhost:3000` (y luego tu dominio Vercel)
5. Studio: `http://localhost:3000/studio`

El schema (productos, pedidos, hero, etc.) ya está en el código; el CMS empieza vacío.

## 4. Desarrollo local

```bash
yarn install   # o npm install
yarn dev
```

## 5. Vercel (proyecto nuevo)

1. Importa el repo **nuevo** de Salas (no el de Conchita)
2. Copia las mismas env vars a Production + Preview
3. Dominio custom cuando exista
4. En Mercado Pago: webhook → `https://TU_DOMINIO/api/mercadopago/webhook`
5. En Sanity: CORS + webhook de revalidate → `/api/revalidate?secret=...`

## Contacto placeholder

En `src/components/Footer.tsx` hay Instagram / WhatsApp / teléfono / email
provisionales (`salasartgallery` / `contacto@salasartgallery.com`).
Sustitúyelos cuando tengas los reales.

## Logo

Reemplaza `public/logo.jpg`, favicons e `icon.png` / `apple-icon.png` con la marca de Salas.
