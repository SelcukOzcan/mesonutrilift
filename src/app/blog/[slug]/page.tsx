import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, type Crumb } from "@/components/PageHero";
import { MapPinIcon } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";
import { getAllPosts, getPost } from "@/lib/posts";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

// Statik export en az bir sayfa ister. Henüz yayınlanmış yazı yoksa yalnızca 404 içeren
// bir yer tutucu üretilir (bağlantı verilmez, indekslenmez); ilk yazıyla birlikte kendiliğinden kalkar.
const EMPTY_PLACEHOLDER = "_yer-tutucu";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: EMPTY_PLACEHOLDER }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const { meta } = post;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/blog/${meta.slug}/` },
    openGraph: { type: "article", publishedTime: meta.date, modifiedTime: meta.updated ?? meta.date, ...(meta.cover && { images: [meta.cover] }) },
    ...(meta.draft && { robots: { index: false } }),
  };
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const { meta, html } = post;
  const crumbs: Crumb[] = [
    { name: "Ana sayfa", path: "/" },
    { name: "Blog", path: "/blog/" },
    { name: meta.title, path: `/blog/${meta.slug}/` },
  ];

  return (
    <>
      <PageHero crumbs={crumbs} eyebrow={meta.category} title={meta.title} description={meta.description} />
      <Container className="pt-2 pb-20 lg:pb-24">
        <article className="mx-auto max-w-3xl">
          <dl className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line pb-6 text-sm">
            <div className="flex gap-1.5">
              <dt className="text-muted">Yayın:</dt>
              <dd className="font-medium text-ink"><time dateTime={meta.date}>{formatDate(meta.date)}</time></dd>
            </div>
            {meta.updated && (
              <div className="flex gap-1.5">
                <dt className="text-muted">Son güncelleme:</dt>
                <dd className="font-medium text-ink"><time dateTime={meta.updated}>{formatDate(meta.updated)}</time></dd>
              </div>
            )}
            {meta.author && (
              <div className="flex gap-1.5">
                <dt className="text-muted">Yazar:</dt>
                <dd className="font-medium text-ink">{meta.author}</dd>
              </div>
            )}
            {meta.reviewer && (
              <div className="flex gap-1.5">
                <dt className="text-muted">Tıbbi olarak inceleyen:</dt>
                <dd className="font-medium text-ink">{meta.reviewer}</dd>
              </div>
            )}
          </dl>

          {meta.summary && (
            <aside className="mt-8 rounded-2xl border-l-4 border-blush-400 bg-blush-50 p-6">
              <p className="text-xs font-bold tracking-[0.16em] text-blush-700 uppercase">Kısaca</p>
              <p className="mt-2 leading-relaxed text-ink/90">{meta.summary}</p>
            </aside>
          )}

          <div className="prose-post mt-8" dangerouslySetInnerHTML={{ __html: html }} />

          <aside className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-plum-800 p-8 text-white sm:flex-row sm:items-center">
            <div>
              <p className="text-xl font-bold">MesoNutrilift uygulayan klinikler</p>
              <p className="mt-1 text-white/70">Size en yakın uygulama noktasını bulun.</p>
            </div>
            <ButtonLink href="/klinikler/" variant="light" size="lg">
              <MapPinIcon className="size-5" />
              Klinik bul
            </ButtonLink>
          </aside>
        </article>
      </Container>
      <JsonLd data={[breadcrumbSchema(crumbs), articleSchema(meta)]} />
    </>
  );
}
