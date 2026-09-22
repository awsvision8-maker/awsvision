import { BankComparisonPageContent } from "@/components/marketing/bank-comparison-page-content";
import { buildComparisonReport } from "@/lib/bank-comparison";
import { resolveActiveFdPromo } from "@/lib/server/fd-promo-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/compare");
export const revalidate = 86400;

const DEFAULT_PRINCIPAL = 50_000;

export default async function CompareBanksPage() {
  const promo = await resolveActiveFdPromo();
  const initialReport = buildComparisonReport(DEFAULT_PRINCIPAL, promo);

  return (
    <BankComparisonPageContent
      initialPrincipal={DEFAULT_PRINCIPAL}
      initialReport={initialReport}
    />
  );
}
