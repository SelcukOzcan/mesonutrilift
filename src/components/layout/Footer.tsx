import Image from "next/image";
import Link from "next/link";
import { getCities } from "@/lib/clinics";
import { media, site } from "@/lib/content";
import { getClinics } from "@/lib/data";
import { compareTr } from "@/lib/text";
import { ArrowRightIcon, MailIcon, MapPinIcon, PhoneIcon } from "../icons";
import { ButtonLink, Container } from "../ui";
import { DnaHelix } from "./DnaHelix";

const telHref = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

const pages = [
  { href: "/klinikler/", label: "Uygulama noktaları" },
  { href: "/tv-yayinlari/", label: "TV yayınları" },
  { href: "/#nedir", label: "MesoNutrilift nedir?" },
  { href: "/#uygulama", label: "Nasıl uygulanır?" },
  { href: "/#sss", label: "Sıkça sorulan sorular" },
];

const headingClass = "text-xs font-bold tracking-[0.18em] text-blush-300 uppercase";

export async function Footer() {
  const clinics = await getClinics();
  const cities = getCities(clinics).sort((a, b) => compareTr(a.name, b.name));
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-plum-950 text-white/70">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 -left-32 size-[32rem] rounded-full bg-plum-700/50 blur-3xl" />
        <div className="absolute -right-24 bottom-24 size-[26rem] rounded-full bg-blush-500/15 blur-3xl" />
        <DnaHelix />
        <div className="grain absolute inset-0 opacity-50" />
      </div>

      {/* Klinik çağrısı */}
      <Container className="pt-16 lg:pt-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-white/[0.06] p-7 ring-1 ring-white/10 backdrop-blur-sm sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div aria-hidden="true" className="absolute -top-24 right-10 size-64 rounded-full bg-blush-400/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className={headingClass}>{site.tagline}</p>
            <p className="mt-3 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">Cildinize hak ettiği bakımı, size en yakın uzmanla verin.</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
              <span>
                <strong className="font-bold text-white">{clinics.length}</strong> uygulama noktası
              </span>
              <span aria-hidden="true" className="size-1 rounded-full bg-blush-300/70" />
              <span>
                <strong className="font-bold text-white">{cities.length}</strong> il
              </span>
            </p>
          </div>
          <ButtonLink href="/klinikler/" variant="light" size="lg" className="shine relative mt-8 shrink-0 lg:mt-0">
            <MapPinIcon className="size-5" />
            Size en yakın kliniği bulun
          </ButtonLink>
        </div>
      </Container>

      <Container className="grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_1.2fr_1.2fr]">
        <div className="max-w-xs">
          <Image src={media.logoWhite.src} alt={media.logoWhite.alt} width={media.logoWhite.width} height={media.logoWhite.height} className="h-12 w-auto" unoptimized />
          <p className="mt-6 text-sm leading-relaxed">
            MesoNutrilift, {site.brand.manufacturer} tarafından üretilmektedir. Türkiye distribütörü{" "}
            <a href={site.brand.distributorUrl} className="font-semibold text-white underline-offset-4 hover:underline" target="_blank" rel="noopener">
              {site.brand.distributor}
            </a>
            &apos;dır.
          </p>
        </div>

        <nav aria-label="Sayfalar">
          <h2 className={headingClass}>Sayfalar</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {pages.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Şehirlere göre klinikler">
          <h2 className={headingClass}>Şehirlere göre klinikler</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link href={`/klinikler/${city.slug}/`} className="group inline-flex items-baseline gap-1.5 transition-colors hover:text-white">
                  {city.name}
                  <span className="text-xs text-white/35 transition-colors group-hover:text-blush-300">{city.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>İletişim</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-blush-300" />
              <span>{site.contact.address}</span>
            </li>
            {site.contact.phones.map((phone) => (
              <li key={phone.value} className="flex gap-3">
                <PhoneIcon className="mt-0.5 size-4 shrink-0 text-blush-300" />
                <a href={telHref(phone.value)} className="hover:text-white">
                  {phone.value} <span className="text-white/40">({phone.label})</span>
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 size-4 shrink-0 text-blush-300" />
              <a href={`mailto:${site.contact.email}`} className="hover:text-white">
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex items-center justify-between gap-6 py-6 text-xs text-white/45">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p>
              © {year} {site.name}. Tüm hakları saklıdır.
            </p>
            <a href={site.brand.distributorUrl} target="_blank" rel="noopener" className="opacity-60 transition-opacity hover:opacity-100">
              <Image src={media.logoDistributor.src} alt={media.logoDistributor.alt} width={media.logoDistributor.width} height={media.logoDistributor.height} className="h-4 w-auto brightness-0 invert" />
            </a>
          </div>
          <a href="#ust" aria-label="Sayfanın başına dön" className="group relative grid size-12 shrink-0 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 48 48" aria-hidden="true" className="absolute inset-0 size-full -rotate-90">
              <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="22.5" fill="none" stroke="var(--color-blush-300)" strokeWidth="1.5" strokeLinecap="round" pathLength="100" strokeDasharray="100" className="scroll-ring" />
            </svg>
            <ArrowRightIcon className="size-5 -rotate-90 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </Container>
      </div>
    </footer>
  );
}
