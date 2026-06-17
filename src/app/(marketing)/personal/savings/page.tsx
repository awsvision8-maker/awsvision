import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { SERVICE_PAGES } from "@/lib/site-data";

export default function SavingsPage() {
  return <ServicePageLayout data={SERVICE_PAGES.savings} status="available" />;
}
