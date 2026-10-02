import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statik çıktı: `npm run build` sonrası `out/` klasörü cPanel'deki public_html'e yüklenir.
  output: "export",
  // /klinikler/ → out/klinikler/index.html; Apache bu yapıyı ek ayar gerektirmeden sunar.
  trailingSlash: true,
  // Statik export'ta Next'in canlı görsel optimizasyonu yoktur; görseller build öncesi optimize edilir.
  images: { unoptimized: true },
};

export default nextConfig;
