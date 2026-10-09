/**
 * İçerik katmanı: sitenin tüm metin ve görsel referansları buradan okunur.
 * Bugün kaynak JSON dosyaları; ajans CMS'i hazır olduğunda bu fonksiyonlar
 * CMS API'sinden okuyacak şekilde değiştirilir, bileşenlere dokunulmaz.
 */
import siteJson from "@/content/site.json";
import mediaJson from "@/content/media.json";
import homeJson from "@/content/home.json";
import faqJson from "@/content/faq.json";
import type { FaqItem, HomeContent, Media, SiteConfig } from "@/content/types";

export const site = siteJson as SiteConfig;
export const media = mediaJson as unknown as Media;
export const home = homeJson as HomeContent;
export const faq = faqJson as FaqItem[];

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();
