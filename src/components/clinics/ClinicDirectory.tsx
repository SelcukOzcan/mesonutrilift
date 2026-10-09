"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCities, normalizeClinics, type Clinic } from "@/lib/clinics";
import type { SheetSource } from "@/lib/sheets";
import { compareTr, fold, locative } from "@/lib/text";
import { useLiveSheet } from "@/lib/useLiveSheet";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, CloseIcon, GlobeIcon, InstagramIcon, MapPinIcon, PhoneIcon, SearchIcon, WhatsappIcon } from "../icons";
import { buttonClass, cx } from "../ui";

type Props = {
  initialClinics: Clinic[];
  source: SheetSource;
  /** Şehir sayfalarında (ör. /klinikler/istanbul/) varsayılan il */
  presetCity?: string;
  perPage?: number;
};

export function ClinicDirectory({ initialClinics, source, presetCity = "", perPage = 10 }: Props) {
  const { items: clinics } = useLiveSheet(source, normalizeClinics, initialClinics);
  const [city, setCity] = useState(presetCity);
  const [district, setDistrict] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const [urlReady, setUrlReady] = useState(false);

  // Filtreler URL'de tutulur (?il=ankara&ilce=cankaya&q=...): reklamlar ve paylaşımlar filtreli listeye düşebilir.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("il")) setCity(params.get("il")!);
    if (params.get("ilce")) setDistrict(params.get("ilce")!);
    if (params.get("q")) setQuery(params.get("q")!);
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    // Yalnızca kendi parametrelerimiz değişir; gclid, utm_* gibi reklam parametreleri korunur.
    const params = new URLSearchParams(window.location.search);
    const set = (key: string, value: string) => (value ? params.set(key, value) : params.delete(key));
    set("il", city && city !== presetCity ? city : "");
    set("ilce", district);
    set("q", query.trim());
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(null, "", next);
  }, [urlReady, city, district, query, presetCity]);

  const cities = useMemo(() => getCities(clinics), [clinics]);
  const districts = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; count: number }>();
    for (const c of clinics) {
      if (c.citySlug !== city || !c.districtSlug) continue;
      const d = map.get(c.districtSlug) ?? { name: c.district, slug: c.districtSlug, count: 0 };
      d.count += 1;
      map.set(c.districtSlug, d);
    }
    return [...map.values()].sort((a, b) => compareTr(a.name, b.name));
  }, [clinics, city]);

  const searchIndex = useMemo(() => clinics.map((c) => ({ clinic: c, text: fold(`${c.name} ${c.city} ${c.district} ${c.area} ${c.address}`) })), [clinics]);

  const filtered = useMemo(() => {
    const terms = fold(query).split(" ").filter(Boolean);
    return searchIndex
      .filter(({ clinic, text }) => (!city || clinic.citySlug === city) && (!district || clinic.districtSlug === district) && terms.every((t) => text.includes(t)))
      .map(({ clinic }) => clinic);
  }, [searchIndex, city, district, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * perPage;
  const selectedCity = cities.find((c) => c.slug === city);
  const hasFilters = Boolean(city || district || query);

  const chooseCity = (slug: string) => {
    setCity(slug);
    setDistrict("");
    setPage(1);
  };
  const clearFilters = () => {
    setCity("");
    setDistrict("");
    setQuery("");
    setPage(1);
  };
  const goToPage = (n: number) => {
    setPage(n);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <div className="relative z-10 rounded-[2rem] bg-white/90 p-4 shadow-lift ring-1 ring-white backdrop-blur-xl sm:p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_14rem_14rem]">
          <label className="relative col-span-2 block md:col-span-1">
            <span className="sr-only">Klinik, doktor veya ilçe ara</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Klinik, doktor veya ilçe ara"
              className="h-12 w-full rounded-2xl border-0 bg-cream pr-4 pl-12 text-[0.9375rem] text-ink ring-1 ring-line placeholder:text-muted/80 focus:bg-white focus:ring-2 focus:ring-plum-400 focus:outline-none"
            />
          </label>
          <Select label="İl seçin" value={city} onChange={chooseCity} placeholder={`Tüm iller (${clinics.length})`}>
            {[...cities].sort((a, b) => compareTr(a.name, b.name)).map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.count})
              </option>
            ))}
          </Select>
          <Select
            label="İlçe seçin"
            value={district}
            onChange={(v) => {
              setDistrict(v);
              setPage(1);
            }}
            placeholder={city ? "Tüm ilçeler" : "Önce il seçin"}
            disabled={!city || districts.length === 0}
          >
            {districts.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name} ({d.count})
              </option>
            ))}
          </Select>
        </div>

        <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={!city} onClick={() => chooseCity("")} label="Tümü" count={clinics.length} />
          {cities.slice(0, 7).map((c) => (
            <Chip key={c.slug} active={city === c.slug} onClick={() => chooseCity(c.slug)} label={c.name} count={c.count} />
          ))}
        </div>
      </div>

      <div ref={listRef} className="scroll-mt-24">
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            <strong className="font-semibold text-ink">{filtered.length}</strong> klinik
            {selectedCity && <> · {locative(selectedCity.name)}</>}
            {totalPages > 1 && (
              <span className="hidden sm:inline">
                {" "}
                · Sayfa {currentPage}/{totalPages}
              </span>
            )}
          </p>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1.5 text-sm font-semibold text-plum-700 hover:text-plum-900">
              <CloseIcon className="size-4" />
              Filtreleri temizle
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="mt-4 hidden grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)_auto] gap-8 px-6 text-xs font-bold tracking-[0.14em] text-muted uppercase md:grid">
              <span>Klinik / Doktor</span>
              <span>Adres</span>
              <span className="w-[19rem] text-right">İletişim</span>
            </div>
            {/* Tüm sonuçlar HTML'de yer alır (arama motorları ve yapay zeka botları tam listeyi okur); sayfalama yalnızca görünümü değiştirir. */}
            <ul className="mt-3 space-y-3">
              {filtered.map((clinic, i) => (
                <ClinicRow key={clinic.id} clinic={clinic} hidden={i < pageStart || i >= pageStart + perPage} />
              ))}
            </ul>
          </>
        ) : (
          <div className="mt-4 rounded-[2rem] bg-cream px-6 py-14 text-center ring-1 ring-line">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-plum-700 shadow-card">
              <SearchIcon className="size-6" />
            </span>
            <p className="mt-5 text-lg font-semibold text-plum-900">Bu kriterlere uygun klinik bulunamadı.</p>
            <p className="mt-2 text-muted">Farklı bir il seçebilir ya da arama ifadenizi değiştirebilirsiniz.</p>
            <button type="button" onClick={clearFilters} className={buttonClass({ variant: "secondary" }, "mt-6")}>
              Tüm klinikleri göster
            </button>
          </div>
        )}

        {totalPages > 1 && <Pagination current={currentPage} total={totalPages} onChange={goToPage} />}
      </div>
    </div>
  );
}

