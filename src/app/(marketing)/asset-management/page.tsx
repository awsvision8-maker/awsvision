import { ServiceHubPage } from "@/components/marketing/service-hub-page";
import { pageMetadata } from "@/lib/seo";
import { getServiceHub } from "@/lib/service-hubs";

export const metadata = pageMetadata("/asset-management");

export default function AssetManagementPage() {
  const hub = getServiceHub("asset-management")!;
  return <ServiceHubPage hub={hub} />;
}
