import { InvestmentPageContent } from "@/components/marketing/investment-page-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/wealth-management");

export default function WealthManagementPage() {
  return <InvestmentPageContent />;
}
