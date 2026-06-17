import type { MetadataRoute } from "next";
import { PAGE_SEO, SITEMAP_PATHS } from "@/lib/seo-config";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return SITEMAP_PATHS.map((path) => {
    const page = PAGE_SEO[path];
    return {
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: page?.changeFrequency ?? "monthly",
      priority: page?.priority ?? 0.5,
    };
  });
}
