"use client";

import images from "@/content/images.json";

type Entry = { width: number; height: number; widths: number[] };
const manifest: Record<string, Entry> = images;

/**
 * next/image yükleyicisi. `npm run images` ile üretilen varyantlardan istenen genişliği
 * karşılayan en küçüğünü seçer: /images/hero.webp → /images/hero-640.webp.
 * Listede olmayan görseller (ör. henüz taşınmamış uzak adresler) olduğu gibi kullanılır.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const entry = manifest[src];
  if (!entry) return src;
  const chosen = entry.widths.find((w) => w >= width) ?? entry.width;
  return chosen >= entry.width ? src : src.replace(/\.webp$/, `-${chosen}.webp`);
}
