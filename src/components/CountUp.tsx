import type { CSSProperties } from "react";
import { cx } from "./ui";

/**
 * JavaScript'siz sayaç: sayı CSS ile 0'dan hedefe akar. Gerçek değer ekran okuyucular ve
 * botlar için metin olarak da sayfadadır. `onView`: ekrana girince sayar (aksi halde sayfa açılınca).
 */
export function CountUp({ value, suffix = "", onView = false, className }: { value: number; suffix?: string; onView?: boolean; className?: string }) {
  return (
    <span className={cx("tabular-nums", className)}>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden="true" className={cx("count-up", onView && "count-up-view")} style={{ "--to": value } as CSSProperties} />
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}
