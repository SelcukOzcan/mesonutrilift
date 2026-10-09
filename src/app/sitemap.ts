import type { MetadataRoute } from "next";
import { getCities } from "@/lib/clinics";
import { absoluteUrl } from "@/lib/content";
import { getClinics } from "@/lib/data";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const cities = getCities(await getClinics());
  const posts = getAllPosts().filter((post) => !post.draft);

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/klinikler/"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...cities.map((city) => ({ url: absoluteUrl(`/klinikler/${city.slug}/`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: absoluteUrl("/tv-yayinlari/"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...(posts.length ? [{ url: absoluteUrl("/blog/"), lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 }] : []),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}/`), lastModified: new Date(post.updated ?? post.date), priority: 0.6 })),
  ];
}
