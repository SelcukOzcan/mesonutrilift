import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { media, site } from "@/lib/content";
import { brandFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "MesoNutrilift | Somon DNA'lı Gençlik Aşısı",
    template: "%s | MesoNutrilift",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    images: [{ url: media.og.src, width: media.og.width, height: media.og.height, alt: media.og.alt }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: media.icons.icon32, sizes: "32x32" },
      { url: media.icons.icon192, sizes: "192x192" },
    ],
    apple: media.icons.apple,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#672680",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={brandFont.variable}>
      <body id="ust">
        <a href="#icerik" className="sr-only z-50 rounded-full bg-plum-700 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          İçeriğe geç
        </a>
        <Header />
        <main id="icerik">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
