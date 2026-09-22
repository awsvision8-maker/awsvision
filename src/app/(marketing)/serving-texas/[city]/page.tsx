import { notFound } from "next/navigation";
import { TexasCityPageContent } from "@/components/marketing/texas-city-page";
import { pageMetadata } from "@/lib/seo";
import { TEXAS_CITIES, getTexasCity } from "@/lib/texas-cities";

export function generateStaticParams() {
  return TEXAS_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const city = getTexasCity(slug);
  if (!city) return {};
  return pageMetadata(`/serving-texas/${city.slug}`);
}

export default async function TexasCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const city = getTexasCity(slug);
  if (!city) notFound();
  return <TexasCityPageContent city={city} />;
}
