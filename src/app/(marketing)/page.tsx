import { HomePage } from "@/components/marketing/home-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/");

export default function Home() {
  return <HomePage />;
}
