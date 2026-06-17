import { LoanFacilityPageContent } from "@/components/marketing/loan-facility-page-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/auto-loans");

export default function AutoLoansPage() {
  return <LoanFacilityPageContent pageKey="auto-loans" />;
}
