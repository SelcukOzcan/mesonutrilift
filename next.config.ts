import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statik çıktı: `npm run build` sonrası `out/` klasörü cPanel'deki public_html'e yüklenir.
  output: "export",
  // /klinikler/ → out/klinikler/index.html; Apache bu yapıyı ek ayar gerektirmeden sunar.
  trailingSlash: true,
  // Statik export'ta canlı görsel optimizasyonu yoktur: boyut varyantları `npm run images` ile
  // önceden üretilir, yükleyici her cihaz için uygun dosyayı srcset'e yazar.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [480, 640, 828, 1080, 1280, 1920],
    imageSizes: [128, 256, 384],
  },
};

export default nextConfig;
