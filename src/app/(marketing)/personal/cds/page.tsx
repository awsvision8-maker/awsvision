import { ServicePageLayout } from "@/components/marketing/service-page-layout";
import { getCdsServicePage } from "@/lib/service-pages-content";

export default function CDsPage() {
  return (
    <ServicePageLayout
      data={getCdsServicePage() as Parameters<typeof ServicePageLayout>[0]["data"]}
      status="available"
    />
  );
}
