"use client";

import { usePathname } from "next/navigation";
import { breadcrumbJsonLd, contactPageJsonLd, locationServiceJsonLd, webPageJsonLd } from "@/lib/seo";

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Per-route breadcrumb + WebPage structured data for marketing pages */
export function PageJsonLd() {
  const pathname = usePathname() ?? "/";

  const schemas: object[] = [breadcrumbJsonLd(pathname)];

  const webPage = webPageJsonLd(pathname);
  if (webPage) schemas.push(webPage);

  const locationService = locationServiceJsonLd(pathname);
  if (locationService) schemas.push(locationService);

  if (pathname === "/contact" || pathname.startsWith("/contact")) {
    schemas.push(contactPageJsonLd());
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLdScript key={i} data={schema} />
      ))}
    </>
  );
}
