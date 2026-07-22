# Salas Art Gallery

Galería de arte contemporáneo con catálogo y checkout (Mercado Pago).

## Setup rápido

Ver [SETUP_SALAS.md](./SETUP_SALAS.md) para Git, Sanity, Mercado Pago, Resend y Vercel.

```bash
cp .env.local.example .env.local
# rellena credenciales NUEVAS
yarn install
yarn dev
```

## Stack

- Next.js 16
- Sanity CMS (`/studio`)
- Mercado Pago
- Resend (emails de pedidos)
- Vercel (deploy)
