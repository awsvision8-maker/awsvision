import { ManagerShell } from "@/app/manager/manager-shell";

export default function ManagerPortalLayout({ children }: { children: React.ReactNode }) {
  return <ManagerShell>{children}</ManagerShell>;
}
