import { notFound, redirect } from "next/navigation";
import { UsCityPageContent } from "@/components/marketing/us-city-page";
import { pageMetadata } from "@/lib/seo";
import {
  US_CITIES_ROUTABLE,
  getUsCity,
  getUsCityRoutable,
  texasCityHref,
} from "@/lib/us-locations";

export function generateStaticParams() {
  return US_CITIES_ROUTABLE.map((c) => ({
    state: c.stateSlug,
    city: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;
  const row = getUsCityRoutable(state, city) ?? getUsCity(state, city);
  if (!row || row.texasCanonical) return {};
  return pageMetadata(`/serving-united-states/${row.stateSlug}/${row.slug}`);
}

export default async function UsCityRoutePage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;

  // Preserve existing Texas city URLs
  if (state === "texas") {
    const cityName =
      getUsCity(state, city)?.name ??
      city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const tx = texasCityHref(cityName);
    if (tx) redirect(tx);
  }

  const row = getUsCityRoutable(state, city);
  if (!row) notFound();
  return <UsCityPageContent city={row} />;
}
