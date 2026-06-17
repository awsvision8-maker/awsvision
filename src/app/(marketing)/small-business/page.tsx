import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { SERVICE_PAGES } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/small-business");

export default function SmallBusinessPage() {
  return <ServicePageLayout data={SERVICE_PAGES["small-business"]} status="comingSoon" />;
}
