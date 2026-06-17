import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { SERVICE_PAGES } from "@/lib/site-data";

export default function StudentBankingPage() {
  return <ServicePageLayout data={SERVICE_PAGES["student-banking"]} status="comingSoon" />;
}
