import { BankComparisonPageContent } from "@/components/marketing/bank-comparison-page-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/compare");

export default function CompareBanksPage() {
  return <BankComparisonPageContent />;
}
