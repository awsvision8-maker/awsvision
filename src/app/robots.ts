import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/signup", "/signup/nonprofit"],
        disallow: ["/portal/", "/admin/", "/api/", "/kyc", "/login"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/portal/", "/admin/", "/api/", "/kyc", "/login"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
