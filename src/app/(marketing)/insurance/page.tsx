import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { SERVICE_PAGES } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/insurance");

export default function InsurancePage() {
  return <ServicePageLayout data={SERVICE_PAGES.insurance} status="comingSoon" />;
}
