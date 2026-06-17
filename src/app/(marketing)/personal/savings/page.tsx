import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { SERVICE_PAGES } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/personal/savings");

export default function SavingsPage() {
  return <ServicePageLayout data={SERVICE_PAGES.savings} status="available" />;
}
