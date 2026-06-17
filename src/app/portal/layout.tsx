import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { PortalShell } from "./portal-shell";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "Client Portal",
  description: "Secure AWS Vision client portal for account management.",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
