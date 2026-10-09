/** schema.org yapılandırılmış veri üreticileri. */
import type { FaqItem, PostMeta } from "@/content/types";
import type { Clinic } from "./clinics";
import { absoluteUrl, media, site } from "./content";
import { displayTitle, thumbnailUrl, type Video } from "./videos";

const ORG_ID = absoluteUrl("/#organization");
const PRODUCT_ID = absoluteUrl("/#product");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.brand.distributor,
    url: site.brand.distributorUrl,
    logo: media.logoDistributor.src,
    email: site.contact.email,
    telephone: site.contact.phones[0]?.value,
    address: { "@type": "PostalAddress", streetAddress: site.contact.address, addressLocality: "İstanbul", addressCountry: "TR" },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: site.url,
    inLanguage: "tr-TR",
    publisher: { "@id": ORG_ID },
  };
}

export function productSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": PRODUCT_ID,
    name: site.name,
    alternateName: "SomonDNA Plus",
    description,
    image: [absoluteUrl(media.product.src), absoluteUrl(media.og.src), absoluteUrl(media.hero.src)],
    logo: absoluteUrl(media.logoRaster.src),
    brand: { "@type": "Brand", name: site.brand.manufacturer },
    manufacturer: { "@type": "Organization", name: site.brand.manufacturer },
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function clinicListSchema(clinics: Clinic[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: clinics.length,
    itemListElement: clinics.map((clinic, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalClinic",
        name: clinic.name,
        ...(clinic.phone && { telephone: clinic.phone }),
        ...(clinic.website && { url: clinic.website }),
        ...(clinic.instagram && { sameAs: [clinic.instagram] }),
        address: {
          "@type": "PostalAddress",
          streetAddress: clinic.address,
          ...(clinic.district && { addressLocality: clinic.district }),
          addressRegion: clinic.city,
          addressCountry: "TR",
        },
      },
    })),
  };
}

/** Google, video zengin sonuçları için yayın tarihi ister; tarihi olmayan videolar listeye eklenmez. */
export function videoListSchema(videos: Video[]) {
  const dated = videos.filter((v) => v.date);
  if (!dated.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: dated.map((video, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: displayTitle(video),
        description: [displayTitle(video), video.doctor, video.channel].filter(Boolean).join(" – "),
        thumbnailUrl: thumbnailUrl(video.id),
        uploadDate: video.date,
        contentUrl: video.url,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
      },
    })),
  };
}

/** Sağlık içeriği: sayfa MedicalWebPage, yazı BlogPosting; hekim incelemesi sayfa düzeyinde belirtilir. */
export function articleSchema(post: PostMeta) {
  const url = absoluteUrl(`/blog/${post.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    url,
    name: post.title,
    inLanguage: "tr-TR",
    lastReviewed: post.updated ?? post.date,
    ...(post.reviewer && { reviewedBy: { "@type": "Person", name: post.reviewer } }),
    mainEntity: {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      mainEntityOfPage: url,
      ...(post.cover && { image: post.cover }),
      ...(post.author && { author: { "@type": "Person", name: post.author } }),
      publisher: { "@id": ORG_ID },
      about: { "@id": PRODUCT_ID },
    },
  };
}
