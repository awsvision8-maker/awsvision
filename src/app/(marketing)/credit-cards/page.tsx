import { CreditCardsPageContent } from "@/components/marketing/credit-cards-page-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/credit-cards");

export default function CreditCardsPage() {
  return <CreditCardsPageContent />;
}
