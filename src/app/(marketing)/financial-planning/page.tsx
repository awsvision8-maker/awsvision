import { ServiceHubPage } from "@/components/marketing/service-hub-page";
import { pageMetadata } from "@/lib/seo";
import { getServiceHub } from "@/lib/service-hubs";

export const metadata = pageMetadata("/financial-planning");

export default function FinancialPlanningPage() {
  const hub = getServiceHub("financial-planning")!;
  return <ServiceHubPage hub={hub} />;
}
