import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "Reset Password",
  description: "Choose a new password for your AWS Vision client portal.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
