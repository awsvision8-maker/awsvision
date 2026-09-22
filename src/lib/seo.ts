import type { Metadata } from "next";
import { breadcrumbsForPath } from "@/lib/seo-breadcrumbs";
import { DEFAULT_KEYWORDS, PAGE_SEO, type PageSeo } from "@/lib/seo-config";
import { SITE } from "@/lib/site-config";

const BRAND_SUFFIX = "AWS Vision Financial";
const OG_IMAGE_PATH = "/og-image.png";

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

function verificationMeta(): Metadata["verification"] | undefined {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  if (!google && !bing) return undefined;
  const meta: Metadata["verification"] = {};
  if (google) meta.google = google;
  if (bing) meta.other = { "msvalidate.01": bing };
  return meta;
}

function sharedOgImages() {
  return [
    {
      url: absoluteUrl(OG_IMAGE_PATH),
      width: 1200,
      height: 630,
      alt: `${SITE.name} — ${SITE.tagline}`,
    },
    {
      url: absoluteUrl("/logo.png"),
      width: 512,
      height: 512,
      alt: `${SITE.name} logo`,
    },
  ];
}

/** Build Next.js Metadata for a marketing route */
export function pageMetadata(path: string, overrides?: Partial<PageSeo>): Metadata {
  const page = { ...PAGE_SEO[path], ...overrides, path };
  if (!page?.title) {
    return { title: SITE.name };
  }

  const url = absoluteUrl(page.path);
  const title = page.title;
  const description = page.description;
  const keywords = mergeKeywords(page);

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: { "en-US": url },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: BRAND_SUFFIX,
      title,
      description,
      images: sharedOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      site: "@awsvision",
      title,
      description,
      images: [absoluteUrl(OG_IMAGE_PATH)],
    },
    robots: page.noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: PAGE_SEO["/"].title,
    template: `%s | ${BRAND_SUFFIX}`,
  },
  description: PAGE_SEO["/"].description,
  keywords: [...DEFAULT_KEYWORDS],
  applicationName: BRAND_SUFFIX,
  authors: [{ name: BRAND_SUFFIX, url: getSiteUrl() }],
  creator: BRAND_SUFFIX,
  publisher: BRAND_SUFFIX,
  category: "Finance",
  classification: "Financial Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: getSiteUrl(),
    languages: { "en-US": getSiteUrl() },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: BRAND_SUFFIX,
    title: PAGE_SEO["/"].title,
    description: PAGE_SEO["/"].description,
    images: sharedOgImages(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@awsvision",
    title: PAGE_SEO["/"].title,
    description: PAGE_SEO["/"].description,
    images: [absoluteUrl(OG_IMAGE_PATH)],
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
  verification: verificationMeta(),
  // Nationwide / service-area focus — do not claim a fake Texas storefront
  other: {
    "geo.region": "US",
    "geo.placename": "United States",
  },
};

export const privateMetadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
};

const TEXAS_SERVICE_AREAS = [
  { "@type": "State", name: "Texas", containedInPlace: { "@type": "Country", name: "United States" } },
  { "@type": "City", name: "Dallas", containedInPlace: { "@type": "State", name: "Texas" } },
  { "@type": "City", name: "Houston", containedInPlace: { "@type": "State", name: "Texas" } },
  { "@type": "City", name: "Austin", containedInPlace: { "@type": "State", name: "Texas" } },
  { "@type": "City", name: "San Antonio", containedInPlace: { "@type": "State", name: "Texas" } },
  { "@type": "City", name: "Fort Worth", containedInPlace: { "@type": "State", name: "Texas" } },
] as const;

export function organizationJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${url}/#organization`,
    name: BRAND_SUFFIX,
    alternateName: [
      "AWS Vision",
      "AWS Vision Financial",
      "awsvision",
      "awsvision.com",
    ],
    url,
    logo: absoluteUrl("/logo.png"),
    image: [absoluteUrl(OG_IMAGE_PATH), absoluteUrl("/logo.png")],
    description:
      "AWS Vision Financial (awsvision.com) is an independent licensed financial services and investment management firm — online savings, fixed deposits, and wealth management. Not affiliated with Amazon Web Services (AWS) or Amazon.com.",
    disambiguatingDescription:
      "Independent investment firm at awsvision.com. Not Amazon Web Services computer vision, Rekognition, or AWS Marketplace.",
    slogan: SITE.tagline,
    telephone: SITE.phone,
    email: SITE.email,
    // Legal registered office (not a Texas retail branch)
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.line1,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      ...TEXAS_SERVICE_AREAS,
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    serviceType: [
      "Wealth Management",
      "Investment Management",
      "Savings Accounts",
      "Fixed Deposits",
      "Asset Management",
      "Online Banking",
      "Online Account Opening",
    ],
    knowsAbout: [
      "Investment management",
      "Fixed deposit accounts",
      "High yield savings",
      "Portfolio analytics",
      "Non-profit fund management",
      "Fintech asset management",
      "Texas online investment accounts",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        email: SITE.email,
        contactType: "customer service",
        areaServed: ["US", "TX"],
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE.phone,
        email: SITE.email,
        url: absoluteUrl("/contact"),
        areaServed: ["US", "TX"],
      },
    ],
    sameAs: [url, `https://${SITE.domain}`],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AWS Vision Financial Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Savings Account",
            url: absoluteUrl("/personal/savings"),
            areaServed: [{ "@type": "Country", name: "United States" }, { "@type": "State", name: "Texas" }],
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fixed Deposit Account",
            url: absoluteUrl("/personal/cds"),
            areaServed: [{ "@type": "Country", name: "United States" }, { "@type": "State", name: "Texas" }],
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Wealth Management Investment Plan",
            url: absoluteUrl("/wealth-management"),
            areaServed: [{ "@type": "Country", name: "United States" }, { "@type": "State", name: "Texas" }],
          },
        },
      ],
    },
  };
}

/** FAQ schema for Texas service page */
export function texasServiceFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can Texas residents open an AWS Vision account online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Texas residents can open savings, fixed deposit, and wealth management accounts entirely online with secure KYC verification. No in-person branch visit is required.",
        },
      },
      {
        "@type": "Question",
        name: "Does AWS Vision have a Texas office address?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AWS Vision is a service-based online financial firm. We serve Texas clients remotely. Our U.S. registered office is in Delaware, with corporate headquarters in Maryland. Contact us by phone at +1 (469) 754-2201 or email support@awsvision.com.",
        },
      },
      {
        "@type": "Question",
        name: "Which Texas cities does AWS Vision serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We serve clients statewide across Texas, including Dallas, Houston, Austin, San Antonio, Fort Worth, and surrounding metro areas, plus clients elsewhere in the United States.",
        },
      },
    ],
  };
}

export function websiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: BRAND_SUFFIX,
    alternateName: SITE.name,
    url,
    description: PAGE_SEO["/"].description,
    inLanguage: "en-US",
    publisher: { "@id": `${url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/help?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(pathname: string) {
  const crumbs = breadcrumbsForPath(pathname);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function webPageJsonLd(pathname: string) {
  const page = PAGE_SEO[pathname];
  if (!page) return null;
  const url = absoluteUrl(pathname);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    about: { "@id": `${getSiteUrl()}/#organization` },
    inLanguage: "en-US",
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: PAGE_SEO["/contact"].title,
    description: PAGE_SEO["/contact"].description,
    url: absoluteUrl("/contact"),
    mainEntity: { "@id": `${getSiteUrl()}/#organization` },
  };
}
