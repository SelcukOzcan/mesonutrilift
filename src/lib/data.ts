/**
 * Build zamanı veri yükleyicileri (yalnızca Server Component'lerde kullanılır).
 * Sheet'ten okunan veri HTML'e gömülür: sayfa anında açılır, arama motorları ve
 * yapay zeka botları içeriği görür. Tarayıcıda ayrıca canlı veri çekilip liste güncellenir.
 * Sheet tanımlı değilse ya da okunamazsa src/data altındaki yedek veri kullanılır.
 */
import clinicsFallback from "@/data/clinics.fallback.json";
import videosFallback from "@/data/videos.fallback.json";
import { site } from "./content";
import { normalizeClinics, type Clinic } from "./clinics";
import { fetchSheetRows, isConfigured, toSheetRow, type SheetRow, type SheetSource } from "./sheets";
import { normalizeVideos, withTitles, type Video } from "./videos";

async function loadRows(label: string, source: SheetSource, fallback: Record<string, unknown>[]): Promise<SheetRow[]> {
  if (isConfigured(source)) {
    try {
      const rows = await fetchSheetRows(source);
      if (rows.length) return rows;
      console.warn(`[${label}] Sheet boş döndü, yedek veri kullanılıyor.`);
    } catch (error) {
      console.warn(`[${label}] Sheet okunamadı, yedek veri kullanılıyor:`, error instanceof Error ? error.message : error);
    }
  }
  return fallback.map(toSheetRow);
}

let clinicsPromise: Promise<Clinic[]> | undefined;
export function getClinics(): Promise<Clinic[]> {
  clinicsPromise ??= loadRows("klinikler", site.sheets.clinics, clinicsFallback).then(normalizeClinics);
  return clinicsPromise;
}

let videosPromise: Promise<Video[]> | undefined;
export function getVideos(): Promise<Video[]> {
  videosPromise ??= loadRows("videolar", site.sheets.videos, videosFallback)
    .then(normalizeVideos)
    .then((videos) => withTitles(videos));
  return videosPromise;
}
