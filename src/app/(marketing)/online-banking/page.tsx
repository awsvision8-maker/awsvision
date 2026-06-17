import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { SERVICE_PAGES } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/online-banking");

export default function OnlineBankingPage() {
  return <ServicePageLayout data={SERVICE_PAGES["online-banking"]} status="included" />;
}
