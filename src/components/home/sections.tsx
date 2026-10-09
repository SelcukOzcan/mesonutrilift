import Image from "next/image";
import Link from "next/link";
import type { City, Clinic } from "@/lib/clinics";
import { faq, home, media, site } from "@/lib/content";
import type { Video } from "@/lib/videos";
import { CountUp } from "../CountUp";
import { ArrowRightIcon, CheckIcon, ChevronDownIcon, ClockIcon, DnaIcon, DropletIcon, LeafIcon, MapPinIcon, ShieldIcon, SparkleIcon, SunIcon } from "../icons";
import { Spotlight } from "../motion";
import { ButtonLink, Container, cx, Eyebrow, SectionHeading } from "../ui";
import { VideoGallery } from "../videos/VideoGallery";
import { BeforeAfterCompare } from "./BeforeAfterCompare";
import { ClinicQuickSearch } from "./ClinicQuickSearch";

/* ─────────────── 3'lü etki: genişleyen paneller ─────────────── */
export function EffectsSection() {
  const { effects } = home;
  return (
    <section className="py-20 lg:py-28" aria-labelledby="etki-baslik">
      <Container>
        <SectionHeading id="etki-baslik" eyebrow={effects.eyebrow} title={effects.title} description={effects.description} align="center" className="reveal" />
        <div className="panels reveal -mx-4 mt-12 px-4 md:mx-0 md:px-0">
          {effects.items.map((item, i) => {
            const image = media[item.image];
            return (
              <article key={item.name} tabIndex={0} className="panel group relative min-h-[26rem] overflow-hidden rounded-[2rem] bg-plum-900 outline-offset-4 md:min-h-0">
                {/* Görselin altındaki gömülü yazı görünmesin diye çerçeve panelden uzun tutulur ve alt kısmı kesilir */}
                <div className="absolute inset-x-0 top-0 h-[142%]">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 55vw, 82vw" className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105" />
                </div>
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-plum-950/90 via-plum-950/25 to-transparent" />
                <span className="absolute top-5 right-5 text-sm font-bold text-white/70">{String(i + 1).padStart(2, "0")}</span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <span className="glass inline-block rounded-full px-3 py-1 text-xs font-bold tracking-[0.16em] text-plum-900 uppercase">{item.name}</span>
                  <h3 className="mt-4 text-2xl leading-tight font-bold sm:text-3xl">{item.title}</h3>
                  <p className="panel-detail mt-3 max-w-sm leading-relaxed text-white/80">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ─────────────── MesoNutrilift nedir: bento ızgara ─────────────── */
const ingredientIcons = [DnaIcon, DropletIcon, SparkleIcon, LeafIcon, ShieldIcon];

export function AboutSection() {
  const { about } = home;
  const [lead, ...rest] = about.ingredients;
  const LeadIcon = ingredientIcons[0];

  return (
    <section id="nedir" className="relative isolate overflow-hidden bg-plum-50/60 py-20 lg:py-28" aria-labelledby="nedir-baslik">
      <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
      <Container>
        <SectionHeading id="nedir-baslik" eyebrow={about.eyebrow} title={about.title} align="center" className="reveal" />

        <Spotlight className="mt-12 grid gap-4 lg:grid-cols-12">
          <div className="reveal relative isolate overflow-hidden rounded-[2rem] bg-linear-to-br from-plum-800 via-plum-700 to-plum-900 p-7 text-white sm:p-9 lg:col-span-5 lg:row-span-2">
            <div aria-hidden="true" className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-blush-400/30 blur-3xl" />
            <p className="text-xs font-bold tracking-[0.18em] text-blush-300 uppercase">Kısaca</p>
            <p className="mt-3 text-lg leading-relaxed text-white/90">{about.answer}</p>
            <div className="relative mt-6">
              <div aria-hidden="true" className="absolute inset-[18%] rounded-full bg-white/25 blur-2xl" />
              <Image src={media.product.src} alt={media.product.alt} width={media.product.width} height={media.product.height} sizes="(min-width: 1024px) 34vw, 80vw" className="relative mx-auto w-full max-w-sm drop-shadow-2xl" />
            </div>
          </div>

          <div data-spot className="spotlight reveal flex flex-col justify-between gap-6 rounded-[2rem] bg-white p-7 ring-1 ring-line sm:p-8 lg:col-span-7">
            <div className="space-y-4">
              {about.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-blush-600 uppercase">{home.indications.hotspotsTitle}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {home.indications.hotspots.map((spot) => (
                  <li key={spot.label} className="rounded-full bg-plum-50 px-3.5 py-1.5 text-sm font-semibold text-plum-800 ring-1 ring-plum-100">
                    {spot.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h3 className="sr-only">{about.ingredientsTitle}</h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              <li data-spot className="spotlight reveal flex items-start gap-4 rounded-[2rem] bg-white p-6 ring-1 ring-line sm:col-span-2">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-blush-300 to-blush-500 text-white shadow-lg">
                  <LeadIcon className="size-7" />
                </span>
                <div>
                  <p className="text-lg font-bold text-plum-900">{lead.name}</p>
                  <p className="mt-1 leading-snug text-muted">{lead.text}</p>
                </div>
              </li>
              {rest.map((ingredient, i) => {
                const Icon = ingredientIcons[(i + 1) % ingredientIcons.length];
                return (
                  <li key={ingredient.name} data-spot className="spotlight reveal flex items-start gap-4 rounded-[2rem] bg-white p-6 ring-1 ring-line">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-plum-100 text-plum-700">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{ingredient.name}</p>
                      <p className="mt-1 text-sm leading-snug text-muted">{ingredient.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Spotlight>
      </Container>
    </section>
  );
}

/* ─────────────── Hangi durumlarda: etkileşimli uygulama bölgeleri ─────────────── */
export function IndicationsSection() {
  const { indications } = home;
  return (
    <section className="overflow-x-clip py-20 lg:py-28" aria-labelledby="durumlar-baslik">
      <Container className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading id="durumlar-baslik" eyebrow={indications.eyebrow} title={indications.title} className="reveal" />
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {indications.items.map((item, i) => (
              <li key={item} className="reveal group flex items-start gap-3 rounded-2xl bg-cream p-4 ring-1 ring-line/70 transition-colors hover:bg-white hover:ring-plum-200">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-plum-700 ring-1 ring-plum-200 transition-colors group-hover:bg-plum-700 group-hover:text-white">
                  {i + 1}
                </span>
                <span className="text-[0.9375rem] leading-snug text-ink/90">{item}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted">{indications.note}</p>
        </div>

        <figure className="reveal relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-linear-to-br from-blush-100 via-blush-50 to-plum-100">
            <Image src={media.portrait.src} alt={media.portrait.alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          {indications.hotspots.map((spot) => (
            <button
              key={spot.label}
              type="button"
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={`${spot.label}: ${spot.text}`}
            >
              <span className="relative flex size-5">
                <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-white" />
                <span className="relative grid size-5 place-items-center rounded-full bg-plum-700 ring-4 ring-white/80 transition-transform group-hover:scale-125 group-focus-visible:scale-125">
                  <span className="size-1.5 rounded-full bg-white" />
                </span>
              </span>
              <span
                className={cx(
                  "glass pointer-events-none absolute top-1/2 w-max max-w-[11rem] -translate-y-1/2 scale-95 rounded-2xl px-3.5 py-2 text-left opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus:scale-100 group-focus:opacity-100",
                  spot.x > 45 ? "right-7" : "left-7",
                )}
              >
                <span className="block text-sm font-bold text-plum-900">{spot.label}</span>
                <span className="block text-xs leading-snug text-muted">{spot.text}</span>
              </span>
            </button>
          ))}
          <figcaption className="glass absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap text-plum-900">
            <SparkleIcon className="size-4 text-blush-500" />
            {indications.hotspotsTitle} · noktalara dokunun
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

/* ─────────────── Uygulama süreci: kaydırınca dolan zaman çizelgesi ─────────────── */
export function ProcessSection() {
  const { process } = home;
  return (
    <section id="uygulama" className="relative isolate overflow-hidden bg-plum-950 py-20 text-white lg:py-28" aria-labelledby="uygulama-baslik">
      <div aria-hidden="true" className="absolute -top-40 right-0 -z-10 size-[38rem] rounded-full bg-plum-600/40 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-48 -left-24 -z-10 size-[32rem] rounded-full bg-blush-500/20 blur-3xl" />
      <div aria-hidden="true" className="grain absolute inset-0 -z-10 opacity-40" />
      <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow tone="light">{process.eyebrow}</Eyebrow>
          <h2 id="uygulama-baslik" className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
            {process.title}
          </h2>
          <div className="mt-8 flex items-start gap-4 rounded-3xl bg-linear-to-br from-blush-300 to-blush-400 p-6 text-plum-950 shadow-[0_20px_60px_-25px_rgb(218_157_150/0.8)]">
            <ClockIcon className="size-7 shrink-0" />
            <div>
              <p className="text-xs font-bold tracking-[0.16em] uppercase">{process.plan.label}</p>
              <p className="mt-1.5 text-lg leading-snug font-semibold">{process.plan.text}</p>
            </div>
          </div>
          <ButtonLink href="/klinikler/" variant="light" size="lg" className="shine mt-8">
            <MapPinIcon className="size-5" />
            Uygulama yapan klinikleri görün
          </ButtonLink>
        </div>

        <div>
          <ol className="relative space-y-5 pl-14">
            <span aria-hidden="true" className="absolute top-3 bottom-3 left-[1.15rem] w-px bg-white/15" />
            <span aria-hidden="true" className="timeline-fill absolute top-3 bottom-3 left-[1.15rem] w-px bg-linear-to-b from-blush-300 via-plum-300 to-blush-300" />
            {process.steps.map((step, i) => (
              <li key={step.title} className="timeline-step relative">
                <span className="absolute top-5 -left-14 grid size-[2.3rem] place-items-center rounded-full bg-plum-950 text-sm font-bold text-blush-300 ring-1 ring-white/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-white/[0.09]">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/70">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="reveal mt-8 rounded-3xl bg-white p-6 text-ink sm:p-7">
            <h3 className="font-bold text-plum-900">{process.careTitle}</h3>
            <ul className="mt-4 space-y-3">
              {process.care.map((item) => (
                <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blush-100 text-blush-600">
                    <SunIcon className="size-4" />
                  </span>
                  <span className="pt-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────── Öncesi / sonrası: sürüklenebilir karşılaştırma ─────────────── */
export function ResultsSection() {
  const { results } = home;
  return (
    <section id="sonuclar" className="relative isolate overflow-hidden bg-cream py-20 lg:py-28" aria-labelledby="sonuclar-baslik">
      <div aria-hidden="true" className="absolute top-1/2 right-0 -z-10 size-[34rem] -translate-y-1/2 rounded-full bg-blush-200/60 blur-3xl" />
      <Container className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="reveal">
          <SectionHeading id="sonuclar-baslik" eyebrow={results.eyebrow} title={results.title} description={results.description} />
          <ul className="mt-8 space-y-3">
            {["Daha pürüzsüz cilt dokusu", "Daha eşit cilt tonu", "Daha sıkı ve canlı görünüm"].map((item) => (
              <li key={item} className="flex items-center gap-3 font-medium text-ink/90">
                <span className="grid size-6 place-items-center rounded-full bg-plum-700 text-white">
                  <CheckIcon className="size-3.5" strokeWidth={2.6} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">{results.disclaimer} Çizgiyi kaydırarak karşılaştırın.</p>
        </div>
        <div className="reveal">
          <BeforeAfterCompare images={media.beforeAfter} />
        </div>
      </Container>
    </section>
  );
}

/* ─────────────── TV yayınları: öne çıkan video + oynatma listesi ─────────────── */
export function VideoSection({ videos }: { videos: Video[] }) {
  const { videos: content } = home;
  return (
    <section id="tv-yayinlari" className="py-20 lg:py-28" aria-labelledby="video-baslik">
      <Container>
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="video-baslik" eyebrow={content.eyebrow} title={content.title} description={content.description} />
          <ButtonLink href={content.cta.href} variant="secondary" className="shrink-0 self-start md:self-auto">
            {content.cta.label}
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        </div>
        <VideoGallery initialVideos={videos} source={site.sheets.videos} layout="featured" limit={8} className="reveal mt-12" />
      </Container>
    </section>
  );
}

/* ─────────────── SSS ─────────────── */
export function FaqSection() {
  const { faq: content } = home;
  return (
    <section id="sss" className="bg-plum-50/50 py-20 lg:py-28" aria-labelledby="sss-baslik">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="sss-baslik" eyebrow={content.eyebrow} title={content.title} description={content.description} />
          <div className="relative mt-8 hidden overflow-hidden rounded-[2rem] lg:block">
            <Image src={media.faq.src} alt={media.faq.alt} width={media.faq.width} height={media.faq.height} sizes="30vw" className="aspect-[4/3] w-full object-cover object-top" />
            <div className="glass absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl p-4">
              <p className="text-sm font-semibold text-plum-900">Sorunuzu uygulamayı yapan hekime sorun</p>
              <ButtonLink href="/klinikler/" size="sm" className="shrink-0">
                Klinik bul
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {faq.map((item, i) => (
            <details key={item.question} className="faq-item group reveal rounded-3xl bg-white px-5 py-5 ring-1 ring-line transition-shadow open:shadow-card open:ring-plum-200 sm:px-7 [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-ink sm:text-lg">{item.question}</h3>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-plum-50 text-plum-700 transition-[transform,background-color] duration-300 group-open:rotate-180 group-open:bg-plum-700 group-open:text-white">
                  <ChevronDownIcon className="size-4" />
                </span>
              </summary>
              <div className="pt-3 pr-10 leading-relaxed text-muted">
                <p>{item.answer}</p>
                {item.link && (
                  <Link href={item.link.href} className="mt-3 inline-flex items-center gap-1.5 font-semibold text-plum-700 hover:text-plum-900">
                    {item.link.label}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─────────────── Klinik bulucu: canlı arama ─────────────── */
export function ClinicsCtaSection({ cities, clinics }: { cities: City[]; clinics: Clinic[] }) {
  const { clinicsCta } = home;
  const quickClinics = clinics.map(({ name, city, citySlug, district, districtSlug }) => ({ name, city, citySlug, district, districtSlug }));

  return (
    <section className="py-20 lg:py-28" aria-labelledby="klinik-cta-baslik">
      <Container>
        <div className="reveal relative isolate rounded-[2.75rem] bg-plum-900 px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden rounded-[2.75rem]">
            <div className="absolute -top-40 -right-24 size-[30rem] rounded-full bg-plum-500/60 blur-3xl motion-safe:animate-aurora" />
            <div className="absolute -bottom-48 left-1/4 size-[26rem] rounded-full bg-blush-400/30 blur-3xl motion-safe:animate-aurora-slow" />
            <div className="grain absolute inset-0 opacity-50" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow tone="light" className="justify-center">
              {clinicsCta.eyebrow}
            </Eyebrow>
            <h2 id="klinik-cta-baslik" className="mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
              {clinicsCta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{clinicsCta.description.replace("{count}", String(clinics.length))}</p>

            <div className="mx-auto mt-9 max-w-2xl text-left">
              <ClinicQuickSearch clinics={quickClinics} cities={cities} />
              <p className="mt-3 text-center text-sm text-white/55">{clinicsCta.searchHint}</p>
            </div>

            <dl className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/[0.07] px-4 py-5 ring-1 ring-white/10">
                <dt className="sr-only">Klinik sayısı</dt>
                <dd>
                  <CountUp value={clinics.length} onView className="block text-4xl font-extrabold" />
                  <span aria-hidden="true" className="text-sm text-white/60">uygulama noktası</span>
                </dd>
              </div>
              <div className="rounded-3xl bg-white/[0.07] px-4 py-5 ring-1 ring-white/10">
                <dt className="sr-only">İl sayısı</dt>
                <dd>
                  <CountUp value={cities.length} onView className="block text-4xl font-extrabold" />
                  <span aria-hidden="true" className="text-sm text-white/60">il</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-center text-xs font-bold tracking-[0.16em] text-blush-300 uppercase">{clinicsCta.citiesTitle}</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/klinikler/${city.slug}/`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/15 transition-colors hover:bg-white hover:text-plum-900">
                    {city.name}
                    <span className="text-xs opacity-60">{city.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 text-center">
            <ButtonLink href={clinicsCta.cta.href} variant="light" size="lg" className="shine">
              <MapPinIcon className="size-5" />
              {clinicsCta.cta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
