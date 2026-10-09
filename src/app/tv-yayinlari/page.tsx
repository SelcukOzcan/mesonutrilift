import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { HeroStats, PageHero, type Crumb } from "@/components/PageHero";
import { ButtonLink, Container } from "@/components/ui";
import { VideoGallery } from "@/components/videos/VideoGallery";
import { MapPinIcon } from "@/components/icons";
import { site } from "@/lib/content";
import { getVideos } from "@/lib/data";
import { breadcrumbSchema, videoListSchema } from "@/lib/schema";
import { getChannels } from "@/lib/videos";

export const metadata: Metadata = {
  title: { absolute: "MesoNutrilift TV Yayınları ve Doktor Anlatımları" },
  description: "MesoNutrilift'i uygulayan hekimlerin televizyon programlarındaki anlatımlarını ve uzman görüşlerini izleyin.",
  alternates: { canonical: "/tv-yayinlari/" },
};

const crumbs: Crumb[] = [
  { name: "Ana sayfa", path: "/" },
  { name: "TV yayınları", path: "/tv-yayinlari/" },
];

export default async function VideosPage() {
  const videos = await getVideos();
  const videoSchema = videoListSchema(videos);
  const channelCount = getChannels(videos).length;

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="Doktorlar anlatıyor"
        title="MesoNutrilift TV yayınları"
        description="MesoNutrilift'i uygulayan hekimlerin televizyon programlarındaki anlatımlarını izleyin. Kanala göre filtreleyin ya da doktor adıyla arayın."
        aside={
          <HeroStats
            stats={[
              { value: videos.length, label: "yayın" },
              ...(channelCount ? [{ value: channelCount, label: "kanal" }] : []),
            ]}
          />
        }
      />
      <Container className="pt-4 pb-20 lg:pb-24">
        <VideoGallery initialVideos={videos} source={site.sheets.videos} filters />
        <div className="reveal relative isolate mt-16 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-plum-900 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div aria-hidden="true" className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-plum-500/60 blur-3xl" />
          <div>
            <p className="text-2xl font-bold">MesoNutrilift'i denemek ister misiniz?</p>
            <p className="mt-1 text-white/70">Size en yakın uygulama noktasını bulun.</p>
          </div>
          <ButtonLink href="/klinikler/" variant="light" size="lg" className="shine">
            <MapPinIcon className="size-5" />
            Klinik bul
          </ButtonLink>
        </div>
      </Container>
      <JsonLd data={videoSchema ? [breadcrumbSchema(crumbs), videoSchema] : breadcrumbSchema(crumbs)} />
    </>
  );
}
