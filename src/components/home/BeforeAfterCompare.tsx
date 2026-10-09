"use client";

import { useState } from "react";
import type { ImageAsset } from "@/content/types";
import { cx } from "../ui";

/**
 * Sürüklenebilir öncesi/sonrası karşılaştırma. Mevcut görsellerin sol yarısı "öncesi",
 * sağ yarısı "sonrası" olduğu için tek görsel iki katmana bölünerek kullanılır.
 * Klavye ile de çalışır (sol/sağ ok tuşları).
 */
export function BeforeAfterCompare({ images }: { images: ImageAsset[] }) {
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState(50);
  const image = images[index];

  return (
    <div>
      <div className="relative mx-auto aspect-[370/490] w-full max-w-[26rem] touch-pan-y overflow-hidden rounded-[2rem] bg-plum-100 shadow-lift ring-4 ring-white select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={`${image.alt} – sonrası`} draggable={false} className="absolute inset-y-0 -left-full h-full w-[200%] max-w-none" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={`${image.alt} – öncesi`} draggable={false} className="absolute inset-y-0 left-0 h-full w-[200%] max-w-none" />
        </div>

        <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold tracking-[0.14em] text-ink uppercase">Öncesi</span>
        <span className="absolute top-4 right-4 rounded-full bg-plum-700 px-3 py-1 text-xs font-bold tracking-[0.14em] text-white uppercase">Sonrası</span>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Öncesi ve sonrası karşılaştırma çizgisi"
          className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgb(0_0_0/0.25)] peer-focus-visible:[&>span]:ring-4"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-plum-700 shadow-lift ring-plum-400">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
            </svg>
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2" role="group" aria-label="Vaka seçin">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => {
              setIndex(i);
              setPos(50);
            }}
            aria-label={`Vaka ${i + 1}`}
            aria-pressed={i === index}
            className={cx(
              "size-14 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-cream transition",
              i === index ? "ring-plum-600" : "ring-transparent opacity-70 hover:opacity-100",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="" loading="lazy" className="h-full w-[200%] max-w-none -translate-x-1/2 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
