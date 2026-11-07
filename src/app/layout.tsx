import type { Metadata } from "next";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://enucuztelefon.com"),
  title: {
    default: "EnUcuzTelefon.com - Türkiye'nin Telefon Araştırma Merkezi",
    template: "%s | EnUcuzTelefon.com",
  },
  description:
    "Türkiye'nin en kapsamlı akıllı telefon karşılaştırma ve fiyat takip platformu. En ucuz telefon fiyatlarını bul, teknik özellikleri karşılaştır, uzman rehberleri oku.",
  keywords: [
    "en ucuz telefon",
    "telefon fiyatları",
    "akıllı telefon karşılaştırma",
    "iPhone fiyatı",
    "Samsung fiyatı",
    "Xiaomi fiyatı",
    "telefon özellikleri",
    "cep telefonu",
    "telefon kampanya",
    "telefon indirim",
    "Trendyol telefon",
    "Hepsiburada telefon",
    "MediaMarkt telefon",
    "Vatan telefon",
  ],
  authors: [{ name: "EnUcuzTelefon.com" }],
  creator: "EnUcuzTelefon.com",
  publisher: "EnUcuzTelefon.com",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://enucuztelefon.com",
    siteName: "EnUcuzTelefon.com",
    title: "EnUcuzTelefon.com - Türkiye'nin Telefon Araştırma Merkezi",
    description:
      "Türkiye'nin en kapsamlı akıllı telefon karşılaştırma ve fiyat takip platformu.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EnUcuzTelefon.com - Türkiye'nin Telefon Araştırma Merkezi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EnUcuzTelefon.com - Türkiye'nin Telefon Araştırma Merkezi",
    description:
      "Türkiye'nin en kapsamlı akıllı telefon karşılaştırma ve fiyat takip platformu.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://enucuztelefon.com",
  },
  verification: {
    google: "google-site-verification-token",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('enucuz_theme')||'dark';document.documentElement.classList.remove('dark','light');document.documentElement.classList.add(t);document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 transition-colors duration-200">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
