import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  const base = getSiteUrl();
  return {
    name: "AWS Vision Financial",
    short_name: "AWS Vision",
    description:
      "Licensed financial services firm — savings, fixed deposits, and wealth management with monthly profit distribution.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0d9488",
    lang: "en-US",
    categories: ["finance", "business"],
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    scope: base,
    id: base,
    related_applications: [],
  };
}
