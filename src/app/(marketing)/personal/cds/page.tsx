import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { getCdsServicePage } from "@/lib/service-pages-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/personal/cds");

export default function CDsPage() {
  return (
    <ServicePageLayout
      data={getCdsServicePage() as Parameters<typeof ServicePageLayout>[0]["data"]}
      status="available"
    />
  );
}
