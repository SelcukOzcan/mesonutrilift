import { isNo, isYes, pick, type SheetRow } from "./sheets";
import { compareTr, fold, slugify, titleTr } from "./text";

export type Clinic = {
  id: string;
  name: string;
  city: string;
  citySlug: string;
  district: string;
  districtSlug: string;
  /** İstanbul için yaka bilgisi ("Avrupa Yakası"); Sheet'te "İstanbul_Avrupa" ya da "Yaka" sütunundan */
  area: string;
  address: string;
  phone: string;
  phoneHref: string;
  website: string;
  websiteLabel: string;
  instagram: string;
  whatsappHref: string;
  featured: boolean;
  /** Hastane / Klinik / Hekim — Sheet'teki "Tür" sütunundan ya da isimden */
  kind: string;
  /** Kart üzerindeki monogram (ör. "NC") */
  initials: string;
};

export type City = { name: string; slug: string; count: number };

/** Sheet sütun başlıkları (fold edilmiş). İlk eşleşen kullanılır. */
const COLUMNS = {
  name: ["klinik / doktor", "klinik", "klinik adi", "klinik / doktor / hastane", "klink / doktor / hastane", "ad", "isim"],
  city: ["il", "sehir"],
  district: ["ilce"],
  area: ["yaka", "bolge"],
  address: ["adres"],
  phone: ["telefon", "tel"],
  website: ["web", "web sitesi", "website"],
  instagram: ["instagram"],
  whatsapp: ["whatsapp"],
  featured: ["one cikan"],
  active: ["aktif", "yayinda"],
  kind: ["tur", "tip", "kurum turu"],
} as const;

function inferKind(name: string): string {
  if (/hastane|hospital/i.test(name)) return "Hastane";
  if (/poliklinik|tıp merkezi|tip merkezi|klinik|clinic|estetik|aesthetic|sağlık grubu|merkezi/i.test(name)) return "Klinik";
  return "Hekim";
}

const TITLES = /^(prof|doç|doc|dr|uzm|op|özel|ozel)\.?$/i;

/** "Nera Clinic / Dr. Nuran Erdağı" → "NC", "Uzm. Dr. Şafak Göktaş" → "ŞG" */
function initialsOf(name: string): string {
  const words = name
    .split("/")[0]
    .replace(/\./g, ". ")
    .split(/\s+/)
    .filter((w) => w && !TITLES.test(w));
  return words
    .slice(0, 2)
    .map((w) => w[0].toLocaleUpperCase("tr-TR"))
    .join("");
}

export function formatPhone(raw: string): { display: string; href: string } {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return { display: "", href: "" };
  if (digits.length === 12 && digits.startsWith("90")) digits = digits.slice(2);
  if (digits.length === 10 && !digits.startsWith("0")) digits = `0${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) {
    const d = digits;
    return { display: `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9)}`, href: `tel:+90${d.slice(1)}` };
  }
  if (digits.length === 7 && digits.startsWith("444")) {
    return { display: `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`, href: `tel:${digits}` };
  }
  return { display: raw.trim(), href: `tel:${digits}` };
}

export function safeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".") ? url.href : "";
  } catch {
    return "";
  }
}

const hostLabel = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

function instagramUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith("@")) return `https://www.instagram.com/${value.slice(1)}/`;
  return safeUrl(value);
}

function whatsappUrl(raw: string): string {
  const { href } = formatPhone(raw);
  const digits = href.replace(/\D/g, "");
  return digits.length >= 10 ? `https://wa.me/${digits}` : "";
}

/** "İstanbul_Avrupa" → { city: "İstanbul", area: "Avrupa Yakası" } */
function splitCity(raw: string): { city: string; area: string } {
  const [cityPart = "", ...rest] = raw.split("_");
  const side = titleTr(rest.join(" "));
  const isShore = ["avrupa", "anadolu"].includes(fold(side));
  return { city: titleTr(cityPart), area: isShore ? `${side} Yakası` : side };
}

export function normalizeClinics(rows: SheetRow[]): Clinic[] {
  const seen = new Map<string, number>();
  const clinics: Clinic[] = [];

  for (const row of rows) {
    const name = pick(row, COLUMNS.name);
    if (!name) continue;
    const active = pick(row, COLUMNS.active);
    if (active && isNo(active)) continue;

    const { city, area } = splitCity(pick(row, COLUMNS.city));
    const district = titleTr(pick(row, COLUMNS.district).replace(/_/g, " "));
    const phone = formatPhone(pick(row, COLUMNS.phone));
    let website = safeUrl(pick(row, COLUMNS.website));
    let instagram = instagramUrl(pick(row, COLUMNS.instagram));
    if (website.includes("instagram.com")) {
      instagram ||= website;
      website = "";
    }

    const baseId = slugify(`${name} ${city}`) || "klinik";
    const n = (seen.get(baseId) ?? 0) + 1;
    seen.set(baseId, n);

    clinics.push({
      id: n > 1 ? `${baseId}-${n}` : baseId,
      name,
      city,
      citySlug: slugify(city),
      district,
      districtSlug: slugify(district),
      area: pick(row, COLUMNS.area) || area,
      address: pick(row, COLUMNS.address),
      phone: phone.display,
      phoneHref: phone.href,
      website,
      websiteLabel: hostLabel(website),
      instagram,
      whatsappHref: whatsappUrl(pick(row, COLUMNS.whatsapp)),
      featured: isYes(pick(row, COLUMNS.featured)),
      kind: pick(row, COLUMNS.kind) || inferKind(name),
      initials: initialsOf(name) || "M",
    });
  }

  // Öne çıkanlar başa; geri kalanlar Sheet'teki sırayı korur.
  return clinics.map((c, i) => ({ c, i })).sort((a, b) => Number(b.c.featured) - Number(a.c.featured) || a.i - b.i).map(({ c }) => c);
}

export function getCities(clinics: Clinic[]): City[] {
  const map = new Map<string, City>();
  for (const clinic of clinics) {
    if (!clinic.citySlug) continue;
    const city = map.get(clinic.citySlug) ?? { name: clinic.city, slug: clinic.citySlug, count: 0 };
    city.count += 1;
    map.set(clinic.citySlug, city);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || compareTr(a.name, b.name));
}
