import { ServiceHubPage } from "@/components/marketing/service-hub-page";
import { pageMetadata } from "@/lib/seo";
import { getServiceHub } from "@/lib/service-hubs";

export const metadata = pageMetadata("/portfolio-management");

export default function PortfolioManagementPage() {
  const hub = getServiceHub("portfolio-management")!;
  return <ServiceHubPage hub={hub} />;
}
