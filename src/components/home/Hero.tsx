import Image from "next/image";
import type { CSSProperties } from "react";
import { home, media, site } from "@/lib/content";
import { CountUp } from "../CountUp";
import { DnaIcon, MapPinIcon, SparkleIcon } from "../icons";
import { ParallaxStage } from "../motion";
import { ButtonLink, Container } from "../ui";

const depth = (value: number) => ({ "--depth": value }) as CSSProperties;

/** Görselin çevresinde süzülen içerik etiketlerinin konumları (mobilde son etiket gizlenir) */
const chipPlacements = [
  { className: "top-[14%] -right-1 sm:-right-4", depth: 22, delay: "0s" },
  { className: "top-[48%] -left-2 sm:-left-8", depth: 30, delay: "-2.4s" },
  { className: "bottom-[26%] -right-2 hidden sm:block sm:-right-6", depth: 16, delay: "-4.8s" },
];

export function Hero({ clinicCount, cityCount }: { clinicCount: number; cityCount: number }) {
  const { hero } = home;
  const [titleStart, titleEnd = ""] = hero.title.split(site.name);

  return (
    <section className="relative isolate overflow-hidden bg-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-56 -right-40 size-[46rem] rounded-full bg-plum-300/45 blur-3xl will-change-transform motion-safe:animate-aurora" />
        <div className="absolute -bottom-64 -left-48 size-[38rem] rounded-full bg-blush-300/55 blur-3xl will-change-transform motion-safe:animate-aurora-slow" />
        <div className="absolute top-1/4 left-[45%] size-[22rem] rounded-full bg-plum-200/60 blur-3xl will-change-transform motion-safe:animate-aurora [animation-delay:-9s]" />
        <div className="grain absolute inset-0" />
      </div>

      <Container className="grid items-center gap-14 pt-8 pb-14 lg:grid-cols-[1.02fr_1fr] lg:gap-10 lg:pt-12 lg:pb-16">
        <div>
          <p className="glass inline-flex animate-rise items-center gap-2.5 rounded-full px-4 py-1.5 text-sm font-semibold text-plum-800">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-blush-500" />
              <span className="relative size-2 rounded-full bg-blush-500" />
            </span>
            {hero.eyebrow}
          </p>

          <h1 className="mt-6 text-[2.6rem] leading-[1.04] font-extrabold tracking-tight text-plum-900 sm:text-6xl lg:text-[4.1rem]">
            {titleStart}
            <span className="text-shimmer">{site.name}</span>
            {titleEnd}
          </h1>
          <p className="mt-3 text-lg font-semibold text-blush-600">{site.tagline}</p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>

          <div className="mt-8 flex animate-rise flex-col gap-3 [animation-delay:120ms] sm:flex-row">
            <ButtonLink href={hero.primaryCta.href} size="lg" className="shine">
              <MapPinIcon className="size-5" />
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary" size="lg">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          <dl className="glass mt-10 grid max-w-lg animate-rise grid-cols-3 divide-x divide-plum-200/70 rounded-3xl py-4 [animation-delay:240ms]">
            {[
              { value: clinicCount, suffix: "", label: hero.stats.clinicsLabel },
              { value: cityCount, suffix: "", label: hero.stats.citiesLabel },
              { value: hero.stats.countries, suffix: "+", label: hero.stats.countriesLabel },
            ].map((stat) => (
              <div key={stat.label} className="px-4 text-center sm:px-5">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <CountUp value={stat.value} suffix={stat.suffix} className="block text-2xl font-extrabold text-plum-800 sm:text-3xl" />
                  <span aria-hidden="true" className="mt-0.5 block text-xs font-medium text-muted sm:text-sm">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ParallaxStage className="relative mx-auto w-full max-w-[32rem] lg:max-w-none lg:pl-6">
          <div className="parallax-layer relative" style={depth(6)}>
            <div className="relative aspect-[4/5] animate-settle overflow-hidden rounded-t-[18rem] rounded-b-[2.5rem] bg-white shadow-lift ring-[6px] ring-white/80">
              <Image
                src={media.hero.src}
                alt={media.hero.alt}
                fill
                preload
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-plum-900/30 via-transparent to-transparent" />
            </div>
          </div>

          {/* Dönen rozet */}
          <div aria-hidden="true" className="parallax-layer absolute -top-3 left-0 sm:-left-2 lg:left-0" style={depth(18)}>
            <div className="glass relative grid size-28 place-items-center rounded-full sm:size-32">
              <svg viewBox="0 0 120 120" className="absolute inset-0 size-full motion-safe:animate-spin-slow">
                <defs>
                  <path id="hero-badge-circle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
                </defs>
                <text className="fill-plum-800 text-[9px] font-bold tracking-[0.2em] uppercase">
                  <textPath href="#hero-badge-circle" textLength="282" lengthAdjust="spacing">
                    {hero.badge}
                  </textPath>
                </text>
              </svg>
              <span className="grid size-11 place-items-center rounded-full bg-plum-700 text-white shadow-lg sm:size-12">
                <DnaIcon className="size-6" />
              </span>
            </div>
          </div>

          {/* Süzülen içerik etiketleri */}
          {hero.chips.slice(0, chipPlacements.length).map((chip, i) => {
            const place = chipPlacements[i];
            return (
              <div key={chip} aria-hidden="true" className={`parallax-layer absolute ${place.className}`} style={depth(place.depth)}>
                <span
                  className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap text-plum-900 motion-safe:animate-float"
                  style={{ animationDelay: place.delay }}
                >
                  <SparkleIcon className="size-4 text-blush-500" />
                  {chip}
                </span>
              </div>
            );
          })}

          {/* Ürün kartı */}
          <div className="parallax-layer absolute bottom-5 left-2 sm:-left-4 lg:-left-2" style={depth(12)}>
            <div className="glass flex items-center gap-3 rounded-2xl p-2.5 pr-5">
              <Image src={media.product.src} alt="" width={Math.round((56 * media.product.width) / media.product.height)} height={56} className="h-14 w-auto" />
              <div>
                <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-blush-600 uppercase">{site.brand.manufacturer}</p>
                <p className="font-semibold text-plum-900">SomonDNA Plus</p>
              </div>
            </div>
          </div>
        </ParallaxStage>
      </Container>

      <TrustMarquee items={home.marquee} />
    </section>
  );
}

function TrustMarquee({ items }: { items: string[] }) {
  return (
    <div className="relative border-y border-plum-100/80 bg-white/60 py-4 backdrop-blur-sm">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
        <ul className="flex w-max gap-12 pr-12 motion-safe:animate-marquee hover:[animation-play-state:paused]">
          {[...items, ...items].map((item, i) => (
            <li key={`${item}-${i}`} aria-hidden={i >= items.length || undefined} className="flex items-center gap-3 text-sm font-semibold whitespace-nowrap text-plum-900 sm:text-[0.9375rem]">
              <SparkleIcon className="size-4 text-blush-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
