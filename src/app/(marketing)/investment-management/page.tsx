import { ServiceHubPage } from "@/components/marketing/service-hub-page";
import { pageMetadata } from "@/lib/seo";
import { getServiceHub } from "@/lib/service-hubs";

export const metadata = pageMetadata("/investment-management");

export default function InvestmentManagementPage() {
  const hub = getServiceHub("investment-management")!;
  return <ServiceHubPage hub={hub} />;
}
