import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { getCdsServicePage } from "@/lib/service-pages-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/personal/cds");

export default async function CDsPage() {
  const data = await getCdsServicePage();
  return (
    <ServicePageLayout
      data={data as Parameters<typeof ServicePageLayout>[0]["data"]}
      status="available"
    />
  );
}
