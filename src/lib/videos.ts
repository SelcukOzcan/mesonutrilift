import { isNo, isYes, pick, type SheetRow } from "./sheets";

export type Video = {
  /** YouTube video kimliği (11 karakter) */
  id: string;
  url: string;
  /** Sheet'teki başlık; boşsa YouTube'dan otomatik doldurulur */
  title: string;
  doctor: string;
  channel: string;
  /** YYYY-MM-DD ya da boş */
  date: string;
  featured: boolean;
};

const COLUMNS = {
  link: ["video linki", "video", "link", "youtube linki", "youtube", "url"],
  title: ["baslik", "video basligi"],
  doctor: ["doktor", "uzman", "hekim"],
  channel: ["kanal", "program", "kanal / program"],
  date: ["tarih", "yayin tarihi"],
  featured: ["one cikan"],
  active: ["aktif", "yayinda"],
} as const;

const ID_PATTERN = /^[\w-]{11}$/;

/** watch?v=, youtu.be/, /embed/, /shorts/, /live/ ve çıplak ID biçimlerini tanır. */
export function youtubeId(input: string): string | null {
  const value = input.trim();
  if (ID_PATTERN.test(value)) return value;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/")[1];
      return id && ID_PATTERN.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const v = url.searchParams.get("v");
      if (v && ID_PATTERN.test(v)) return v;
      const [, kind, id] = url.pathname.split("/");
      if (["embed", "shorts", "live", "v"].includes(kind) && id && ID_PATTERN.test(id)) return id;
    }
  } catch {
    // geçersiz bağlantı
  }
  return null;
}

/** "02.02.2020", "2/2/2020" (gün/ay), "2020-02-02" → "2020-02-02" */
export function parseDate(raw: string): string {
  const value = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const m = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
}

export function normalizeVideos(rows: SheetRow[]): Video[] {
  const seen = new Set<string>();
  const videos: Video[] = [];

  for (const row of rows) {
    const active = pick(row, COLUMNS.active);
    if (active && isNo(active)) continue;
    const id = youtubeId(pick(row, COLUMNS.link));
    if (!id || seen.has(id)) continue;
    seen.add(id);
    videos.push({
      id,
      url: `https://www.youtube.com/watch?v=${id}`,
      title: pick(row, COLUMNS.title),
      doctor: pick(row, COLUMNS.doctor),
      channel: pick(row, COLUMNS.channel),
      date: parseDate(pick(row, COLUMNS.date)),
      featured: isYes(pick(row, COLUMNS.featured)),
    });
  }

  return videos.map((v, i) => ({ v, i })).sort((a, b) => Number(b.v.featured) - Number(a.v.featured) || a.i - b.i).map(({ v }) => v);
}

export const thumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const embedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

export function displayTitle(video: Video): string {
  return video.title || [video.doctor, video.channel].filter(Boolean).join(" · ") || "MesoNutrilift TV yayını";
}

/** YouTube oEmbed ile video başlığını getirir (tarayıcıda ve build'de çalışır). */
export async function fetchYoutubeTitle(id: string, init?: RequestInit): Promise<string> {
  try {
    const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`;
    const res = await fetch(url, init);
    if (!res.ok) return "";
    const data = (await res.json()) as { title?: string };
    return data.title?.trim() ?? "";
  } catch {
    return "";
  }
}

export async function withTitles(videos: Video[], init?: RequestInit, known = new Map<string, string>()): Promise<Video[]> {
  return Promise.all(
    videos.map(async (video) => (video.title ? video : { ...video, title: known.get(video.id) || (await fetchYoutubeTitle(video.id, init)) })),
  );
}

export function getChannels(videos: Video[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const v of videos) if (v.channel) counts.set(v.channel, (counts.get(v.channel) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}
