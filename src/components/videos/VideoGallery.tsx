"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SheetSource } from "@/lib/sheets";
import { fold } from "@/lib/text";
import { useLiveSheet } from "@/lib/useLiveSheet";
import { displayTitle, embedUrl, fetchYoutubeTitle, getChannels, normalizeVideos, thumbnailUrl, type Video } from "@/lib/videos";
import { CloseIcon, PlayIcon, SearchIcon } from "../icons";
import { buttonClass, cx } from "../ui";

type Props = {
  initialVideos: Video[];
  source: SheetSource;
  /** Anasayfa gibi özet kullanımlarda gösterilecek en fazla video sayısı */
  limit?: number;
  /** Kanal filtresi ve doktor araması */
  filters?: boolean;
  pageSize?: number;
  /** "grid": kart ızgarası + açılır oynatıcı · "featured": büyük öne çıkan video + oynatma listesi */
  layout?: "grid" | "featured";
  className?: string;
};

/**
 * Video kütüphanesi: Sheet'e yalnızca YouTube linki eklemek yeterli.
 * Başlık boşsa YouTube'dan otomatik alınır, kapak görseli videodan üretilir.
 */
export function VideoGallery({ initialVideos, source, limit, filters = false, pageSize = 9, layout = "grid", className }: Props) {
  const { items } = useLiveSheet(source, normalizeVideos, initialVideos);
  const [titles, setTitles] = useState(() => new Map(initialVideos.filter((v) => v.title).map((v) => [v.id, v.title])));
  const [channel, setChannel] = useState("");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(pageSize);
  const [active, setActive] = useState<Video | null>(null);

  // Sheet'e yeni eklenen ve başlığı girilmemiş videoların başlığını YouTube'dan getir.
  useEffect(() => {
    const missing = items.filter((v) => !v.title && !titles.has(v.id)).slice(0, 30);
    if (!missing.length) return;
    let cancelled = false;
    Promise.all(missing.map(async (v) => [v.id, await fetchYoutubeTitle(v.id)] as const)).then((entries) => {
      if (cancelled) return;
      setTitles((prev) => {
        const next = new Map(prev);
        for (const [id, title] of entries) next.set(id, title);
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [items, titles]);

  const videos = useMemo(() => items.map((v) => (v.title ? v : { ...v, title: titles.get(v.id) ?? "" })), [items, titles]);
  const channels = useMemo(() => getChannels(videos), [videos]);

  const filtered = useMemo(() => {
    const terms = fold(query).split(" ").filter(Boolean);
    return videos.filter((v) => {
      if (channel && v.channel !== channel) return false;
      const text = fold(`${v.title} ${v.doctor} ${v.channel}`);
      return terms.every((t) => text.includes(t));
    });
  }, [videos, channel, query]);

  const visible = filtered.slice(0, limit ?? shown);

  if (layout === "featured") return <FeaturedPlaylist videos={visible} className={className} />;

  return (
    <div className={className}>
      {filters && (
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            <FilterChip active={!channel} onClick={() => setChannel("")} label="Tüm kanallar" count={videos.length} />
            {channels.map((c) => (
              <FilterChip key={c.name} active={channel === c.name} onClick={() => setChannel(c.name)} label={c.name} count={c.count} />
            ))}
          </div>
          <label className="relative block lg:w-80">
            <span className="sr-only">Doktor veya program ara</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShown(pageSize);
              }}
              placeholder="Doktor veya program ara"
              className="h-12 w-full rounded-full border-0 bg-white pr-4 pl-12 text-[0.9375rem] ring-1 ring-line placeholder:text-muted/80 focus:ring-2 focus:ring-plum-400 focus:outline-none"
            />
          </label>
        </div>
      )}

      {visible.length > 0 ? (
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((video) => (
            <li key={video.id}>
              <VideoCard video={video} onPlay={() => setActive(video)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl bg-white px-6 py-12 text-center text-muted ring-1 ring-line">Aramanıza uygun yayın bulunamadı.</p>
      )}

      {!limit && filtered.length > shown && (
        <div className="mt-12 text-center">
          <button type="button" onClick={() => setShown((n) => n + pageSize)} className={buttonClass({ variant: "secondary", size: "lg" })}>
            Daha fazla yükle
          </button>
        </div>
      )}

      <VideoDialog video={active} onClose={() => setActive(null)} />
    </div>
  );
}

function FeaturedPlaylist({ videos, className }: { videos: Video[]; className?: string }) {
  const [currentId, setCurrentId] = useState<string>();
  const [playing, setPlaying] = useState(false);
  const current = videos.find((v) => v.id === currentId) ?? videos[0];
  if (!current) return null;
  const title = displayTitle(current);

  return (
    <div className={cx("grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-start lg:gap-8", className)}>
      <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-plum-950 shadow-lift">
        {playing ? (
          <iframe
            key={current.id}
            src={embedUrl(current.id)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 text-left" aria-label={`Videoyu oynat: ${title}`}>
            <FeaturedThumb key={current.id} id={current.id} />
            <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-plum-950/85 via-plum-950/20 to-transparent" />
            <span aria-hidden="true" className="absolute top-1/2 left-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center sm:size-24">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-white/40" />
              <span className="relative grid size-full place-items-center rounded-full bg-white text-plum-700 shadow-lift transition-transform duration-500 group-hover:scale-110">
                <PlayIcon className="ml-1 size-8 sm:size-9" />
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
              {current.channel && <span className="glass mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold text-plum-900">{current.channel}</span>}
              <span className="block max-w-xl text-lg leading-snug font-bold sm:text-2xl">{title}</span>
              {current.doctor && <span className="mt-1 block text-sm text-white/75">{current.doctor}</span>}
            </span>
          </button>
        )}
      </div>

      <ul className="scrollbar-none -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:max-h-[27rem] lg:flex-col lg:overflow-y-auto lg:px-0 lg:pr-1">
        {videos.map((video) => {
          const isCurrent = video.id === current.id;
          return (
            <li key={video.id} className="w-72 shrink-0 snap-start lg:w-auto">
              <button
                type="button"
                onClick={() => {
                  setCurrentId(video.id);
                  setPlaying(true);
                }}
                aria-current={isCurrent || undefined}
                className={cx("group flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors", isCurrent ? "bg-white shadow-card ring-1 ring-plum-200" : "hover:bg-plum-50")}
              >
                <span className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-plum-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailUrl(video.id)} alt="" width={480} height={360} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <span aria-hidden="true" className={cx("absolute inset-0 grid place-items-center bg-plum-950/40 transition-opacity", isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                    {isCurrent && playing ? <Equalizer /> : <PlayIcon className="size-6 text-white" />}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className={cx("line-clamp-2 text-sm leading-snug font-semibold", isCurrent ? "text-plum-800" : "text-ink")}>{displayTitle(video)}</span>
                  {(video.doctor || video.channel) && <span className="mt-1 block truncate text-xs text-muted">{video.doctor || video.channel}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Yüksek çözünürlüklü kapak; video için yoksa standart kapağa düşer. */
function FeaturedThumb({ id }: { id: string }) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      decoding="async"
      onLoad={(e) => e.currentTarget.naturalWidth < 400 && setSrc(thumbnailUrl(id))}
      onError={() => setSrc(thumbnailUrl(id))}
      className="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
    />
  );
}

function Equalizer() {
  return (
    <span className="flex h-5 items-end gap-0.5">
      {[0, 0.2, 0.4].map((delay) => (
        <span key={delay} className="w-1 animate-[equalizer_0.9s_ease-in-out_infinite] rounded-full bg-white" style={{ animationDelay: `${delay}s` }} />
      ))}
    </span>
  );
}

function VideoCard({ video, onPlay }: { video: Video; onPlay: () => void }) {
  const title = displayTitle(video);
  return (
    <button type="button" onClick={onPlay} className="group block w-full text-left" aria-label={`Videoyu oynat: ${title}`}>
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-plum-100 shadow-card transition duration-500 group-hover:-translate-y-1 group-hover:shadow-lift">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl(video.id)} alt="" width={480} height={360} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-plum-950/50 via-transparent to-transparent" />
        <span aria-hidden="true" className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-plum-700 shadow-lift transition-transform duration-300 group-hover:scale-110">
          <PlayIcon className="ml-0.5 size-6" />
        </span>
        {video.channel && <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-plum-800">{video.channel}</span>}
      </div>
      <h3 className="mt-4 line-clamp-2 leading-snug font-semibold text-ink transition-colors group-hover:text-plum-700">{title}</h3>
      {video.doctor && <p className="mt-1 text-sm text-muted">{video.doctor}</p>}
    </button>
  );
}

function VideoDialog({ video, onClose }: { video: Video | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (video && dialog && !dialog.open) dialog.showModal();
  }, [video]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-label={video ? displayTitle(video) : "Video"}
      className="m-auto w-[min(64rem,calc(100%-2rem))] overflow-hidden rounded-3xl bg-plum-950 p-0 text-white backdrop:bg-plum-950/80 backdrop:backdrop-blur-sm"
    >
      {video && (
        <>
          <div className="aspect-video bg-black">
            <iframe
              src={embedUrl(video.id)}
              title={displayTitle(video)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="size-full"
            />
          </div>
          <div className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="font-semibold">{displayTitle(video)}</p>
              {(video.doctor || video.channel) && <p className="mt-1 text-sm text-white/60">{[video.doctor, video.channel].filter(Boolean).join(" · ")}</p>}
            </div>
            <button type="button" onClick={() => ref.current?.close()} className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Videoyu kapat">
              <CloseIcon className="size-5" />
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}

function FilterChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active ? "bg-plum-700 text-white" : "bg-white text-ink/80 ring-1 ring-line hover:ring-plum-300",
      )}
    >
      {label}
      <span className={cx("rounded-full px-1.5 text-xs font-semibold", active ? "bg-white/20" : "bg-plum-50 text-plum-700")}>{count}</span>
    </button>
  );
}
