import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "KYC Verification",
};

export default function KycLayout({ children }: { children: React.ReactNode }) {
  return children;
}
