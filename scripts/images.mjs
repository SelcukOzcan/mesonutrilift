/**
 * Görsel hazırlama: assets/images altındaki kaynak dosyalardan public/images altına
 * WebP boyut varyantları üretir ve src/content/images.json listesini yazar.
 * next/image bu listeyi kullanarak her cihaza uygun boyutu seçer (src/lib/image-loader.ts).
 *
 * Kullanım: yeni ya da değişen görseli assets/images'a koyun, aşağıdaki listeye ekleyin,
 * `npm run images` çalıştırın; media.json'da src olarak "/images/<ad>.webp" kullanın.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "assets/images");
const OUTPUT = join(root, "public/images");
const MANIFEST = join(root, "src/content/images.json");

/**
 * widths: üretilecek ara genişlikler. Ana dosya (<ad>.webp) kaynak genişliğinde ya da `max` ile sınırlanmış olarak üretilir.
 * alphaQuality: şeffaf görsellerde saydamlık kalitesi (yumuşak gölgeler için 70 yeterli).
 */
const IMAGES = [
  { file: "hero.jpg", name: "hero", widths: [480, 640, 828], quality: 76 },
  { file: "product.png", name: "product", widths: [256, 384, 640, 828], max: 1080, quality: 80, alphaQuality: 70 },
  { file: "faq.jpg", name: "faq", widths: [480, 640], quality: 78 },
];

mkdirSync(OUTPUT, { recursive: true });
const manifest = {};

for (const image of IMAGES) {
  const input = join(SOURCE, image.file);
  const meta = await sharp(input).metadata();
  const width = Math.min(meta.width, image.max ?? meta.width);
  const height = Math.round((meta.height * width) / meta.width);
  const widths = [...new Set([...image.widths.filter((w) => w < width), width])].sort((a, b) => a - b);

  for (const w of widths) {
    const out = join(OUTPUT, w === width ? `${image.name}.webp` : `${image.name}-${w}.webp`);
    const info = await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: image.quality, alphaQuality: image.alphaQuality ?? 90, effort: 6, smartSubsample: true })
      .toFile(out);
    console.log(`${out.slice(root.length + 1)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
  }
  manifest[`/images/${image.name}.webp`] = { width, height, widths };
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${MANIFEST.slice(root.length + 1)} güncellendi.`);
