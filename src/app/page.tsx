import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/home/Hero";
import {
  AboutSection,
  ClinicsCtaSection,
  EffectsSection,
  FaqSection,
  IndicationsSection,
  ProcessSection,
  ResultsSection,
  VideoSection,
} from "@/components/home/sections";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { getCities } from "@/lib/clinics";
import { faq, home } from "@/lib/content";
import { getClinics, getVideos } from "@/lib/data";
import { faqSchema, organizationSchema, productSchema, websiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [clinics, videos] = await Promise.all([getClinics(), getVideos()]);
  const cities = getCities(clinics);

  return (
    <>
      <Hero clinicCount={clinics.length} cityCount={cities.length} />
      <EffectsSection />
      <AboutSection />
      <IndicationsSection />
      <ProcessSection />
      <ResultsSection />
      <VideoSection videos={videos} />
      <FaqSection />
      <ClinicsCtaSection cities={cities} clinics={clinics} />
      <MobileCtaBar />
      <JsonLd data={[websiteSchema(), organizationSchema(), productSchema(home.about.answer), faqSchema(faq)]} />
    </>
  );
}
