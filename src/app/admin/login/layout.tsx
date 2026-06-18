import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "Admin Sign In",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
