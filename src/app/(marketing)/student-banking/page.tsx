import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { SERVICE_PAGES } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/student-banking");

export default function StudentBankingPage() {
  return <ServicePageLayout data={SERVICE_PAGES["student-banking"]} status="comingSoon" />;
}
