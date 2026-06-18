import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { AdminShell } from "../admin-shell";

export const metadata: Metadata = {
  ...privateMetadata,
  title: "Admin Portal",
};

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
