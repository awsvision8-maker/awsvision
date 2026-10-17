import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "Forgot Password",
  description: "Reset your AWS Vision client portal password by email.",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
