import { ManagerShell } from "@/app/manager/manager-shell";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata;

export default function ManagerPortalLayout({ children }: { children: React.ReactNode }) {
  return <ManagerShell>{children}</ManagerShell>;
}
