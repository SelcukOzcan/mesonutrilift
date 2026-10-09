import { getCities } from "@/lib/clinics";
import { absoluteUrl, faq, home, site } from "@/lib/content";
import { getClinics } from "@/lib/data";

export const dynamic = "force-static";

/** Yapay zeka asistanları için sitenin özet haritası (llmstxt.org biçimi). */
export async function GET() {
  const clinics = await getClinics();
  const cities = getCities(clinics);

  const body = [
    `# ${site.name}`,
    "",
    `> ${home.about.answer}`,
    "",
    `Üretici: ${site.brand.manufacturer}. Türkiye distribütörü: ${site.brand.distributor} (${site.brand.distributorUrl}).`,
    `MesoNutrilift yalnızca hekimler tarafından klinik ortamında uygulanır. Türkiye'de ${cities.length} ilde ${clinics.length} uygulama noktası bulunur.`,
    "",
    "## Sayfalar",
    `- [Ana sayfa](${absoluteUrl("/")}): MesoNutrilift nedir, içerik, uygulama süreci, öncesi/sonrası ve sıkça sorulan sorular`,
    `- [Uygulama noktaları](${absoluteUrl("/klinikler/")}): MesoNutrilift uygulayan tüm klinikler, adres ve telefonlarıyla`,
    `- [TV yayınları](${absoluteUrl("/tv-yayinlari/")}): Hekimlerin televizyon programlarındaki anlatımları`,
    "",
    "## Şehirlere göre klinikler",
    ...cities.map((city) => `- [${city.name} (${city.count} klinik)](${absoluteUrl(`/klinikler/${city.slug}/`)})`),
    "",
    "## Sıkça sorulan sorular",
    ...faq.flatMap((item) => [`### ${item.question}`, item.answer, ""]),
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
