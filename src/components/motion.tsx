"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "./ui";

const canAnimate = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * İmleç hareketine göre --mx/--my (-1…1) değişkenlerini günceller.
 * İçindeki `.parallax-layer` öğeleri `--depth` değerine göre kayar. Dokunmatik cihazlarda kapalıdır.
 */
export function ParallaxStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", (((e.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
        el.style.setProperty("--my", (((e.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** İçindeki `[data-spot]` kartlarına imleç konumunu --x/--y olarak verir (`spotlight` sınıfıyla ışık efekti). */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spot]");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={ref} className={cx(className)}>
      {children}
    </div>
  );
}
