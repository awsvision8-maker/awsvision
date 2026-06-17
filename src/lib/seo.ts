import type { Metadata } from "next";
import { DEFAULT_KEYWORDS, PAGE_SEO, type PageSeo } from "@/lib/seo-config";
import { SITE } from "@/lib/site-config";

/** Canonical site URL for metadata, sitemap, and JSON-LD */
export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return SITE.url.replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

function mergeKeywords(page?: PageSeo) {
  const set = new Set([...DEFAULT_KEYWORDS, ...(page?.keywords ?? [])]);
  return Array.from(set);
}

/** Build Next.js Metadata for a marketing route */
export function pageMetadata(path: string, overrides?: Partial<PageSeo>): Metadata {
  const page = { ...PAGE_SEO[path], ...overrides, path };
  if (!page?.title) {
    return { title: SITE.name };
  }

  const url = absoluteUrl(page.path);
  const title = page.title.includes(SITE.name) ? page.title : `${page.title}`;
  const description = page.description;
  const keywords = mergeKeywords(page);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE.name,
      title,
      description,
      images: [
        {
          url: absoluteUrl("/logo.png"),
          width: 512,
          height: 512,
          alt: `${SITE.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/logo.png")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: PAGE_SEO["/"].title,
  description: PAGE_SEO["/"].description,
  keywords: [...DEFAULT_KEYWORDS],
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: getSiteUrl() }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: SITE.name,
    title: PAGE_SEO["/"].title,
    description: PAGE_SEO["/"].description,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: `${SITE.name} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SEO["/"].title,
    description: PAGE_SEO["/"].description,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "finance",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const privateMetadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: SITE.name,
    url: getSiteUrl(),
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl("/logo.png"),
    description: SITE.tagline,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.line1,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
    areaServed: ["US", "AE"],
    sameAs: [getSiteUrl()],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: getSiteUrl(),
    description: PAGE_SEO["/"].description,
    publisher: { "@type": "Organization", name: SITE.name },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getSiteUrl()}/help?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
