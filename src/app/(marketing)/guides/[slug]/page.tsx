import { notFound } from "next/navigation";
import { SeoGuideArticle } from "@/components/marketing/seo-guide-article";
import { pageMetadata } from "@/lib/seo";
import { SEO_GUIDES, getSeoGuide } from "@/lib/seo-guides";

export function generateStaticParams() {
  return SEO_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getSeoGuide(slug);
  if (!guide) return {};
  return pageMetadata(`/guides/${guide.slug}`);
}

export default async function SeoGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getSeoGuide(slug);
  if (!guide) notFound();
  return <SeoGuideArticle guide={guide} />;
}
