import { notFound } from "next/navigation";
import { UsStatePageContent } from "@/components/marketing/us-state-page";
import { pageMetadata } from "@/lib/seo";
import { US_STATES, getUsState } from "@/lib/us-locations";

export function generateStaticParams() {
  return US_STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getUsState(slug);
  if (!state) return {};
  return pageMetadata(`/serving-united-states/${state.slug}`);
}

export default async function UsStateRoutePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getUsState(slug);
  if (!state) notFound();
  return <UsStatePageContent state={state} />;
}
