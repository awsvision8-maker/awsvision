import { NonprofitPageContent } from "@/components/marketing/nonprofit-page-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/nonprofit");

export default function NonprofitPage() {
  return <NonprofitPageContent />;
}
