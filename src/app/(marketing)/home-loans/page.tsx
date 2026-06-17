import { LoanFacilityPageContent } from "@/components/marketing/loan-facility-page-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/home-loans");

export default function HomeLoansPage() {
  return <LoanFacilityPageContent pageKey="home-loans" />;
}
