import type { Link } from "@/content/types";

export function getNavLinks(hasPosts: boolean): Link[] {
  return [
    { label: "MesoNutrilift nedir?", href: "/#nedir" },
    { label: "Uygulama", href: "/#uygulama" },
    { label: "Öncesi & sonrası", href: "/#sonuclar" },
    { label: "TV yayınları", href: "/tv-yayinlari/" },
    { label: "SSS", href: "/#sss" },
    ...(hasPosts ? [{ label: "Blog", href: "/blog/" }] : []),
  ];
}
