"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { fold } from "@/lib/text";
import { ArrowRightIcon, MapPinIcon, SearchIcon } from "../icons";
import { cx } from "../ui";

export type QuickClinic = { name: string; city: string; citySlug: string; district: string; districtSlug: string };
type QuickCity = { name: string; slug: string; count: number };

type Suggestion = { key: string; href: string; title: string; meta: string; kind: "city" | "district" | "clinic" };

/** Yazdıkça il, ilçe ve klinik öneren arama kutusu; seçim doğrudan klinik listesine götürür. */
export function ClinicQuickSearch({ clinics, cities }: { clinics: QuickClinic[]; cities: QuickCity[] }) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const districts = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; city: string; citySlug: string; count: number }>();
    for (const c of clinics) {
      if (!c.districtSlug) continue;
      const key = `${c.citySlug}/${c.districtSlug}`;
      const d = map.get(key) ?? { name: c.district, slug: c.districtSlug, city: c.city, citySlug: c.citySlug, count: 0 };
      d.count += 1;
      map.set(key, d);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [clinics]);

  const suggestions = useMemo<Suggestion[]>(() => {
    const terms = fold(query).split(" ").filter(Boolean);
    if (!terms.length) return [];
    const cityHits = cities
      .filter((c) => terms.every((t) => fold(c.name).includes(t)))
      .slice(0, 2)
      .map((c) => ({ key: `c-${c.slug}`, href: `/klinikler/${c.slug}/`, title: c.name, meta: `${c.count} klinik`, kind: "city" as const }));
    const districtHits = districts
      .filter((d) => terms.every((t) => fold(`${d.name} ${d.city}`).includes(t)))
      .slice(0, 2)
      .map((d) => ({
        key: `d-${d.citySlug}-${d.slug}`,
        href: `/klinikler/${d.citySlug}/?ilce=${d.slug}`,
        title: `${d.name}, ${d.city}`,
        meta: `${d.count} klinik`,
        kind: "district" as const,
      }));
    const clinicHits = clinics
      .filter((c) => terms.every((t) => fold(`${c.name} ${c.district} ${c.city}`).includes(t)))
      .slice(0, Math.max(2, 6 - cityHits.length - districtHits.length))
      .map((c, i) => ({
        key: `k-${i}-${c.name}`,
        href: `/klinikler/${c.citySlug}/?q=${encodeURIComponent(c.name)}`,
        title: c.name,
        meta: [c.district, c.city].filter(Boolean).join(", "),
        kind: "clinic" as const,
      }));
    return [...cityHits, ...districtHits, ...clinicHits];
  }, [query, clinics, cities, districts]);

  const submit = () => {
    const pick = suggestions[active];
    if (pick) return router.push(pick.href);
    const q = query.trim();
    router.push(q ? `/klinikler/?q=${encodeURIComponent(q)}` : "/klinikler/");
  };

  const showList = open && query.trim().length > 0;

  return (
    <div className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="glass flex items-center gap-2 rounded-full p-2 pl-5"
      >
        <SearchIcon className="size-5 shrink-0 text-plum-700" />
        <label htmlFor={`${listId}-input`} className="sr-only">
          İl, ilçe veya doktor adı
        </label>
        <input
          id={`${listId}-input`}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, suggestions.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, -1));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="İl, ilçe veya doktor adı yazın"
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${listId}-list`}
          aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
          className="h-12 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
        />
        <button type="submit" className="shine inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-plum-700 px-5 font-semibold text-white hover:bg-plum-800">
          <span className="hidden sm:inline">Klinik bul</span>
          <ArrowRightIcon className="size-5" />
        </button>
      </form>

      {showList && (
        <ul id={`${listId}-list`} role="listbox" className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-3xl bg-white p-2 text-ink shadow-lift ring-1 ring-line">
          {suggestions.length ? (
            suggestions.map((s, i) => (
              <li key={s.key} id={`${listId}-opt-${i}`} role="option" aria-selected={i === active}>
                <Link
                  href={s.href}
                  className={cx("flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors", i === active ? "bg-plum-50" : "hover:bg-plum-50")}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className={cx("grid size-9 shrink-0 place-items-center rounded-xl", s.kind === "clinic" ? "bg-blush-100 text-blush-700" : "bg-plum-700 text-white")}>
                    <MapPinIcon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{s.title}</span>
                    <span className="block truncate text-sm text-muted">{s.kind === "city" ? `Tüm ${s.title} klinikleri · ${s.meta}` : s.kind === "district" ? `İlçedeki tüm klinikler · ${s.meta}` : s.meta}</span>
                  </span>
                  <ArrowRightIcon className="size-4 shrink-0 text-plum-400" />
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-muted">
              Eşleşen sonuç yok. Enter&apos;a basarak tüm klinikleri arayın.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
