import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "Sign In",
  description: "Sign in to your AWS Vision client portal.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
