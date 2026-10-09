"use client";

import { useEffect, useState } from "react";
import { fetchSheetRows, isConfigured, type SheetRow, type SheetSource } from "./sheets";

export type LiveStatus = "snapshot" | "live" | "error";

/**
 * Build'de HTML'e gömülen veriyle başlar, sayfa açılınca Sheet'ten taze veriyi çeker.
 * Sheet okunamazsa gömülü veri yerinde kalır; ziyaretçi boş liste görmez.
 */
export function useLiveSheet<T>(source: SheetSource, normalize: (rows: SheetRow[]) => T[], initial: T[]) {
  const [state, setState] = useState<{ items: T[]; status: LiveStatus }>({ items: initial, status: "snapshot" });
  const { url, id, sheet, gid } = source;

  useEffect(() => {
    const src = { url, id, sheet, gid };
    if (!isConfigured(src)) return;
    let cancelled = false;
    fetchSheetRows(src, { cache: "no-store" })
      .then((rows) => {
        const items = normalize(rows);
        if (!cancelled && items.length) setState({ items, status: "live" });
      })
      .catch((error) => {
        console.warn("Sheet canlı verisi alınamadı, gömülü veri gösteriliyor:", error);
        if (!cancelled) setState((s) => ({ ...s, status: "error" }));
      });
    return () => {
      cancelled = true;
    };
    // normalize modül düzeyinde sabit bir fonksiyon
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, id, sheet, gid]);

  return state;
}
