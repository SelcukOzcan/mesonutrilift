import Link from "next/link";
import type { ReactNode } from "react";
import { CountUp } from "./CountUp";
import { MapPinIcon } from "./icons";
import { Container, Eyebrow } from "./ui";

export type Crumb = { name: string; path: string };

/** İç sayfaların başlık alanı: anasayfa hero'su ile aynı görsel dil; sağda isteğe bağlı bir alan (ör. sayaçlar). */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  aside,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  aside?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-56 -right-40 size-[38rem] rounded-full bg-plum-300/40 blur-3xl will-change-transform motion-safe:animate-aurora" />
        <div className="absolute -bottom-64 -left-32 size-[30rem] rounded-full bg-blush-300/45 blur-3xl will-change-transform motion-safe:animate-aurora-slow" />
        <div className="grain absolute inset-0" />
      </div>
      <Container className="pt-8 pb-16 lg:pt-10 lg:pb-24">
        <nav aria-label="Sayfa konumu">
          <ol className="glass inline-flex flex-wrap items-center gap-1.5 rounded-full px-4 py-1.5 text-sm text-muted">
            {crumbs.map((crumb, i) => (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-plum-300">
                    /
                  </span>
                )}
                {i < crumbs.length - 1 ? (
                  <Link href={crumb.path} className="hover:text-plum-700">
                    {crumb.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-plum-900">
                    {crumb.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[1.45fr_1fr] lg:items-end">
          <div className="max-w-3xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className="mt-3 text-[2.4rem] leading-[1.06] font-extrabold tracking-tight text-plum-900 sm:text-5xl lg:text-6xl">{title}</h1>
            {description && <p className="mt-5 text-lg leading-relaxed text-muted">{description}</p>}
          </div>
          {aside && <div className="animate-rise lg:justify-self-end">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}

/** Başlık alanında kullanılan cam efektli sayaç kartı */
export function HeroStats({ stats }: { stats: { value: number; label: string; suffix?: string }[] }) {
  return (
    <dl className="glass grid grid-flow-col divide-x divide-plum-200/70 rounded-3xl py-5">
      {stats.map((stat) => (
        <div key={stat.label} className="px-6 text-center sm:px-8">
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <CountUp value={stat.value} suffix={stat.suffix} className="block text-3xl font-extrabold text-plum-800 sm:text-4xl" />
            <span aria-hidden="true" className="mt-1 block text-sm font-medium text-muted">
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CityLinks({ cities, title, current }: { cities: { name: string; slug: string; count: number }[]; title: string; current?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-cream py-16" aria-labelledby="sehirler-baslik">
      <div aria-hidden="true" className="absolute -top-32 left-1/2 -z-10 h-64 w-[50rem] -translate-x-1/2 rounded-full bg-plum-200/40 blur-3xl" />
      <Container>
        <h2 id="sehirler-baslik" className="reveal text-center text-2xl font-bold text-plum-900">
          {title}
        </h2>
        <ul className="reveal mt-7 flex flex-wrap justify-center gap-2">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/klinikler/${city.slug}/`}
                aria-current={city.slug === current ? "page" : undefined}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink/80 ring-1 ring-line transition hover:-translate-y-0.5 hover:text-plum-800 hover:shadow-card hover:ring-plum-300 aria-[current=page]:bg-plum-700 aria-[current=page]:text-white aria-[current=page]:ring-plum-700"
              >
                <MapPinIcon className="size-3.5 text-blush-500 group-aria-[current=page]:text-blush-200" />
                {city.name}
                <span className="rounded-full bg-plum-50 px-1.5 text-xs font-semibold text-plum-700 group-aria-[current=page]:bg-white/20 group-aria-[current=page]:text-white">{city.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
