"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Bell,
  Briefcase,
  LayoutDashboard,
  LineChart,
  LogOut,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ManagerProvider, useManager } from "@/lib/manager-context";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/manager/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/manager/clients", label: "Clients", icon: Users },
  { href: "/manager/markets", label: "Markets", icon: LineChart },
  { href: "/manager/notifications", label: "Notifications", icon: Bell },
] as const;

function ManagerGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useManager();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/manager/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

function ManagerNav() {
  const { manager, logout } = useManager();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.replace("/manager/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-400">
                AWS Vision Brand Ambassador
              </p>
              <p className="text-sm font-semibold">
                {manager?.firstName} {manager?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/referral-program"
              className="hidden text-xs text-slate-400 hover:text-white sm:block"
            >
              Program Guide
            </Link>
            <Logo size="xs" href="/" className="opacity-70" />
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Banking-style tab bar */}
        <nav
          className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-0 sm:-mx-6 sm:px-6"
          aria-label="Ambassador portal sections"
        >
          {TABS.map((tab) => {
            const active =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-teal-400 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function ManagerShell({ children }: { children: React.ReactNode }) {
  return (
    <ManagerProvider>
      <ManagerGate>
        <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-teal-50/40">
          <ManagerNav />
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </ManagerGate>
    </ManagerProvider>
  );
}
