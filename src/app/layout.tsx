import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import MarketingPixels from "@/components/MarketingPixels";
import { CartProvider } from "@/context/CartContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrl } from "@/lib/site";
import { sanityFetch } from "@/lib/sanity";
import { configuracionSitioQuery } from "@/sanity/lib/queries";
import type { ConfiguracionSitio } from "@/sanity/lib/types";
import { formatWhatsAppDisplay, telUrl, whatsappUrl } from "@/lib/whatsapp";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Salas Art Gallery | Galería de arte contemporáneo",
    template: "%s | Salas Art Gallery",
  },
  description:
    "Salas Art Gallery: obras de arte contemporáneo, pintura, escultura y fotografía. Descubre y adquiere piezas únicas de artistas seleccionados.",
  keywords: [
    "galería de arte",
    "arte contemporáneo",
    "Salas Art Gallery",
    "comprar arte online",
    "pintura contemporánea",
    "escultura",
    "fotografía artística",
    "obras de arte",
    "galería de arte México",
    "artistas contemporáneos",
  ],
  authors: [{ name: "Salas Art Gallery" }],
  creator: "Salas Art Gallery",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Salas Art Gallery",
    title: "Salas Art Gallery | Galería de arte contemporáneo",
    description:
      "Obras de arte contemporáneo: pintura, escultura y fotografía. Piezas únicas de artistas seleccionados.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Salas Art Gallery – Galería de arte contemporáneo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salas Art Gallery | Galería de arte contemporáneo",
    description: "Obras de arte contemporáneo: pintura, escultura y fotografía.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icon-48.png',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await sanityFetch<ConfiguracionSitio | null>(configuracionSitioQuery)
  const numeroWhatsApp = config?.numeroWhatsApp
  const contactWhatsappUrl = whatsappUrl(numeroWhatsApp)
  const contactWhatsappDisplay = formatWhatsAppDisplay(numeroWhatsApp)
  const contactPhoneTelUrl = telUrl(numeroWhatsApp)

  return (
    <html lang="es">
      <body
        className={`${cormorant.variable} ${dmSans.variable} antialiased`}
      >
        <CartProvider>
          <ConditionalNavbar whatsappUrl={contactWhatsappUrl} />
          <main className="min-h-screen flex flex-col">
            <div className="flex-grow">{children}</div>
            <ConditionalFooter
              whatsappUrl={contactWhatsappUrl}
              whatsappDisplay={contactWhatsappDisplay}
              phoneTelUrl={contactPhoneTelUrl}
            />
          </main>
        </CartProvider>
        <MarketingPixels />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}