import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, type Crumb } from "@/components/PageHero";
import { ArrowRightIcon } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";
import { getAllPosts } from "@/lib/posts";

const posts = getAllPosts();

export const metadata: Metadata = {
  title: { absolute: "Blog – Cilt Gençleştirme ve MesoNutrilift Rehberi" },
  description: "Somon DNA, mezoterapi ve cilt yenileme hakkında hekim onaylı rehber yazılar.",
  alternates: { canonical: "/blog/" },
  // Yazı yokken sayfa indekslenmez
  robots: posts.length ? undefined : { index: false, follow: true },
};

const crumbs: Crumb[] = [
  { name: "Ana sayfa", path: "/" },
  { name: "Blog", path: "/blog/" },
];

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPage() {
  return (
    <>
      <PageHero crumbs={crumbs} eyebrow="Blog" title="Cilt gençleştirme rehberi" description="Somon DNA, mezoterapi ve cilt yenileme hakkında hekim onaylı yazılar." />
      <Container className="pt-4 pb-20 lg:pb-24">
        {posts.length ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}/`} className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-line transition-shadow hover:shadow-card hover:ring-plum-200">
                  {post.category && <span className="text-xs font-bold tracking-[0.14em] text-blush-600 uppercase">{post.category}</span>}
                  <h2 className="mt-3 text-xl leading-snug font-bold text-plum-900 group-hover:text-plum-700">{post.title}</h2>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{post.description}</p>
                  <p className="mt-6 flex items-center justify-between text-sm text-muted">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <ArrowRightIcon className="size-4 text-plum-700 transition-transform group-hover:translate-x-1" />
                  </p>
                  {post.draft && <span className="mt-3 self-start rounded-full bg-blush-100 px-2.5 py-0.5 text-xs font-semibold text-blush-700">Taslak – yalnızca geliştirmede görünür</span>}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl bg-cream px-6 py-16 text-center ring-1 ring-line">
            <p className="text-xl font-semibold text-plum-900">Yazılarımız çok yakında burada.</p>
            <p className="mt-2 text-muted">Bu sırada size en yakın uygulama noktasını bulabilirsiniz.</p>
            <ButtonLink href="/klinikler/" className="mt-6">
              Klinikleri görüntüle
            </ButtonLink>
          </div>
        )}
      </Container>
    </>
  );
}
