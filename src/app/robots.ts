import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

/**
 * Allow all public marketing URLs for every crawler.
 * Only block authenticated / private app surfaces.
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const disallow = ["/portal/", "/admin/", "/manager/", "/api/", "/kyc", "/login"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
