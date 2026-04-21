import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import { CartProvider } from "@/context/CartContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrl } from "@/lib/site";

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
    default: "Conchita Plata | Joyería artesanal en plata",
    template: "%s | Conchita Plata",
  },
  description:
    "Joyería artesanal en plata: anillos, collares, aretes, pulseras y más. Envío gratis a partir de $999. Paga con tarjeta, OXXO o SPEI.",
  keywords: ["joyería", "plata", "anillos", "collares", "aretes", "pulseras", "México", "joyería artesanal"],
  authors: [{ name: "Conchita Plata" }],
  creator: "Conchita Plata",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Conchita Plata",
    title: "Conchita Plata | Joyería artesanal en plata",
    description:
      "Joyería artesanal en plata: anillos, collares, aretes, pulseras y más. Envío gratis a partir de $999.",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Conchita Plata – Joyería artesanal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conchita Plata | Joyería artesanal en plata",
    description: "Joyería artesanal en plata. Envío gratis a partir de $999.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${cormorant.variable} ${dmSans.variable} antialiased`}
      >
        <CartProvider>
          <ConditionalNavbar />
          <main className="min-h-screen flex flex-col">
            <div className="flex-grow">{children}</div>
            <ConditionalFooter />
          </main>
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}