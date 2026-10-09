/**
 * Blog yazıları: src/content/posts/*.md (frontmatter + Markdown gövde).
 * `draft: true` olan yazılar yalnızca geliştirme ortamında görünür; "_" ile başlayan dosyalar yok sayılır.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { PostMeta } from "@/content/types";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");
const showDrafts = process.env.NODE_ENV === "development";

const toIsoDate = (value: unknown) => (value instanceof Date ? value.toISOString().slice(0, 10) : value ? String(value) : undefined);

function readPost(file: string) {
  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
  const meta: PostMeta = {
    ...(data as Omit<PostMeta, "slug" | "date" | "updated">),
    slug: file.replace(/\.md$/, ""),
    date: toIsoDate(data.date) ?? "",
    updated: toIsoDate(data.updated),
  };
  return { meta, content };
}

function postFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
}

export function getAllPosts(): PostMeta[] {
  return postFiles()
    .map((file) => readPost(file).meta)
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<{ meta: PostMeta; html: string } | null> {
  const file = `${slug}.md`;
  if (!postFiles().includes(file)) return null;
  const { meta, content } = readPost(file);
  if (meta.draft && !showDrafts) return null;
  const html = String(
    await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSlug).use(rehypeStringify).process(content),
  );
  return { meta, html };
}