const AVATAR_TONES = ["from-plum-500 to-plum-800", "from-blush-400 to-blush-600", "from-plum-400 to-blush-500", "from-plum-700 to-plum-950"];
function avatarTone(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

function ClinicRow({ clinic, hidden }: { clinic: Clinic; hidden: boolean }) {
  const location = clinic.district ? `${clinic.district}, ${clinic.city}` : clinic.city;
  const track = { "data-clinic-name": clinic.name, "data-clinic-city": clinic.city, "data-clinic-district": clinic.district };

  return (
    <li
      hidden={hidden}
      className="group rounded-3xl bg-white p-5 ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-plum-200 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)_auto] md:items-center md:gap-8 md:px-6">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className={cx("grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br text-sm font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105", avatarTone(clinic.name))}>
          {clinic.initials}
        </span>
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-plum-50 px-2.5 py-0.5 text-[0.6875rem] font-bold tracking-[0.08em] text-plum-700 uppercase">{clinic.kind}</span>
            {clinic.featured && <span className="rounded-full bg-blush-100 px-2.5 py-0.5 text-[0.6875rem] font-bold tracking-[0.08em] text-blush-700 uppercase">Öne çıkan</span>}
          </div>
          <h3 className="leading-snug font-semibold text-ink">{clinic.name}</h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm font-medium text-plum-700">
            <MapPinIcon className="size-4 shrink-0" />
            {location}
            {clinic.area && <span className="font-normal text-muted">· {clinic.area}</span>}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted md:mt-0 md:pl-0">{clinic.address}</p>
      <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:w-[19rem] md:justify-end">
        {clinic.phone && (
          <a href={clinic.phoneHref} className={buttonClass({ size: "sm" }, "flex-1 whitespace-nowrap md:flex-none")} data-event="Clinic_Phone_Click" {...track}>
            <PhoneIcon className="size-4" />
            {clinic.phone}
          </a>
        )}
        {clinic.website ? (
          <a href={clinic.website} target="_blank" rel="noopener" className={buttonClass({ variant: "secondary", size: "sm" }, "flex-1 md:flex-none")} data-event="Clinic_Click" {...track}>
            <GlobeIcon className="size-4" />
            Web sitesi
          </a>
        ) : (
          clinic.instagram && (
            <a href={clinic.instagram} target="_blank" rel="noopener" className={buttonClass({ variant: "secondary", size: "sm" }, "flex-1 md:flex-none")} data-event="Clinic_Click" {...track}>
              <InstagramIcon className="size-4" />
              Instagram
            </a>
          )
        )}
        {clinic.whatsappHref && (
          <a href={clinic.whatsappHref} target="_blank" rel="noopener" aria-label={`${clinic.name} WhatsApp`} className={buttonClass({ variant: "secondary", size: "sm" }, "w-9 px-0")} data-event="Clinic_Whatsapp_Click" {...track}>
            <WhatsappIcon className="size-4" />
          </a>
        )}
      </div>
    </li>
  );
}

function Select({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-12 w-full appearance-none rounded-2xl border-0 bg-cream pr-10 pl-4 text-[0.9375rem] font-medium text-ink ring-1 ring-line focus:bg-white focus:ring-2 focus:ring-plum-400 focus:outline-none disabled:cursor-not-allowed disabled:text-muted/70"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" />
    </label>
  );
}

function Chip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
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

function pageTokens(total: number, current: number): (number | "…")[] {
  const pages = [...new Set([1, total, current - 1, current, current + 1])].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return pages.flatMap((p, i) => (i > 0 && p - pages[i - 1] > 1 ? (["…", p] as const) : [p]));
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (page: number) => void }) {
  const base = "grid size-10 place-items-center rounded-full text-sm font-semibold transition-colors";
  return (
    <nav aria-label="Sayfalama" className="mt-8 flex items-center justify-center gap-1.5">
      <button type="button" onClick={() => onChange(current - 1)} disabled={current === 1} aria-label="Önceki sayfa" className={cx(base, "text-plum-800 ring-1 ring-line hover:bg-plum-50 disabled:opacity-40")}>
        <ArrowLeftIcon className="size-4" />
      </button>
      {pageTokens(total, current).map((token, i) =>
        token === "…" ? (
          <span key={`gap-${i}`} className="w-6 text-center text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={token}
            type="button"
            onClick={() => onChange(token)}
            aria-current={token === current ? "page" : undefined}
            aria-label={`${token}. sayfa`}
            className={cx(base, token === current ? "bg-plum-700 text-white" : "text-ink hover:bg-plum-50")}
          >
            {token}
          </button>
        ),
      )}
      <button type="button" onClick={() => onChange(current + 1)} disabled={current === total} aria-label="Sonraki sayfa" className={cx(base, "text-plum-800 ring-1 ring-line hover:bg-plum-50 disabled:opacity-40")}>
        <ArrowRightIcon className="size-4" />
      </button>
    </nav>
  );
}
