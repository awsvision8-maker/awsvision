import { LoanFacilityPageContent } from "@/components/marketing/loan-facility-page-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/personal-loans");

export default function PersonalLoansPage() {
  return <LoanFacilityPageContent pageKey="personal-loans" />;
}
