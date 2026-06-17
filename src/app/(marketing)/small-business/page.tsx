import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { SERVICE_PAGES } from "@/lib/site-data";

export default function SmallBusinessPage() {
  return <ServicePageLayout data={SERVICE_PAGES["small-business"]} status="comingSoon" />;
}
