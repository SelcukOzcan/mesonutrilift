import type { Metadata } from "next";
import { ClinicDirectory } from "@/components/clinics/ClinicDirectory";
import { JsonLd } from "@/components/JsonLd";
import { CityLinks, HeroStats, PageHero, type Crumb } from "@/components/PageHero";
import { Container } from "@/components/ui";
import { getCities } from "@/lib/clinics";
import { site } from "@/lib/content";
import { getClinics } from "@/lib/data";
import { breadcrumbSchema, clinicListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "MesoNutrilift Uygulama Noktaları – Size En Yakın Klinik" },
  description:
    "MesoNutrilift uygulayan klinik ve hekimleri il ve ilçeye göre listeleyin. Size en yakın kliniği bulun, doğrudan arayın ya da web sitesini ziyaret edin.",
  alternates: { canonical: "/klinikler/" },
};

const crumbs: Crumb[] = [
  { name: "Ana sayfa", path: "/" },
  { name: "Uygulama noktaları", path: "/klinikler/" },
];

export default async function ClinicsPage() {
  const clinics = await getClinics();
  const cities = getCities(clinics);

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="Uygulama noktaları"
        title="MesoNutrilift uygulayan klinikler"
        description={`Türkiye genelinde ${cities.length} ilde ${clinics.length} klinik ve hekim. İl ve ilçe seçin ya da arayın; kliniği doğrudan arayarak veya web sitesini ziyaret ederek randevu alın.`}
        aside={
          <HeroStats
            stats={[
              { value: clinics.length, label: "uygulama noktası" },
              { value: cities.length, label: "il" },
            ]}
          />
        }
      />
      <Container className="-mt-10 pb-20 lg:-mt-12 lg:pb-24">
        <ClinicDirectory initialClinics={clinics} source={site.sheets.clinics} />
      </Container>
      <CityLinks cities={cities} title="Şehirlere göre MesoNutrilift klinikleri" />
      <JsonLd data={[breadcrumbSchema(crumbs), clinicListSchema(clinics, "MesoNutrilift uygulayan klinikler")]} />
    </>
  );
}
