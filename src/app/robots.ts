import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/content";

export const dynamic = "force-static";

// Yapay zeka arama motorlarında görünürlük hedeflendiği için bu botlara açıkça izin verilir.
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
