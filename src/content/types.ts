/**
 * İçerik şemaları. Bileşenler içeriğe yalnızca src/lib/content.ts üzerinden erişir;
 * ileride bir CMS'e geçildiğinde sadece o dosyadaki veri kaynağı değişir.
 */
import type { SheetSource } from "@/lib/sheets";

export type Link = { label: string; href: string };

export type ImageAsset = { src: string; width: number; height: number; alt: string };

export type SiteConfig = {
  name: string;
  tagline: string;
  url: string;
  locale: string;
  description: string;
  brand: { manufacturer: string; distributor: string; distributorUrl: string };
  contact: { address: string; phones: { label: string; value: string }[]; email: string };
  social: Record<string, string>;
  sheets: { clinics: SheetSource; videos: SheetSource };
};

export type MediaKey = "logo" | "logoWhite" | "logoRaster" | "logoDistributor" | "hero" | "og" | "product" | "effectFirm" | "effectBright" | "effectYoung" | "portrait" | "faq";

export type Media = Record<MediaKey, ImageAsset> & {
  beforeAfter: ImageAsset[];
  icons: { icon32: string; icon192: string; apple: string };
};

export type SectionIntro = { eyebrow: string; title: string; description?: string };

export type HomeContent = {
  hero: SectionIntro & {
    lead: string;
    primaryCta: Link;
    secondaryCta: Link;
    highlights: string[];
    /** Görselin çevresinde süzülen içerik etiketleri */
    chips: string[];
    /** Dönen rozet metni */
    badge: string;
    stats: { countries: number; clinicsLabel: string; citiesLabel: string; countriesLabel: string };
  };
  /** Hero altındaki kayan güven şeridi */
  marquee: string[];
  effects: SectionIntro & { items: { name: string; title: string; text: string; image: MediaKey }[] };
  about: SectionIntro & { answer: string; body: string[]; ingredientsTitle: string; ingredients: { name: string; text: string }[] };
  indications: SectionIntro & {
    items: string[];
    note: string;
    hotspotsTitle: string;
    /** Yüz görselindeki noktalar; x/y görsel üzerindeki yüzde konumu */
    hotspots: { label: string; text: string; x: number; y: number }[];
  };
  process: SectionIntro & {
    steps: { title: string; text: string }[];
    plan: { label: string; text: string };
    careTitle: string;
    care: string[];
  };
  results: SectionIntro & { disclaimer: string };
  videos: SectionIntro & { cta: Link };
  faq: SectionIntro;
  clinicsCta: { eyebrow: string; title: string; description: string; cta: Link; citiesTitle: string; searchHint: string };
};

export type FaqItem = { question: string; answer: string; link?: Link };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author?: string;
  reviewer?: string;
  category?: string;
  summary?: string;
  cover?: string;
  draft?: boolean;
};
