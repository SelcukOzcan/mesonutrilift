import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicDirectory } from "@/components/clinics/ClinicDirectory";
import { JsonLd } from "@/components/JsonLd";
import { CityLinks, HeroStats, PageHero, type Crumb } from "@/components/PageHero";
import { Container } from "@/components/ui";
import { getCities } from "@/lib/clinics";
import { site } from "@/lib/content";
import { getClinics } from "@/lib/data";
import { breadcrumbSchema, clinicListSchema } from "@/lib/schema";
import { locative } from "@/lib/text";

type Props = { params: Promise<{ il: string }> };

// Şehir sayfaları build sırasında Sheet'teki illerden üretilir. Yeni bir il eklendiğinde
// ana klinik listesinde hemen görünür; şehir sayfası bir sonraki build'de oluşur.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getCities(await getClinics()).map((city) => ({ il: city.slug }));
}

async function findCity(slug: string) {
  const clinics = await getClinics();
  const cities = getCities(clinics);
  const city = cities.find((c) => c.slug === slug);
  return city ? { city, cities, clinics } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await findCity((await params).il);
  if (!data) return {};
  const { city } = data;
  return {
    title: { absolute: `${locative(city.name)} MesoNutrilift Uygulayan Klinikler` },
    description: `${locative(city.name)} MesoNutrilift uygulaması yapan ${city.count} klinik ve hekim. Adres ve telefon bilgileriyle size en yakın kliniği bulun.`,
    alternates: { canonical: `/klinikler/${city.slug}/` },
  };
}

export default async function CityClinicsPage({ params }: Props) {
  const data = await findCity((await params).il);
  if (!data) notFound();
  const { city, cities, clinics } = data;
  const cityClinics = clinics.filter((c) => c.citySlug === city.slug);
  const districtCount = new Set(cityClinics.map((c) => c.districtSlug).filter(Boolean)).size;
  const crumbs: Crumb[] = [
    { name: "Ana sayfa", path: "/" },
    { name: "Uygulama noktaları", path: "/klinikler/" },
    { name: city.name, path: `/klinikler/${city.slug}/` },
  ];

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={`${city.name} · ${city.count} klinik`}
        title={`${locative(city.name)} MesoNutrilift uygulayan klinikler`}
        description={`${locative(city.name)} MesoNutrilift uygulaması yapan ${city.count} klinik ve hekimi aşağıda bulabilirsiniz. İlçeye göre filtreleyin, kliniği arayın ya da web sitesini ziyaret edin.`}
        aside={
          <HeroStats
            stats={[
              { value: city.count, label: "klinik" },
              ...(districtCount > 1 ? [{ value: districtCount, label: "ilçe" }] : []),
            ]}
          />
        }
      />
      <Container className="-mt-10 pb-20 lg:-mt-12 lg:pb-24">
        <ClinicDirectory initialClinics={clinics} source={site.sheets.clinics} presetCity={city.slug} />
      </Container>
      <CityLinks cities={cities} title="Diğer şehirlerdeki klinikler" current={city.slug} />
      <JsonLd data={[breadcrumbSchema(crumbs), clinicListSchema(cityClinics, `${locative(city.name)} MesoNutrilift uygulayan klinikler`)]} />
    </>
  );
}
