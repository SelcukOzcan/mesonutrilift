import { Plus_Jakarta_Sans } from "next/font/google";

/**
 * Geçici marka fontu. Gilroy'un web lisanslı .woff2 dosyaları gelince:
 *   import localFont from "next/font/local";
 *   export const brandFont = localFont({ src: [...Gilroy dosyaları], variable: "--font-brand", display: "swap" });
 * Font build sırasında indirilip sitenin kendi sunucusundan servis edilir (Google'a istek gitmez).
 */
export const brandFont = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-brand",
  display: "swap",
});
