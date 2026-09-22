import { ServiceHubPage } from "@/components/marketing/service-hub-page";
import { pageMetadata } from "@/lib/seo";
import { getServiceHub } from "@/lib/service-hubs";

export const metadata = pageMetadata("/investment-advisory");

export default function InvestmentAdvisoryPage() {
  const hub = getServiceHub("investment-advisory")!;
  return <ServiceHubPage hub={hub} />;
}
