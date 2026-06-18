import { HomePage } from "@/components/marketing/home-page";
import { HomeSeoContent } from "@/components/marketing/home-seo-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/");

export default function Home() {
  return (
    <>
      <HomePage />
      <HomeSeoContent />
    </>
  );
}
